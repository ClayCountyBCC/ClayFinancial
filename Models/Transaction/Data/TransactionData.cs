using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Dapper;
using ClayFinancial.Models.Transaction;

namespace ClayFinancial.Models.Transaction.Data
{
  public class TransactionData
  {
    const int page_size = 25;
    public long transaction_id { get; set; } = -1;
    public int fiscal_year { get; set; } = -1;
    public int created_by_employee_id { get; set; } = -1;
    public int employee_transaction_count { get; set; } = -1;
    public string transaction_number { get; set; } = "";
    public string transaction_type { get; set; } = "R";
    public long? child_transaction_id { get; set; } = null;
    public int department_id { get; set; } = -1;
    public string department_name { get; set; } = "";
    public List<ControlData> department_control_data { get; set; } = new List<ControlData>();
    public List<PaymentTypeData> payment_type_data { get; set; } = new List<PaymentTypeData>();
    public decimal total_cash_amount { get; set; } = -1;
    public decimal total_check_amount { get; set; } = -1;
    public int total_check_count { get; set; } = -1;
    public string comment { get; set; } = "";
    public string county_manager_name { get; set; }
    public string error_text { get; set; } = "";
    public string received_from { get; set; } = "";
    public DateTime created_on { get; set; } = DateTime.MinValue;
    public string created_by_username { get; set; } = "";
    public string created_by_display_name { get; set; } = "";
    public int created_by_employee_department_id { get; set; } = -1;
    public string created_by_ip_address { get; set; } = "";
    public List<long> deposit_receipt_ids { get; set; } = new List<long>();
    public List<TransactionData> deposit_receipts { get; set; } = new List<TransactionData>();
    public bool my_transaction { get; set; } = false;
    public bool can_modify { get; set; } = false;
    public bool can_accept_deposit { get; set; } = false;
    public bool has_error { get; set; } = false;
    private int my_department_id { get; set; } = -1;
    private UserAccess.access_type my_access { get; set; } = UserAccess.access_type.basic;

    public TransactionData()
    {
    }

    public TransactionData(string er)
    {
      error_text = er;
    }

    public static int GetTransactionPageCount(
      UserAccess ua
      , string display_name_filter
      , string completed_filter
      , string transaction_type_filter
      , string transaction_number_filter
      , int department_id_filter
      , bool has_been_modified
      )
    {
      var sb = new StringBuilder();
      var param = TransactionData.CreateFilterDynamicParameters(
        ua,
        -1,
        display_name_filter,
        completed_filter,
        transaction_type_filter,
        transaction_number_filter,
        department_id_filter,
        has_been_modified);



      var query = @"
        SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
        SELECT
          COUNT(DISTINCT TD.transaction_number) CNT
        FROM ClayFinancial.dbo.data_transaction TD
        INNER JOIN ClayFinancial.dbo.vw_transaction_view TV ON TD.transaction_id = TV.transaction_id
        WHERE 1=1

      ";

      sb.AppendLine(query);

      sb.AppendLine(TransactionData.CreateFilterWhereClause(
        ua,
        -1,
        display_name_filter,
        completed_filter,
        transaction_type_filter,
        transaction_number_filter,
        department_id_filter,
        has_been_modified));

      var count = Constants.Exec_Scalar<int>(sb.ToString(), Constants.ConnectionString.ClayFinancial, param);

      if (count == 0) return 1;

      decimal page_count = count / page_size;
      return ((int)Math.Ceiling(page_count)); // base 1
    }

