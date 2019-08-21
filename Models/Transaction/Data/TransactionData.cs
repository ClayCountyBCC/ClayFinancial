using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClayFinancial.Models;


namespace ClayFinancial.Models.Transaction.Data
{
  public class TransactionData
  {

    public long transaction_id { get; set; }
    public int fiscal_year { get; set; }
    public int created_by_employee_id { get; set; }
    public int employee_transaction_count { get; set; }
    public string transaction_number { get; set; }
    public long parent_transaction_id { get; set; }
    public int department_id { get; set; }
    public List<ControlData> department_control_data { get; set; }
    public List<PaymentTypeData> payment_type_data { get; set; }
    public string county_manager_name { get; set; }
    public string error_text { get; set; } = "";
    public string received_from { get; set; } = "";
    public DateTime created_on { get; set; } = DateTime.MinValue;
    public string created_by_username { get; set; } = "";
    public string created_by_ip_address { get; set; } = "";
    private bool has_error { get; set; } = false;

    public TransactionData()
    {

    }
    public TransactionData(string er)
    {
      error_text = er;
    }


    public bool ValidateNewReceipt()
    {


      return false;
    }

    public static List<TransactionData> Get()
    {

      return new List<TransactionData>();
    }

    public static TransactionData GetTransactionData(long transaction_id)
    {
      var param = new DynamicParameters();
      param.Add("@transaction_id", transaction_id);

      var query = $@"

        SELECT 
          TD.transaction_id
          ,TD.transaction_number
          ,ISNULL(TD.parent_transaction_id,-1) parent_transaction_id
          ,TD.department_id
          ,TD.created_by_username
          ,TD.created_on
        FROM ClayFinancial.dbo.transaction_data TD
        WHERE transaction_id = @transaction_id;

      ";

      var td = Constants.Get_Data<TransactionData>(query, Constants.ConnectionString.ClayFinancial);

      if (td == null || td.Count() == 0)
      {
        new ErrorLog("transaction_id: " + transaction_id, "There was an issue retrieving the transaction.", "", "", query);
        return new TransactionData("There was an issue retrieving the transaction.");
      }
      // TODO: using statement for call
      return td.First();
    }

    public void SetUserProperties(UserAccess ua)
    {

      // set all user properties here
      created_by_employee_id = ua.employee_id;
      created_by_username = ua.user_name;
      //display_name = ua.display_name;

    }


    public void SetHasError(bool hasError)
    {

      has_error = hasError;
    }
    public TransactionView SaveNewReceipt()
    {

      var param = new DynamicParameters();
      param.Add("@transaction_id", dbType: DbType.Int64, direction: ParameterDirection.Output);
      param.Add("@created_by_employee_id", created_by_employee_id);
      param.Add("@username", created_by_username);
      param.Add("@department_id", department_id);
      //param.Add("@display_name", display_name);
      param.Add("@created_by_employee_ip_address", created_by_ip_address);
      param.Add("@parent_transaction_id", parent_transaction_id);

      var query = @"
          USE ClayFinancial;

              -- SAVE TRANSACTION DATA
              EXEC ClayFinancial.dbo.insert_new_transaction_data 
                      @transaction_id OUTPUT, 
                      @department_id, 
                      @created_by_employee_id, 
                      @parent_transaction_id, 
                      @username, 
                      @created_by_employee_ip_address;
    
              -- INSERT PAYMENT TYPE DATA
              INSERT INTO payment_type_data
              (
                transaction_id, 
                payment_type_id, 
                payment_type_index,
                tax_exempt
              )
              SELECT
                @transaction_id,
                payment_type_id,
                payment_type_index,
                tax_exempt
              FROM @PaymentTypeData;
    

              -- INSERT PAYMENT METHOD DATA
              -- INNER JOIN TO payment_type_data TO GET transaction_payment_type_id
              INSERT INTO payment_method_data
              (
                transaction_payment_type_id,
                transaction_id, 
                cash_amount, 
                check_amount, 
                check_number, 
                check_from, 
                paying_for
              )
              SELECT
                PTD.transaction_payment_type_id, 
                @transaction_id,
                cash_amount,
                check_amount, 
                check_number, 
                check_from, 
                paying_for
              FROM @PaymentMethodData PMD
              INNER JOIN payment_type_data PTD ON 
                PTD.transaction_id = @transaction_id AND 
                PTD.payment_type_id = PMD.payment_type_id AND 
                PTD.payment_type_index = PMD.payment_type_index;


              -- INSERT CONTROL DATA
              -- OUTER JOIN TO payment_type_data TO GET transaction_payment_type_id FOR payment_type_controls
              -- department_id WILL BE NULL FOR PAYMENT TYPE CONTROLS. THE VALUE IS NOT SET IN THE APPLICATION.
              -- THE department_id WILL NOT BE NULL FOR DEPARTMENT CONTROLS. THE VALUE IS SET IN THE APPLICATION.
              --    THE transaction_payment_type_id WILL BE NULL FOR DEPARTMENT CONTROLS.
              INSERT INTO control_data
              (
                transaction_payment_type_id,
                department_id,
                transaction_id,
                control_id,
                value
              )
              SELECT
                CASE WHEN PTD.transaction_payment_type_id = -1 THEN NULL ELSE PTD.transaction_payment_type_id END,
                CASE WHEN CD.department_id = -1 THEN NULL ELSE CD.department_id END,
                @transaction_id,
                CD.control_id,
                CD.value
              FROM @ControlData CD
              LEFT OUTER JOIN payment_type_data PTD ON 
                PTD.transaction_id = @transaction_id AND 
                PTD.payment_type_id = CD.payment_type_id AND 
                PTD.payment_type_index = CD.payment_type_index;


              

        ";



      // CREATE DATA TABLES
      var controlDataTable = ControlData.GetControlDataTable();
      var paymentTypeDataTable = PaymentTypeData.GetPaymentTypeDataTable();
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
              cd.department_id,
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

        using (IDbConnection db = new SqlConnection(Constants.Get_ConnStr(Constants.ConnectionString.ClayFinancial)))
        {
          var i = db.ExecuteScalar(
                        query,
                        param,
                        commandTimeout: 60); //  THIS SAVE SHOULD NOT TAKE MORE THAN A COUPLE OF SECONDS.


        }

        transaction_id = param.Get<long>("@transaction_id");

        return GetTransactionView();

      }
      catch (Exception ex)
      {

        new ErrorLog(ex, query);
        return null;

      }



    }
    private TransactionView GetTransactionView()
    {

      return new TransactionView(transaction_id);
    }
  }
}