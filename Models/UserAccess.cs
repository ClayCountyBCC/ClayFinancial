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
    public List<int> departments_can_access = new List<int>();
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
        var groups = (from g in up.GetAuthorizationGroups()
                      select g.Name).ToList();
        maintenance_user = groups.Contains(maintenance_access_group);

        if (groups.Contains(mis_access_group))
        {
          current_access = access_type.mis_access;
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
          UpdateDepartmentalAccess();
        }
        
      }
      catch (Exception ex)
      {
        new ErrorLog(ex);
      }
    }

    private void UpdateDepartmentalAccess()
    {
      finplus_department = GetFinplusDepartment();
      departments_can_access = GetDepartmentsCanAccess();
    }

    private string GetFinplusDepartment()
    {
      if (employee_id == 0) return "";
      var dp = new DynamicParameters();
      dp.Add("employee_id", employee_id.ToString());
      string query = "SELECT home_orgn FROM finplus51.dbo.employee WHERE empl_no=@employee_id";
      string department = Constants.Exec_Scalar<string>(query, Constants.ConnectionString.Finplus, dp);
      return department.Trim();

    }

    private List<int> GetDepartmentsCanAccess()
    {
      List<int> departments = new List<int>();
      if (finplus_department == "") return departments;
      foreach(Transaction.Department d in Transaction.Department.GetCached())
      {
        if(d.organization.Length > 0)
        {
          if (d.organization_access.Contains(finplus_department)) departments.Add(d.department_id);
        }
      }
      return departments;
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
  }
}