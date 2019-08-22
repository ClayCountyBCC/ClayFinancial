using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.DirectoryServices.AccountManagement;

namespace ClayFinancial.Models
{
  public class UserAccess
  {
    private const string basic_access_group = "gReceiptAppBasicAccess"; // We may make this an argument if we end up using this code elsewhere.
    private const string finance_access_group = "gReceiptAppFinanceAccess";
    private const string admin_access_group = "gReceiptAppAdminAccess";
    private const string mis_access_group = "gMISDeveloper_Group";


    public bool authenticated { get; set; } = false;

    public string user_name { get; set; }
    public int employee_id { get; set; } = 0;
    public string display_name { get; set; } = "";

    public enum access_type : int
    {
      no_access = 0,
      basic_access = 1, // They get treated like public users.
      finance_access = 2,
      admin_access = 3,
      mis_access = 4
    }
    public access_type current_access { get; set; } = access_type.no_access;// default to no_access.

    public UserAccess(string name)
    {
      user_name = name;
      if (user_name.Length == 0)
      {
        user_name = "clayIns";
        display_name = "Public User";
      }
      else
      {
        display_name = name;
        using (PrincipalContext pc = new PrincipalContext(ContextType.Domain))
        {
          try
          {
            var up = UserPrincipal.FindByIdentity(pc, user_name);
            ParseUser(up);
          }
          catch (Exception ex)
          {
            new ErrorLog(ex);
          }
        }
      }
    }

    public UserAccess(UserPrincipal up)
    {
      ParseUser(up);
    }

    private void ParseUser(UserPrincipal up)
    {
      try
      {
        if (up != null)
        {
          user_name = up.SamAccountName.ToLower();
          authenticated = true;
          display_name = up.DisplayName;
          if (int.TryParse(up.EmployeeId, out int eid))
          {
            employee_id = eid;
          }
          var groups = (from g in up.GetAuthorizationGroups()
                        select g.Name).ToList();
          if (groups.Contains(mis_access_group))
          {
            current_access = access_type.mis_access;
          }
          else
          {
            if (groups.Contains(admin_access_group))
            {
              current_access = access_type.admin_access;
            }
            else
            {
              if (groups.Contains(finance_access_group))
              {
                current_access = access_type.finance_access;
              }
              else
              {
                current_access = access_type.basic_access;
              }
            }
          }
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex);
      }
    }

    private static void ParseGroup(string group, ref Dictionary<string, UserAccess> d)
    {
      using (PrincipalContext pc = new PrincipalContext(ContextType.Domain))
      {
        using (GroupPrincipal gp = GroupPrincipal.FindByIdentity(pc, group))
        {
          if (gp != null)
          {
            foreach (UserPrincipal up in gp.GetMembers())
            {
              if (up != null)
              {
                if (!d.ContainsKey(up.SamAccountName.ToLower()))
                {
                  d.Add(up.SamAccountName.ToLower(), new UserAccess(up));
                }
              }
            }
          }
        }
      }
    }

    public static Dictionary<string, UserAccess> GetAllUserAccess()
    {
      var d = new Dictionary<string, UserAccess>();

      try
      {
        switch (Environment.MachineName.ToUpper())
        {

          case "CLAYBCCDMZIIS01":
            d[""] = new UserAccess("");
            break;

          case "MISSL01":
            d["mccartneyd"] = new UserAccess("mccartneyd");
            break;

          default:
            ParseGroup(finance_access_group, ref d);
            ParseGroup(mis_access_group, ref d);
            ParseGroup(basic_access_group, ref d);
            ParseGroup(admin_access_group, ref d);
            d[""] = new UserAccess("");
            break;

        }
        return d;
      }
      catch (Exception ex)
      {
        new ErrorLog(ex);
        return null;
      }
    }

    public static UserAccess GetUserAccess(string Username)
    {
      try
      {
        string un = Username.Replace(@"CLAYBCC\", "").ToLower();
        switch (Environment.MachineName.ToUpper())
        {
          default:
            var d = GetCachedAllUserAccess();

            if (d.ContainsKey(un))
            {
              return d[un]; // we're dun
            }
            else
            {
              return d[""];
            }
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex);
        return null;
      }
    }

    public static Dictionary<string, UserAccess> GetCachedAllUserAccess()
    {
      return (Dictionary<string, UserAccess>)myCache.GetItem("useraccess");
    }
  }
}