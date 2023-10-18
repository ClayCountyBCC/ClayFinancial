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
    private const string cc_clerk_access_group = "gClayCountyClerkAccess";
    private const string mis_access_group = "gMISDeveloper_Group";


    public bool authenticated { get; set; } = false;
    public string finplus_department { get; set; } = "";
    public string user_name { get; set; }
    public int employee_id { get; set; } = 0;
    public int my_department_id { get; set; } = -1;
    public string display_name { get; set; } = "";
    public bool maintenance_user { get; set; } = false;
    public string organizational_unit { get; set; } = "";
    public class temp_user
    {

      public string username;
      public int empl_id;
    
    }

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
        SetUserOrganizationalUnit(up);
        if (int.TryParse(up.EmployeeId, out int eid))
        {

          employee_id = eid;
        
        }
        else
        {
          if(organizational_unit == "CLKCRT")
          {


          }
          else
          {

#if DEBUG
            //new ErrorLog(
            //    $"Issue with employee_id",
            //    $"User: {up.DisplayName} is showing \'{finplus_department}\' for employee id in FinPlus",
            //    $@"UserAccess.ParseUser(UserPrincipal up)
            //        Authenticated User: {authenticated}
            //        user_name: {user_name}
            //        organizational_unit: {organizational_unit}",
            //    "",
            //  ""  );
#endif

          }
                    
        }
        // load employee table

        var groups = (from g in up.GetAuthorizationGroups()
                      select g.Name).ToList();
        maintenance_user = groups.Contains(maintenance_access_group);



        //  NO LONGER USED: FINPLUS_DEPARTMENT IS DEPRECATED
        //if (!user_name.TrimEnd().ToLower().Replace(" ", "").EndsWith("-clerk"/*!groups.Contains(cc_clerk_access_group*/))
        //{
        //  finplus_department = GetFinplusDepartment(up).Trim();
        //}
        //else
        //{
        //  finplus_department = "0701";
        //  SetUserOrganizationalUnit(up);         
        //}

        SetUserOrganizationalUnit(up);

        DynamicParameters param = new DynamicParameters();
        param.Add("@user_name", user_name);
        param.Add("@employee_id", up.EmployeeId);
        param.Add("@org_unit", organizational_unit);
        

        var sql = $@"
                    
                    

                  DECLARE @new_id INT = 
                    CASE WHEN @org_unit = 'CLKCRT' 
                      THEN (select max(employee_id) + 1 from employees E where org_unit = 'CLKCRT') 
                    END;


                  WITH this_user as (
                    SELECT
                      @user_name [user_name],
                      ISNULL((SELECT employee_id FROM employees WHERE [username] = @user_name) ,ISNULL(@employee_id, @new_id)) [employee_id]
                      ,@org_unit [org_unit]

                   
                   )

                    MERGE dbo.employees AS T
                    USING this_user AS S
                    ON (T.[username] = S.[user_name])
                    WHEN MATCHED THEN
                        UPDATE SET T.employee_id = S.employee_id
                    WHEN NOT MATCHED THEN
                      INSERT ([username],[employee_id],[org_unit])
                      VALUES (S.[user_name], S.[employee_id], S.[org_unit]);

                    SELECT [employee_id] FROM employees WHERE [username] = @user_name";

        var i = Constants.Get_Data<int>(sql, param, Constants.ConnectionString.ClayFinancial).FirstOrDefault();
        if (i <= 0)
        {
#if DEBUG
          //new ErrorLog(
          //    $"Issue with employee_id",
          //    $"User: {up.DisplayName} is showing \'{finplus_department}\' for employee id in FinPlus",
          //    $@"UserAccess.ParseUser(UserPrincipal up)
          //                  Authenticated User: {authenticated}
          //                  user_name: {user_name}
          //                  organizational_unit: {organizational_unit}",
          //    "",
          //    "");
#endif         
          
        }

        if(organizational_unit == "DisabledUsers")
        {
          current_access = access_type.no_access;
          return;
        }

        if (organizational_unit == "" || organizational_unit == "no_dept" || up.EmployeeId == "")
        {
          current_access = access_type.no_access;
#if DEBUG
          new ErrorLog(
            "User is not a part of an organizational unit",
            up.Name + "\n" +
            up.DistinguishedName,
            "UserAccess.ParseUser()",
            "", "");
#endif
          return;
        }



        UpdateDepartmentalAccess();

        if (groups.Contains(mis_access_group))
        {
          current_access = access_type.mis_access;
          maintenance_user = true;
          
          return;
        }

        if (groups.Contains(finance_Level_one_group) || organizational_unit == "CLKCRT") ;
        {
          current_access = access_type.finance_level_one;
          return;
        }

        if (groups.Contains(finance_Level_two_group))
        {
          current_access = access_type.finance_level_two;
          return;
        }

        if (groups.Contains(basic_access_group) )
        {
          current_access = access_type.basic;
        }
        
      }
      catch (Exception ex)
      {
#if DEBUG 

        var data = $@"

     
            
             Function: UserAccess.ParseUser()
             user_name: {user_name};
             display_name: {display_name};
             current_access: {current_access};
             finplus_department: {finplus_department};

         


          ";
  

        //new ErrorLog("ClayFinancial User Department Missing",
        //             data + @"

        //              " + ex.Message,
        //             "", "", "");
#endif


      }
    }

    private void UpdateDepartmentalAccess()
    {
      my_department_id = GetDepartmentsCanAccess();
    }


    private string GetOrgUnit(UserPrincipal up)
    {


      return "";
    }


    private string GetFinplusDepartment(UserPrincipal up)
    {
      
      try
      {
        string dept = "";
        //if (up.DistinguishedName.Contains("CLKCRT")) return "0701";
        if (employee_id == 0)
        {
          // TODO: Add MERGE statement for username and employee_id to employees table

          return "";
        }
        

        var dp = new DynamicParameters();
        dp.Add("@employee_id", employee_id.ToString());
        dp.Add("@org_unit", organizational_unit);

        // this will work only for users with data in finplus51 db; need to replace with new org_unit data from AD account info
        //string query = "SELECT home_orgn FROM finplus51.dbo.employee WHERE empl_no=@employee_id";
        //var department = Constants.Get_Data<string>(query, dp, Constants.ConnectionString.Finplus);

      var department = organizational_unit;


        SetUserOrganizationalUnit(up);

        switch(organizational_unit.ToLower())
        {
          case "disabledusers":
            dept = "TERM";
            break;
          default:
            if(finplus_department == "0202")
            {
              organizational_unit = "OMB"; // created for 
            }
            break;
        }

        dept = organizational_unit == "DisabledUsers" ? "TERM" : department.Trim();

        dp.Add("@department", dept);
        dp.Add("@org_unit", organizational_unit);
        
        var query = "EXEC instert_org_unit_department_number @org_unit, @department";

        var i = Constants.Exec_Scalar<int>(query, Constants.ConnectionString.ClayFinancial, dp);
        if(i == -1)
        {
 #if DEBUG         
          var data = $@"


            
             Function: UserAccess.GetFinPlusDepartment()
             user_name: {user_name};
             employee_id: {employee_id};
             display_name: {display_name};
             current_access: {current_access};
             finplus_department: {finplus_department}
             organizational_unit: {organizational_unit};

            

          ";

          new ErrorLog("org_unit not inserted", data, "", "", "");
          return "";
#endif        

        }


        if (!department.Any() || department.Trim().Length == 0)
        {
#if DEBUG
          var data = $@"


             
             Function: UserAccess.GetFinPlusDepartment()
             user_name: {user_name};
             employee_id: {employee_id};
             display_name: {display_name};
             current_access: {current_access};
             finplus_department: {finplus_department};

           


          ";

          new ErrorLog("User Department Missing", data, "", "", "");
          return "";

#endif
        }
        else
        {
          return department.Trim();
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

      //TODO: update this code to get the department_id using the org_unit
      // if (finplus_department.Trim().Length == 0) return -1;

      if (organizational_unit.Trim().Length == 0) return -1;


      foreach(Transaction.Department d in Transaction.Department.GetCached())
      {
        if(d.organization.Length > 0)
        {
          if (d.organization_access.Contains(organizational_unit.Trim()))
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

          case "MISSL01":
            d["mccartneyd"] = new UserAccess("mccartneyd");
            break;
          //case "MISHL17":
          //  d["westje"] = new UserAccess("westje");
          //  break;
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
        //un = "";                                             

        switch (Environment.MachineName.ToUpper())
        {
          default:
            var d = GetCachedAllUserAccess();

            //foreach(string key in d.Keys)
            //{
            //  var dept = d[key].finplus_department;

            //  var dp = new DynamicParameters();
            //  dp.Add("@org_unit", d[key].organizational_unit);

            //  if (d[key].user_name.Contains("clerk".ToLower()))
            //  {
            //    d[key].finplus_department = "0701";
            //  }

            //  dp.Add("@department", d[key].finplus_department);

            //  var query = "EXEC instert_org_unit_department_number @org_unit, @department";

            //  var i = Constants.Exec_Scalar<int>(query, Constants.ConnectionString.ClayFinancial, dp);
            //  if (i == -1)
            //  {
            //    var data = $@"


            //     /**

            //     Function: UserAccess.GetFinPlusDepartment()
            //     user_name: {d[key].user_name};
            //     employee_id: {d[key].employee_id};
            //     display_name: {d[key].display_name};
            //     current_access: {d[key].current_access};
            //     finplus_department: {d[key].finplus_department};
            //     organizational_unit: {d[key].organizational_unit};

            //     **/


            //    ";

            //    new ErrorLog("org_unit not inserted", data, "", "", "");

            //  }
            //}

            if (d.ContainsKey(un))
            {

              var i = new temp_user();

              var param = new DynamicParameters();
              param.Add("@username", d[un].user_name);
              param.Add("@empl_id", d[un].employee_id);
              param.Add("@org_unit", d[un].organizational_unit);

              //var sql = "EXEC check_and_set_employee_id @username, @empl_id,@org_unit";
              //try
              //{
              //  i = Constants.Get_Data<temp_user>(sql, param, Constants.ConnectionString.ClayFinancial).First();

              //  var name = i.username;
              //  if(d[un].employee_id == 0)
              //  {
              //    new ErrorLog("User with no employee_id", $@"Username: {d[un].user_name}", "UserAccess.GetUserAccess(string Username): Line 306", "No Error", "");
              //  }

              //  if (d[un].employee_id != i.empl_id)
              //  {
              //    d[un].employee_id = i.empl_id;
              //  }


              //}
              //catch (Exception ex)
              //{
              //  var broken = "broken";
              //}

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
      var transaction_names = new List<string>();
      var users = UserAccess.GetCachedAllUserAccess();
      // Added some conditionals to this list so that we wouldn't display the people with MIS access
      // and the user with no access.

      // TODO: Add code here to make a list of names with no records in the system. 
      // MAKE SURE TO INCLUDE THE CURRENT USER'S NAME TO PREVENT AN ISSUE WITH THEM BEING ABLE TO ADD THEIR OWN, NEW TRANSACTIONS
      var sql = $@"

              select 
              case 
                when created_by_display_name like '%clerk%' 
                  then concat(trim(replace(replace(created_by_display_name,'-',''),'clerk','')),'-Clerk')
                  else created_by_display_name
                end [created_by_display_name]
              from data_transaction 
              group by created_by_display_name
              order by 
              case 
                when created_by_display_name like '%clerk%' 
                  then concat(trim(replace(replace(created_by_display_name,'-',''),'clerk','')),'-Clerk')
                  else created_by_display_name
                end

            ";
      try
      {
        transaction_names = Constants.Get_Data<string>(sql,Constants.ConnectionString.ClayFinancial);

      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
      }

      foreach (string key in users.Keys)
      {
        var access = users[key].current_access;
        


        if (access != access_type.no_access && access != access_type.mis_access)
        {
          string name;
          //THIS IF STATEMENT HELPS WITH THE NON-STANDARD NAME AD USERNAME COMPLETION
          if (users[key].user_name.Replace(" ", "").ToLower().EndsWith("-clerk"))
          {
            name = users[key].display_name.Replace(" - ","-").Replace("Clerk", "");
            if(name.EndsWith("-"))
            {
              name = name.Substring(0, name.Length - 1) + "-Clerk";
            }
            else
            {
              name = name + "-Clerk";
            }
          }
          else
          {
            name = users[key].display_name;
          }

          if (transaction_names.Contains(name)) 
          { 
            name_list.Add(name); 
          }
          else
          {
            name_list.Remove(name);
          }
        }

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
    private void SetUserOrganizationalUnit(UserPrincipal up)
    {

       // the distinguished name has the person's name and their OU heirarchy
      if (up.DistinguishedName.Length > 0) // need to decide what to do if there is no distinguished name
      {
        var tmp = up.DistinguishedName.Split(','); // turn it into an array
        if (tmp.Length > 1) // if their distinguished name is short for whatever reason, we should be aware of that.
        {
          organizational_unit = tmp[1].Replace("OU=", ""); // second entry in this array should always be the top level OU.
        }

        switch (tmp[2].Replace("OU=","").ToLower())
        {
          case "lib":
          case "par":
            organizational_unit = tmp[2].Replace("OU=", "");
            return;
        }

        switch (tmp[1].Replace("OU=", "").ToLower())
        {
          case "fieldpersonnel":
            organizational_unit = tmp[2].Replace("OU=", "");
            return;
          default:
            organizational_unit = tmp[1].Replace("OU=", "");
            return;
        }

      }
    }
  }




}
