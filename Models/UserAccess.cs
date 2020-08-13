using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.DirectoryServices.AccountManagement;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace ClayFinancial.Models
{
  public class UserAccess
  {
    private const string basic_access_group = "gReceiptAppAccessByDepartment"; // We may make this an argument if we end up using this code elsewhere.
    private const string finance_Level_one_group = "gReceiptAppFinanceLevelOneAccess";
    private const string finance_Level_two_group = "gReceiptAppFinanceLevelTwoAccess";
    private const string maintenance_access_group = "gReceiptAppMaintenanceAccess";
    private const string mis_access_group = "gMISDeveloper_Group";


    public bool authenticated { get; set; } = false;
    public string finplus_department { get; set; } = "";
    public string user_name { get; set; }
    public int employee_id { get; set; } = 0;
    public int my_department_id { get; set; } = -1;
    public string display_name { get; set; } = "";
    public bool maintenance_user { get; set; } = false;

    public enum access_type : int
    {
      no_access = 0,
      basic = 1, 
      finance_level_one = 2,
      finance_level_two = 3,    
      mis_access = 5
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
        if (up == null) return;

        user_name = up.SamAccountName.ToLower();
        authenticated = true;
        display_name = up.DisplayName;
        if (int.TryParse(up.EmployeeId, out int eid))
        {
          employee_id = eid;
        }

        finplus_department = GetFinplusDepartment().Trim();
        UpdateDepartmentalAccess();

        var groups = (from g in up.GetAuthorizationGroups()
                      select g.Name).ToList();
        maintenance_user = groups.Contains(maintenance_access_group);

        if (groups.Contains(mis_access_group))
        {
          current_access = access_type.mis_access;
          maintenance_user = true;
          
          return;
        }

        if (groups.Contains(finance_Level_one_group))
        {
          current_access = access_type.finance_level_one;
          return;
        }

        if (groups.Contains(finance_Level_two_group))
        {
          current_access = access_type.finance_level_two;
          return;
        }

        if (groups.Contains(basic_access_group))
        {
          current_access = access_type.basic;
        }
        
      }
      catch (Exception ex)
      {
        var data = $@"


             /**
            
             Function: UserAccess.ParseUser()
             user_name: {user_name};
             display_name: {display_name};
             current_access: {current_access};
             finplus_department: {finplus_department};

             **/


          ";
        new ErrorLog("ClayFinancial User Department Missing", 
                     data + @"

                      " +  ex.Message,
                     "","","");
      }
    }

    private void UpdateDepartmentalAccess()
    {
      my_department_id = GetDepartmentsCanAccess();
    }

    private string GetFinplusDepartment()
    {
      try
      {
        if (employee_id == 0) return "";
        var dp = new DynamicParameters();
        dp.Add("employee_id", employee_id.ToString());
        string query = "SELECT home_orgn FROM finplus51.dbo.employee WHERE empl_no=@employee_id";
        var department = Constants.Get_Data<string>(query, dp, Constants.ConnectionString.Finplus);
        if (!department.Any() || department.First().Length == 0)
        {

          var data = $@"


             /**

             Function: UserAccess.GetFinPlusDepartment()
             user_name: {user_name};
             display_name: {display_name};
             current_access: {current_access};
             finplus_department: {finplus_department};

             **/


          ";

          new ErrorLog("User Department Missing", data, "", "", "");
          return "";
        }
        else
        {
          return department.First().Trim();
        }
      }
      catch(Exception ex)
      {
        new ErrorLog(ex);
        return "";
      }
    }

    private int GetDepartmentsCanAccess()
    {
      if (finplus_department.Trim().Length == 0) return -1;

      foreach(Transaction.Department d in Transaction.Department.GetCached())
      {
        if(d.organization.Length > 0)
        {
          if (d.organization_access.Contains(finplus_department.Trim()))
              return d.department_id;
        }
      }


      return my_department_id;
    }

    private static void ParseGroup(string group, ref Dictionary<string, UserAccess> d)
    {
      try
      {
        using (PrincipalContext pc = new PrincipalContext(ContextType.Domain))
        {
          using (GroupPrincipal gp = GroupPrincipal.FindByIdentity(pc, IdentityType.Name, group))
          {
            if (gp != null)
            {

              foreach (UserPrincipal up in gp.Members)
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
      catch (Exception ex)
      {
        new ErrorLog(ex);
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

          //case "MISSL01":
          //  d["mccartneyd"] = new UserAccess("mccartneyd");
          //  break;
          case "MISHLO5":
            d["westje"] = new UserAccess("westje");
            break;
          default:
            ParseGroup(finance_Level_one_group, ref d);
            ParseGroup(finance_Level_two_group, ref d);
            ParseGroup(mis_access_group, ref d);
            ParseGroup(basic_access_group, ref d);
            ParseGroup(maintenance_access_group, ref d);
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

    public static int GetEmployeeIdFromDisplayName(string name)
    {
      var users = UserAccess.GetCachedAllUserAccess();
      foreach(string key in users.Keys)
      {
        if (users[key].display_name == name) return users[key].employee_id;

      }
      return -1;
    }

    public static List<string> GetAllUserDisplayNames()
    {
      var name_list = new List<string>();
      var users = UserAccess.GetCachedAllUserAccess();
      // Added some conditionals to this list so that we wouldn't display the people with MIS access
      // and the user with no access.
      foreach (string key in users.Keys)
      {
        var access = users[key].current_access;
        if (access != access_type.no_access && access != access_type.mis_access) name_list.Add(users[key].display_name);

      }
      return name_list;
    }

    public static UserAccess GetUserAccessByDisplayName(string name)
    {
      var users = UserAccess.GetCachedAllUserAccess();
      foreach(string key in users.Keys)
      {
        if (users[key].display_name == name) return users[key];
      }
      return null;
    }

    public static List<string> GetCachedUserDisplayNames(string my_name)
    {
      var names = (List<string>)myCache.GetItem("list_of_names");
      var filtered = (from n in names where n != my_name select n).ToList();
      return filtered;
    }

  }
}