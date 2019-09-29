﻿using System;
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
    public string created_by_ip_address { get; set; } = "";
    public List<long> deposit_receipt_ids { get; set; } = new List<long>();
    public List<TransactionData> deposit_receipts { get; set; } = new List<TransactionData>();
    //public int? number_of_deposit_receipts { get; set; } = null;
    public bool my_transaction { get; set; } = false;
    public bool can_modify { get; set; } = false;
    public bool has_error { get; set; } = false;

    public TransactionData()
    {

    }

    public TransactionData(string er)
    {
      error_text = er;
    }

    public static List<TransactionData> GetTransactionList(UserAccess ua, int page_number)
    {
      var sb = new StringBuilder();
      var param = new DynamicParameters();
      param.Add("@my_employee_id", ua.employee_id);


      var query = @"

         WITH deposit_receipt_count AS (

          SELECT
           child_transaction_id,
           COUNT(*) deposit_receipt_count
           FROM data_transaction
           WHERE child_transaction_id IS NOT NULL
           GROUP BY child_transaction_id

         )

        SELECT 
          T.transaction_id
          ,T.child_transaction_id
          ,T.fiscal_year
          
          ,T.transaction_number
          ,T.created_by_display_name
          ,CASE WHEN T.created_by_employee_id = @my_employee_id 
            THEN 1 
            ELSE 0 
            END my_transaction
          ,CASE WHEN T.child_transaction_id IS NULL AND T.created_by_employee_id = @my_employee_id
            THEN 1
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
            END can_modify
          ,T.created_on
          ,T.department_id
          ,TV.department_name
          ,T.transaction_type
          ,T.has_been_modified
          ,T.total_cash_amount
          ,T.total_check_amount
          ,T.total_check_count
        FROM ClayFinancial.dbo.data_transaction T
        INNER JOIN ClayFinancial.dbo.vw_transaction_view TV ON T.transaction_id = TV.transaction_id
        ORDER BY T.transaction_id DESC

      ";

      sb.AppendLine(query);

      if (page_number > 0)
      {
        param.Add("@page_number", (page_number - 1) * page_size);
        sb.AppendLine($"OFFSET @page_number ROWS FETCH NEXT { page_size.ToString() } ROWS ONLY;");
      }

      var td = Constants.Get_Data<TransactionData>(sb.ToString(), param, Constants.ConnectionString.ClayFinancial);

      foreach (var t in td)
      {
        t.GetDepositReceiptIds();
      }

      return td;
    }



    public bool ValidateTransaction()
    {

      switch (transaction_type)
      {

        case "R":
          if (!ValidateNewReceipt()) return false;
          break;
        case "D":
          if (!ValidateNewDeposit()) return false;
          break;
        default:
          return false;
      }

      return true;
    }
    private bool ValidateNewReceipt()
    {
      var departments = Department.GetCachedDict();
      // wrong
      //Department department = Department.GetCachedDict()[department_id];
      // always test dictionaries for the key before you try and use data from the client.
      if (!departments.ContainsKey(department_id)) return false;
      return departments[department_id].ValidateTransactionData(this);
    }
    private bool ValidateNewDeposit()
    {
      return false;
    }



    public static TransactionData GetTransactionData(long transaction_id)
    {
      var param = new DynamicParameters();
      param.Add("@transaction_id", transaction_id);

      var query = $@"

      USE ClayFinancial;

        
        SELECT 
          TD.transaction_id
          ,TD.fiscal_year
          ,TD.created_by_employee_id
          ,TD.transaction_number
          ,TD.department_id
          ,TD.transaction_type
          ,TD.child_transaction_id
          ,TV.child_created_by_employee_id
          ,TV.grandchild_created_by_employee_id
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
        FROM ClayFinancial.dbo.data_transaction TD
        INNER JOIN vw_transaction_view TV ON TD.transaction_id = TV.transaction_id
        WHERE TD.transaction_id = @transaction_id;

      ";
      // TODO: FILL THE REST OF THE TRANSACTION DATA.
      var td = Constants.Get_Data<TransactionData>(query, param, Constants.ConnectionString.ClayFinancial);
      if (td == null || td.Count() == 0)
      {
        new ErrorLog("transaction_id: " + transaction_id, "There was an issue retrieving the transaction.", "", "", query);
        return new TransactionData("There was an issue retrieving the transaction.");
      }
      var tr = td.First();
      var controls = ControlData.GetActiveTransactionControls(tr.transaction_id);
      var payment_methods = PaymentMethodData.GetActiveTransactionPaymentMethods(tr.transaction_id);

      tr.department_control_data = (from c in controls
                                    where c.department_id.HasValue
                                    select c).ToList();

      tr.payment_type_data = PaymentTypeData.Get(tr.transaction_id, controls, payment_methods);
      
      return tr;
    }

    public void SetUserProperties(UserAccess ua)
    {

      // set all user properties here
      created_by_employee_id = ua.employee_id;
      created_by_username = ua.user_name;
      created_by_display_name = ua.display_name;


    }


    public TransactionData SaveTransactionData()
    {

      switch (transaction_type)
      {

        case "R":
          if (!SaveNewReceipt()) return this;
          break;
        case "D":
          if (!SaveNewDeposit()) return this;
          break;

        default:
          error_text = "Unknown transaction type.";
          return this;
      }

      return GetTransactionData(transaction_id);

    }
    private bool SaveNewDeposit()
    {
      return true;
    }
    private bool SaveNewReceipt()
    {
      var param = new DynamicParameters();
      param.Add("@transaction_id", dbType: DbType.Int64, direction: ParameterDirection.Output);
      param.Add("@created_by_employee_id", created_by_employee_id);
      param.Add("@username", created_by_username);
      param.Add("@department_id", department_id);
      param.Add("@transaction_type", transaction_type);
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
      query.AppendLine(GetUpdateTransactionTotals());

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


    public static string GetUpdateTransactionTotals()
    {
      return @"

          -- UPDATE total_cash_amount, total_check_amount, total_check_count FIELDS
          ;WITH PaymentMethodSums AS (

            SELECT
              transaction_id
              ,SUM(cash_amount) total_cash
              ,SUM(check_amount) total_checks
              ,SUM(CASE WHEN LEN(check_number) > 0 THEN 1 ELSE check_count END) number_of_checks
            FROM data_payment_method
            GROUP BY transaction_id

          )

          UPDATE DT
          SET 
            DT.Total_cash_amount = PMS.total_cash, 
            DT.total_check_amount = PMS.total_checks, 
            DT.total_check_count = PMS.number_of_checks
          FROM 
          data_transaction DT
          INNER JOIN PaymentMethodSums PMS ON PMS.transaction_id = DT.transaction_id
          WHERE 
            DT.transaction_id = @transaction_id;
      ";
    }



    public void GetDepositReceiptIds()
    {

      var param = new DynamicParameters();
      param.Add("@deposit_transaction_id", transaction_id);

      var query = @"
      
        SELECT
          transaction_id
        FROM ClayFinancial.dbo.data_transaction T
        WHERE child_transaction_id = @deposit_transaction_id
      
      ";

      deposit_receipt_ids = Constants.Get_Data<long>(query, param, Constants.ConnectionString.ClayFinancial);

    }
  }
}