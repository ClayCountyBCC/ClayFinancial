using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClayFinancial.Models.Transaction;



namespace ClayFinancial.Models.Transaction.Data
{
  public class TransactionData
  {

    public long transaction_id { get; set; } = -1;
    public int fiscal_year { get; set; }
    public int created_by_employee_id { get; set; }
    public int employee_transaction_count { get; set; }
    public string transaction_number { get; set; }
    public char transaction_type { get; set; } = 'R';
    public long child_transaction_id { get; set; }
    public int department_id { get; set; }
    public List<ControlData> department_control_data { get; set; }
    public List<PaymentTypeData> payment_type_data { get; set; }
    public string county_manager_name { get; set; }
    public string error_text { get; set; } = "";
    public string received_from { get; set; } = "";
    public DateTime created_on { get; set; } = DateTime.MinValue;
    public string created_by_username { get; set; } = "";
    public string created_by_display_name { get; set; } = "";
    public string created_by_ip_address { get; set; } = "";
    private bool has_error { get; set; } = false;

    public TransactionData()
    {

    }
    public TransactionData(string er)
    {
      error_text = er;
    }



    public bool ValidateTransaction()
    {

      switch (transaction_type)
      {

        case 'R':
          if (!ValidateNewReceipt()) return false;
          break;
        case 'D':
          if (!ValidateNewDeposit()) return false;
          break;
        default:
          return false;
      }

      return true;
    }

    public TransactionData SaveTransactionData()
    {

      switch (transaction_type)
      {

        case 'R':
          if (!SaveNewReceipt()) return this;
          break;
        case 'D':
          if (!SaveNewDeposit()) return this;
          break;

        default:
          error_text = "Unknown transaction type.";
          return this;
      }

      return GetTransactionData(transaction_id);

    }
    private bool ValidateNewReceipt()
    {
      var department = new Department();
      
      return department.ValidateTransactionData(this);
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

      DECLARE @county_manager_name varchar(75) = 
        (SELECT
          name FROM ClayFinancial.dbo.county_manager 
        WHERE CAST(GETDATE() as DATE) BETWEEN start_date AND ISNULL(end_date, CAST(GETDATE() AS DATE)));


        SELECT 
          TD.transaction_id
          ,fiscal_year
          ,created_by_employee_id
          ,TD.transaction_number
          ,ISNULL(TD.child_transaction_id,-1) child_transaction_id
          ,TD.department_id
          ,transaction_type
          ,child_transaction_id
          ,TD.created_on
          ,ISNULL(CM.name, 'Unknown') county_manager_name
          ,TD.created_on
          ,received_from
          ,created_by_username
          ,created_by_display_name
          ,created_by_ip_address
        FROM ClayFinancial.dbo.data_transaction TD
        LEFT OUTER JOIN county_manager CM ON CAST(TD.created_on AS DATE)
          BETWEEN CM.Start_date AND ISNULL(CM.end_date, CAST(GETDATE() AS DATE))
        WHERE transaction_id = @transaction_id;


      ";
      // TODO: FILL THE REST OF THE TRANSACTION DATA.
      var td = Constants.Get_Data<TransactionData>(query, param,Constants.ConnectionString.ClayFinancial);

      var tr= td.First();
      tr.department_control_data = ControlData.Get(tr.transaction_id, tr.department_id);
      tr.payment_type_data = PaymentTypeData.Get(tr.transaction_id);

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
      created_by_display_name = ua.display_name;


    }


    public void SetHasError(bool hasError)
    {
      has_error = hasError;
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


      var query = @"
          USE ClayFinancial;

              -- SAVE TRANSACTION DATA
              EXEC ClayFinancial.dbo.insert_new_transaction_data 
                      @transaction_id OUTPUT, 
                      @department_id, 
                      @created_by_employee_id,
                      @transaction_type,
                      @child_transaction_id, 
                      @username, 
                      @created_by_employee_ip_address,
                      @created_by_display_name,
                      @received_from

    
              -- INSERT PAYMENT TYPE DATA
              INSERT INTO data_payment_type
              (
                transaction_id, 
                payment_type_id, 
                payment_type_index
              )
              SELECT
                @transaction_id,
                payment_type_id,
                payment_type_index
              FROM @PaymentTypeData;
    

              -- INSERT data_payment_method
              -- INNER JOIN TO data_payment_type TO GET transaction_payment_type_id
              INSERT INTO data_payment_method 
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
              INNER JOIN data_payment_type PTD ON 
                PTD.transaction_id = @transaction_id AND 
                PTD.payment_type_id = PMD.payment_type_id AND 
                PTD.payment_type_index = PMD.payment_type_index;


              -- INSERT CONTROL DATA
              -- OUTER JOIN TO payment_type_data TO GET transaction_payment_type_id FOR payment_type_controls
              -- department_id WILL BE NULL FOR PAYMENT TYPE CONTROLS. THE VALUE IS NOT SET IN THE APPLICATION.
              -- THE department_id WILL NOT BE NULL FOR DEPARTMENT CONTROLS. THE VALUE IS SET IN THE APPLICATION.
              --    THE transaction_payment_type_id WILL BE NULL FOR DEPARTMENT CONTROLS.
              INSERT INTO data_control
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
              LEFT OUTER JOIN data_payment_type PTD ON 
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

        //using (IDbConnection db = new SqlConnection(Constants.Get_ConnStr(Constants.ConnectionString.ClayFinancial)))
        //{
        //  var i = db.ExecuteScalar(
        //                query,
        //                param,
        //                commandTimeout: 60); //  THIS SAVE SHOULD NOT TAKE MORE THAN A COUPLE OF SECONDS.



        //}

        var tran = Constants.Exec_Query(query, param, Constants.ConnectionString.ClayFinancial);
        
        transaction_id = param.Get<long>("@transaction_id");

        if(transaction_id == -1)
        {
          error_text = "There was an issue saving the receipt.";
          return false;
        }


        return true;

      }
      catch (Exception ex)
      {

        new ErrorLog(ex, query);
        return false;

      }



    }

  }
}