    public static List<TransactionData> GetTransactionList(
      UserAccess ua
      ,int page_number
      ,string display_name_filter
      ,string completed_filter
      ,string transaction_type_filter
      ,string transaction_number_filter
      ,int department_id_filter
      ,bool has_been_modified
      )
    {
      var sb = new StringBuilder();
      var param = TransactionData.CreateFilterDynamicParameters(
        ua, 
        page_number, 
        display_name_filter, 
        completed_filter, 
        transaction_type_filter, 
        transaction_number_filter, 
        department_id_filter, 
        has_been_modified);
      




      sb.AppendLine(GetTransactionDataQuery());

      if(ua.current_access == UserAccess.access_type.basic)
      {
        param.Add("@my_department_id", ua.my_department_id);
        sb.AppendLine(" AND department_id = @my_department_id");
      }

      sb.AppendLine(TransactionData.CreateFilterWhereClause(
        ua,
        page_number,
        display_name_filter,
        completed_filter,
        transaction_type_filter,
        transaction_number_filter,
        department_id_filter,
        has_been_modified));

      var td = Constants.Get_Data<TransactionData>(sb.ToString(), param, Constants.ConnectionString.ClayFinancial);

      return td;
    }

    private static DynamicParameters CreateFilterDynamicParameters(
      UserAccess ua,
      int page_number,       
      string display_name_filter,
      string completed_filter,
      string transaction_type_filter,
      string transaction_number_filter,
      int department_id_filter,
      bool has_been_modified
      )
    {
      var param = new DynamicParameters();
      param.Add("@my_employee_id", ua.employee_id);
      // set filters
      if (display_name_filter.Length > 0)
      {
        if (display_name_filter.ToLower() != "mine")
        {
          param.Add("@display_name_filter", display_name_filter);
        }
      }
      if (transaction_type_filter.Length > 0)
      {
        param.Add("@transaction_type_filter", transaction_type_filter);
      }
      if (transaction_number_filter.Length > 0)
      {
        param.Add("@transaction_number", transaction_number_filter);

      }
      if (department_id_filter > 0)
      {
        param.Add("@department_id", department_id_filter);
      }

      if (page_number > 0)
      {
        param.Add("@page_number", (page_number - 1) * page_size);
      }
      return param;
    }

    private static string CreateFilterWhereClause(
      UserAccess ua,
      int page_number,
      string display_name_filter,
      string completed_filter,
      string transaction_type_filter,
      string transaction_number_filter,
      int department_id_filter,
      bool has_been_modified
      )
    {
      var sb = new StringBuilder();
      // set filters
      if (display_name_filter.Length > 0)
      {
        if (display_name_filter.ToLower() == "mine")
        {
          sb.AppendLine("AND TD.created_by_employee_id = @my_employee_id");
        }
        else
        {
          sb.AppendLine("AND created_by_display_name = @display_name_filter");
        }

      }
      if (completed_filter.Length > 0)
      {
        switch (completed_filter.ToLower())
        {
          case "c":
            sb.AppendLine("AND TD.child_transaction_id IS NOT NULL");
            break;
          case "i":
            sb.AppendLine("AND TD.child_transaction_id IS NULL");
            break;
          default:
            break;
        }
      }
      if (transaction_type_filter.Length > 0)
      {
        sb.AppendLine("AND TD.transaction_type = @transaction_type_filter");
      }
      if (transaction_number_filter.Length > 0)
      {

        sb.AppendLine(" AND TD.transaction_number = @transaction_number");

      }
      if (department_id_filter > 0)
      {
        sb.AppendLine(@"  AND department_id = @department_id");
      }
      if (has_been_modified)
      {
        sb.AppendLine(" AND has_been_modified = 1");
      }

      if (page_number > 0)
      {
        sb.AppendLine("ORDER BY TD.transaction_id DESC");
        sb.AppendLine($"OFFSET @page_number ROWS FETCH NEXT { page_size.ToString() } ROWS ONLY;");
      }
      return sb.ToString();
    }

    public bool ValidateTransaction(UserAccess ua = null)
    {
      switch (transaction_type)
      {

        case "R":

          return ValidateNewReceipt(ua);
        case "C":
          if (ua == null)
          {
            return false;
          }
          else
          {
            return ValidateNewReceipt(ua);

          }
        //case "D":
        //  return ValidateNewDeposit(selected_employee_id);
        default:
          return false;
      }
    }

    private bool ValidateNewReceipt(UserAccess ua = null)
    {

      if(transaction_type.ToUpper() == "C")
      {
        can_accept_deposit = GetTransactionData(transaction_id, ua.employee_id, ua).can_accept_deposit;
        if (!can_accept_deposit) return false;
      }
      var departments = Department.GetCachedDict();
      // wrong
      //Department department = Department.GetCachedDict()[department_id];
      // always test dictionaries for the key before you try and use data from the client.
      if (!departments.ContainsKey(department_id)) return false;
      return departments[department_id].ValidateTransactionData(this);
    }

    public static int ValidateNewDeposit(int selected_employee_id,  UserAccess ua)
    {
      var query = new StringBuilder();

      var param = new DynamicParameters();
      param.Add("@selected_employee_id", selected_employee_id);
      param.Add("@my_department_id", ua.my_department_id);

      query.AppendLine(@"

          SELECT 
            T.transaction_id
            ,T.created_by_employee_id
            ,T.department_id
          FROM ClayFinancial.dbo.data_transaction T
          INNER JOIN ClayFinancial.dbo.vw_transaction_view TV ON T.transaction_id = TV.transaction_id
          WHERE child_transaction_id IS NULL
            AND created_by_employee_id = @selected_employee_id
            AND UPPER(transaction_type) IN ('C','R')

      ");

      //var user_receipt_list = new List<TransactionData>();
      var receipt_ids = Constants.Get_Data<int>(query.ToString(), param, Constants.ConnectionString.ClayFinancial);

      // validate all receipts in the deposit_receipt_ids are from department the user can access
      // This is now done at the controller level using a departmental acccess control check:
      //    current_user_department_id is the same as the selected_user_department_id if basic
      // if not basic, then uses a check to make sure the selected_user_access_level is <= current_user_access_level

      //if(receipt_ids < 1)
      //{
      //  return "The selected user does not have any receipts to deposit or you do not have access to their receipts.";
      //}

      return receipt_ids.Count();
    }

    public static bool ValidateEdit(long transaction_id, UserAccess ua)
    {
      if (ua.current_access == UserAccess.access_type.basic)
      {
        var param = new DynamicParameters();
        param.Add("@my_employee_id", ua.employee_id);
        param.Add("@my_department_id", ua.my_department_id);
        param.Add("@transaction_id", transaction_id);
        var query = new StringBuilder();

        query.AppendLine(TransactionData.GetTransactionDataQuery());

        query.AppendLine("  AND TD.department_id = @my_department_id");

        var td = Constants.Get_Data<TransactionData>(query.ToString(), param, Constants.ConnectionString.ClayFinancial).FirstOrDefault();

        if (td != null && !td.can_modify)
        {
          return false;
        }
      }
      return true;
    }

    public static string GetTransactionDataQuery()
    {


      return @"
        SELECT
          TD.transaction_id
          ,TD.fiscal_year
          ,TD.created_by_employee_id
          ,TD.employee_transaction_count
          ,TD.transaction_number
          ,TD.department_id
          ,UPPER(TD.transaction_type) transaction_type
          ,TD.child_transaction_id
          ,TD.created_on
          ,TV.department_name
          ,TV.county_manager_name
          ,TD.total_cash_amount
          ,TD.total_check_amount
          ,TD.total_check_count
          ,TD.created_on
          ,TD.received_from
          ,TD.created_by_username
          ,TD.created_by_display_name
          ,TD.created_by_ip_address
          ,TD.has_been_modified
          ,CASE WHEN TD.child_transaction_id IS NULL AND TD.created_by_employee_id = @my_employee_id
            THEN 1
            ELSE
              CASE WHEN TV.child_transaction_type = 'C' OR ISNULL(TV.grandchild_transaction_type, '')= 'C'
                THEN 0
                ELSE
                  CASE WHEN TV.grandchild_created_by_employee_id IS NULL
                            AND TV.child_created_by_employee_id = @my_employee_id
                    THEN 1
                    ELSE
                      CASE WHEN TV.grandchild_created_by_employee_id = @my_employee_id
                        THEN 1
                        ELSE 0
                        END
                    END
                  END
            END can_modify
          ,CASE WHEN TD.created_by_employee_id = @my_employee_id
            THEN 1
            ELSE 0
            END my_transaction
        FROM ClayFinancial.dbo.data_transaction TD
        INNER JOIN vw_transaction_view TV ON TD.transaction_id = TV.transaction_id
        WHERE
          1 = 1

      ";



    }

    public static TransactionData GetTransactionData(long transaction_id, int employee_id, UserAccess ua)
    {
      var param = new DynamicParameters();
      param.Add("@transaction_id", transaction_id);
      param.Add("@my_employee_id", ua.employee_id);

      var query = new StringBuilder();

      query.AppendLine(GetTransactionDataQuery());

      query.AppendLine("  AND TD.transaction_id = @transaction_id");

      if(ua.current_access == UserAccess.access_type.basic)
      {
        param.Add("@my_department_id", ua.my_department_id);

        query.AppendLine("  AND TD.department_id = @my_department_id");
      }
      // TODO: FILL THE REST OF THE TRANSACTION DATA.
      var td = Constants.Get_Data<TransactionData>(query.ToString(), param, Constants.ConnectionString.ClayFinancial).FirstOrDefault();
      if (td == null)
      {
        new ErrorLog("transaction_id: " + transaction_id, "There was an issue retrieving the transaction.", "", "", query.ToString()) ;
        return new TransactionData("There was an issue retrieving the transaction.");
      }

      if (td.transaction_type == "R")
      {
        var controls = ControlData.GetActiveTransactionControls(td.transaction_id);
        var payment_methods = PaymentMethodData.GetActiveTransactionPaymentMethods(td.transaction_id);

        td.department_control_data = (from c in controls
                                      where c.department_id.HasValue
                                      select c).ToList();

        td.payment_type_data = PaymentTypeData.Get(td.transaction_id, controls, payment_methods);
      }
      else
      {
        td.GetDepositReceipts(employee_id);
        if(td.transaction_type == "D" && !td.child_transaction_id.HasValue)
        {
          td.can_accept_deposit = false;
          // here we're going to indicate to the client that it should or should not allow
          // the viewer to accept this deposit.
          // the criteria is as follows:
          // the deposit creator must be different from the receipt creator
          // the deposit creator must have a lower access level than the receipt creator
          //    or the receipt creator must be finance level 2 or higher
          if (td.created_by_display_name != ua.display_name)
          {
            if((int)ua.current_access >= (int)UserAccess.access_type.finance_level_two) // this will handle the MIS access level
            {
              var deposit_creator_ua = UserAccess.GetUserAccessByDisplayName(td.created_by_display_name);
              td.can_accept_deposit = ((int)deposit_creator_ua.current_access < (int)ua.current_access);
            }
            else
            {
              td.can_accept_deposit = true;
            }
            
          }
        }
      }
      return td;
    }

    public void SetUserProperties(UserAccess ua)
    {

      // set all user properties here
      created_by_employee_id = ua.employee_id;
      created_by_username = ua.user_name;
      created_by_display_name = ua.display_name;
      my_department_id = ua.my_department_id;
      my_access = ua.current_access;
    }

    public bool SaveTransactionData()
    {

      switch (transaction_type.ToUpper())
      {

        case "R":
        case "C": 
          return SaveNewReceipt();
        default:
          return false;
      }

    }

    private bool SaveNewReceipt()
    {
      var param = new DynamicParameters();
      param.Add("@transaction_id", dbType: DbType.Int64, direction: ParameterDirection.Output);
      param.Add("@created_by_employee_id", created_by_employee_id);
      param.Add("@username", created_by_username);
      param.Add("@department_id", my_department_id);
      param.Add("@transaction_type", transaction_type.ToUpper());
      //param.Add("@display_name", display_name);
      param.Add("@created_by_employee_ip_address", created_by_ip_address);
      param.Add("@child_transaction_id", child_transaction_id);
      param.Add("@created_by_display_name", created_by_display_name);
      param.Add("@received_from", received_from);
      param.Add("@comment", comment);


      StringBuilder query = new StringBuilder();
      query.AppendLine(@"
          USE ClayFinancial;
          
              -- SAVE TRANSACTION DATA
              -- if
              EXEC ClayFinancial.dbo.insert_new_transaction_data 
                      @transaction_id OUTPUT, 
                      @department_id, 
                      @created_by_employee_id,
                      @transaction_type,
                      @child_transaction_id, 
                      @username, 
                      @created_by_employee_ip_address,
                      @created_by_display_name,
                      @received_from,
                      @comment;

          ");

      query.AppendLine(PaymentTypeData.GetSavePaymentTypeDataQuery());
      query.AppendLine(PaymentMethodData.GetSavePaymentMethodsQuery());
      query.AppendLine(ControlData.GetSaveControlDataQuery());

      // add this to update total_cash_amount, total_check_amount, total_check_count fields

      if(transaction_type != "C")
      {
        query.AppendLine(GetUpdateTransactionTotals(true));
      }
      

      // IF TRANSACTION_TYPE = 'C' AND FINANCE LEVEL 2, TRANSACTION IS COMPLETE. CHILD_TRANSACTION_ID IS TRANSACTION_ID
      if (my_access == UserAccess.access_type.finance_level_two && transaction_type.ToUpper() == "C")
      {
        query.AppendLine(@"

          UPDATE data_transaction
          SET child_transaction_id = @transaction_id
          WHERE transaction_id = @transaction_id; 

        ");

      }


      // CREATE DATA TABLES
      var paymentTypeDataTable = PaymentTypeData.GetPaymentTypeDataTable();

      var controlDataTable = ControlData.GetControlDataTable();

      var paymentMethodDataTable = PaymentMethodData.GetPaymentMethodDataTable();

      try
      {

        foreach (PaymentTypeData ptd in payment_type_data)
        {
          // add payment type data to its data table
          paymentTypeDataTable.Rows.Add
          (
            ptd.payment_type_id,
            ptd.payment_type_index
          );

          // add payment method data to its data table
          foreach (PaymentMethodData pmd in ptd.payment_method_data)
          {

            paymentMethodDataTable.Rows.Add
            (
              pmd.cash_amount,
              pmd.check_amount,
              pmd.check_count,
              pmd.check_number,
              pmd.check_from,
              pmd.paying_for,
              ptd.payment_type_id,
              ptd.payment_type_index
            );
          }

          // add payment type control data to Control data table
          foreach (ControlData cd in ptd.control_data)
          {

            controlDataTable.Rows.Add
            (
              null,
              cd.control_id,
              cd.value,
              ptd.payment_type_id,
              ptd.payment_type_index
            );
          }

          // add department control data
          foreach (ControlData cd in department_control_data)
          {
            controlDataTable.Rows.Add
            (
              this.department_id,
              cd.control_id,
              cd.value,
              null,
              null
            );
          }

        }


        // add tvp to parameter list
        param.Add("@ControlData", controlDataTable.AsTableValuedParameter("dbo.ControlData"));
        param.Add("@PaymentMethodData", paymentMethodDataTable.AsTableValuedParameter("dbo.PaymentMethodData"));
        param.Add("@PaymentTypeData", paymentTypeDataTable.AsTableValuedParameter("dbo.PaymentTypeData"));

        //using (IDbConnection db = new SqlConnection(Constants.Get_ConnStr(Constants.ConnectionString.ClayFinancial)))
        //{
        //  var i = db.ExecuteScalar(
        //                query,
        //                param,
        //                commandTimeout: 60); //  THIS SAVE SHOULD NOT TAKE MORE THAN A COUPLE OF SECONDS.



        //}

        var tran = Constants.Exec_Query(query.ToString(), param, Constants.ConnectionString.ClayFinancial);

        transaction_id = param.Get<long>("@transaction_id");

        if (transaction_id == -1)
        {
          error_text = "There was an issue saving the receipt.";
          return false;
        }


        return true;

      }
      catch (Exception ex)
      {

        new ErrorLog(ex, query.ToString());
        return false;

      }
    }

    public static string GetUpdateTransactionTotals(bool has_been_modified)
    {
      
      return $@"
        DECLARE @has_been_modified Bit = {(has_been_modified ? "1" : "0")};
        
          
         EXEC update_receipt_transaction_totals @transaction_id, @transaction_type, @has_been_modified;

      ";
    }

    public static TransactionData CreateDeposit(UserAccess ua, string selected_user_display_name, string ipAddress)
    {
      var selected_employee_id = UserAccess.GetEmployeeIdFromDisplayName(selected_user_display_name);
      var param = new DynamicParameters();
      param.Add("@transaction_id", dbType: DbType.Int64, direction: ParameterDirection.Output);
      param.Add("@my_employee_id", ua.employee_id);
      param.Add("@username", ua.display_name);
      param.Add("@transaction_type", "D");
      param.Add("@created_by_employee_ip_address", ipAddress);
      param.Add("@created_by_display_name", ua.display_name);
      param.Add("@received_from", selected_user_display_name);
      param.Add("@comment", "");
      param.Add("@selected_employee_id", selected_employee_id);
      param.Add("@my_department_id", ua.my_department_id);
      // ValidateNewDeposit was already called in TransactionDataController
      //if(ValidateNewDeposit(UserAccess.GetEmployeeIdFromDisplayName(selected_user_display_name.Length > 0 ? selected_user_display_name : ua.display_name), ua).Length > 0) return null;


      StringBuilder query = new StringBuilder();
      query.AppendLine(@"

        USE ClayFinancial;

        -- SAVE TRANSACTION DATA
        -- if
        EXEC ClayFinancial.dbo.insert_new_transaction_data 
                @transaction_id OUTPUT, 
                @my_department_id, 
                @my_employee_id,
                @transaction_type,
                null, 
                @username, 
                @created_by_employee_ip_address,
                @created_by_display_name,
                @received_from,
                @comment;


        ;WITH all_selected_users_incomplete_receipts AS (

          SELECT
            transaction_id
          FROM data_transaction DT
          WHERE created_by_employee_id = @selected_employee_id
            AND child_transaction_id IS NULL
            AND UPPER(transaction_type) IN ('C','R')
        )

        UPDATE DT
          SET child_transaction_id = @transaction_id
        FROM data_transaction DT
        INNER JOIN all_selected_users_incomplete_receipts AR on AR.transaction_id = DT.transaction_id;

        ;WITH total_amount_sums AS (

          SELECT
            child_transaction_id
            ,SUM(total_cash_amount) total_cash
            ,SUM(total_check_amount) total_checks
            ,SUM(total_check_count) number_of_checks
          FROM data_transaction DT
          WHERE child_transaction_id IS NOT NULL
          GROUP BY child_transaction_id

        )
            
        UPDATE DT
        SET 
          DT.Total_cash_amount = PMS.total_cash, 
          DT.total_check_amount = PMS.total_checks, 
          DT.total_check_count = PMS.number_of_checks
        FROM data_transaction DT
        INNER JOIN total_amount_sums PMS ON PMS.child_transaction_id = DT.transaction_id
        WHERE 
          DT.transaction_id = @transaction_id;

      ");
  
      var i = Constants.Exec_Query(query.ToString(), param, Constants.ConnectionString.ClayFinancial);
      
      var transaction_id = param.Get<long>("@transaction_id");
      

      var deposit = GetTransactionData(transaction_id, ua.employee_id, ua);

      if(deposit != null && transaction_id > 0)
      {
        deposit.GetDepositReceipts(ua.employee_id);
      }

      return deposit;

    }

    public void GetDepositReceipts(int my_employee_id)
    {
      var param = new DynamicParameters();
      param.Add("@transaction_id", transaction_id);
      param.Add("@my_employee_id", my_employee_id);
      var query = new StringBuilder();

      query.AppendLine(GetTransactionDataQuery())
           .AppendLine(" AND child_transaction_id = @transaction_id");

      deposit_receipts = Constants.Get_Data<TransactionData>(query.ToString(), param, Constants.ConnectionString.ClayFinancial);

    }

    // check for receipts a user is not allowed to accept in a deposit.
    private bool CheckforInvalidReceipts(int selected_employee_id)
    {
      if(deposit_receipts.Any(r => r.created_by_employee_id != selected_employee_id))
      return false;

      if (deposit_receipts.Any(r => r.child_transaction_id > -1)) return false;

      return true;
    }

    public static int GetReadyForDepositCount(string name_to_view)
    {
      var param = new DynamicParameters();
      param.Add("@name", name_to_view);

      string query = $@"
        SELECT
          COUNT(*) Total_Open_Transactions
        FROM data_transaction T
        WHERE  
          child_transaction_id IS NULL
          AND transaction_type='R'
          AND created_by_display_name = @name        
         GROUP BY created_by_display_name 
        ";

      int count = Constants.Exec_Scalar<int>(query, Constants.ConnectionString.ClayFinancial, param);      
      return count;
    }

    public static bool ValidateTransactionListAccess(List<long> transaction_ids, UserAccess ua)
    {
      if(ua.current_access == UserAccess.access_type.basic)
      {

        var param = new DynamicParameters();
        param.Add("@transaction_ids", transaction_ids);


        var query = @"
          
          SELECT DISTINCT
            created_by_display_name
          FROM data_transaction
          WHERE transaction_id IN (@transaction_ids)

        ";

        var transaction_usernames = Constants.Get_Data<string>(query, param, Constants.ConnectionString.ClayFinancial);


        foreach(var name in transaction_usernames)
        {

          var name_ua = UserAccess.GetUserAccessByDisplayName(name);
          // We check to see if the name that they gave us has a higher level access
          // than they do.  If it is higher, then they can't do a deposit.
          if ((int)ua.current_access < (int)name_ua.current_access || ua.my_department_id != name_ua.my_department_id)
          {
            return false;
          }
        }


      }

      return true;
    }

    public static List<SimpleValue> GetTaxAndTDC(long deposit_transaction_id)
    {
      var param = new DynamicParameters();
      param.Add("@deposit_transaction_id", deposit_transaction_id);

      string query = @"
        -- Get Deposit Transaction Id
        DECLARE @deposit_transaction_id BIGINT = 10167;

        WITH BaseData AS (
            SELECT 
              D2.transaction_id a_id
              ,D2.child_transaction_id a_child_id
              ,D2.transaction_type a_type
              ,D4.transaction_id b_id
              ,D4.child_transaction_id b_child_id
              ,D4.transaction_type b_type
            FROM data_transaction D1 -- D transaction
            LEFT OUTER JOIN data_transaction D2 ON D1.transaction_id = D2.child_transaction_id -- R/C transaction
            LEFT OUTER JOIN data_transaction D3 ON D2.transaction_type = 'C' 
              AND D3.child_transaction_id = D2.transaction_id -- D transaction
            LEFT OUTER JOIN data_transaction D4 ON D3.transaction_id = D4.child_transaction_id -- R transaction
            WHERE 
              D1.transaction_type='D'
              AND D1.transaction_id = @deposit_transaction_id

        ), TransactionIds AS (

          SELECT
           a_id transaction_id
          FROM BaseData

          UNION

          SELECT
            b_id transaction_id
          FROM BaseData
          WHERE b_id IS NOT NULL

        ), ControlData AS (

          SELECT
            DC.control_data_id
            ,DC.prior_control_data_id
            ,DC.transaction_payment_type_id
            ,DC.department_id
            ,DC.transaction_id
            ,DC.control_id
            ,DC.value
            ,DC.is_active
          FROM data_control DC
          INNER JOIN TransactionIds T ON T.transaction_id = DC.transaction_id
          WHERE 
            1=1
            AND DC.is_active=1
            AND DC.control_id IN (63, 64)

        )

        SELECT
          C.label
          ,SUM(CAST(CD.value AS money)) [value]
        FROM ControlData CD
        INNER JOIN controls C ON CD.control_id = C.control_id
        GROUP BY CD.control_id, C.label
        ORDER BY C.label";

      return Constants.Get_Data<SimpleValue>(query, param, Constants.ConnectionString.ClayFinancial);

    }

  }
}