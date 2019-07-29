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
  public class TransactionData // temp name till I figure out more stuff
  {
    /*  
     *  
     * 
     * Transaction has
     *  - id
     *  - parent_transaction_id -- note: this is only true if one exists, other wise will be -1;
     *  - department
     *    + name
     *    + is_active
     *    +department_control_data
     *      - control_id
     *      - value
     *      - is_active
     *    + payment_type[]
     *        - tax_exempt
     *        - payment_type_controls[]
     *           + transaction_payment_type_id
     *           + control_id
     *           + value
     *           + is_active
     *        - payment_methods[]
     *          + cash_amount
     *          + check_amount
     *          + check_number
     *          + check_from
     *          + paying_for
     *          + is_active
     * 
     * 
     * The above heirarchy does not show all data in the tables. This is solely the data necessary to save.
     * All tables storing transaction data will also have the transaction_id saved.
     *  
     *  
     * */
    public long transaction_id { get; set; }
    public int fiscal_year { get; set; }
    public int employee_transaction_count { get; set; }
    public string transaction_number { get; set; }
    public int created_by_employee_id { get; set; }
    public string username { get; set; }
    public string display_name { get; set; }
    public string created_by_employee_ip_address { get; set; }
    public DateTime created_on { get; set; }
    public long parent_transaction_id { get; set; } = -1;
    public int department_id { get; set; }
    public List<ControlData> department_controls { get; set; }
    public List<PaymentTypeData> payment_types { get; set; }
    public string error { get; set; } = "";



    public TransactionData()
    {

    }
    public TransactionData(string er)
    {
      error = er;
    }


    public bool validate()
    {

      return false;
    }

    public List<TransactionData> Get()
    {

      return new List<TransactionData>();
    }

    public TransactionData GetTransactionData()
    {
      var query = $@"

        SELECT 
          TD.transaction_id
          ,TD.transaction_number
          ,ISNULL(TD.parent_transaction_id,-1) parent_transaction_id
          ,TD.department_id
          ,TD.created_by_username
          ,TD.created_on
        FROM ClayFinancial.dbo.transaction_data TD
        WHERE transaction_id = @transaction_id

      ";

      var td = Constants.Get_Data<TransactionData>(query, new DynamicParameters(transaction_id), Constants.ConnectionString.ClayFinancial);

      if(td.Count() == 0)
      {
        new ErrorLog("transaction_id: " + transaction_id, "There was an issue retrieving the transaction after saving it.", "", "", query);
        return new TransactionData("There was an issue retrieving the transaction after saving it.");
      }
      // TODO: using statement for call
      return td.First();
    }

    public void SetUserProperties(UserAccess ua)
    {

      // set all user properties here
      created_by_employee_id = ua.employee_id;
      username = ua.user_name;
      display_name = ua.display_name;
     
    }

    public TransactionData Save()
    {

      var controlDataTable = ControlData.GetControlDataTable();
      var paymentTypeDataTable = PaymentTypeData.GetPaymentTypeDataTable();
      var paymentMethodDataTable = PaymentMethodData.GetPaymentMethodDataTable();

      var param = new DynamicParameters();
      param.Add("@transaction_id", dbType: DbType.Int64, direction: ParameterDirection.Output);

      var query = @"
          USE ClayFinancial;

          BEGIN TRAN
            BEGIN TRY




              COMMIT
            END TRY
            BEGIN CATCH

            END CATCH
   
          END TRAN
          
        
        ";
      try
      {
        foreach (PaymentTypeData ptd in payment_types)
        {
          // add payment type data to its data table
          paymentTypeDataTable.Rows.Add
          (
            ptd.transaction_id,
            ptd.tax_exempt,
            ptd.payment_type_id,
            ptd.payment_type_index
          );

          // add payment method data to its data table
          foreach (PaymentMethodData pmd in ptd.payment_methods)
          {

            paymentMethodDataTable.Rows.Add
            (
              pmd.transaction_id,
              pmd.cash_amount,
              pmd.check_amount,
              pmd.check_number,
              pmd.check_from,
              pmd.paying_for,
              pmd.is_active,
              ptd.payment_type_id,
              ptd.payment_type_index

            );
          }

          // add control data to its data table
          foreach (ControlData cd in ptd.controls)
          {

            controlDataTable.Rows.Add
            (
              cd.transaction_id,
              cd.department_id,
              cd.control_id,
              cd.value,
              cd.is_active,
              cd.created_on,
              cd.created_by,
              cd.modified_on,
              cd.modified_by,
              ptd.payment_type_id,
              ptd.payment_type_index

            );
          }

        }
        int i = -1;
        using (IDbConnection db = new SqlConnection(Constants.Get_ConnStr(Constants.ConnectionString.ClayFinancial)))
        {
         i = db.Execute(
                      query, 
                      new { 
                           tbv_PaymentTypeData = paymentTypeDataTable.AsTableValuedParameter("tbv_PaymentTypeData"),
                           tbv_controlData = controlDataTable.AsTableValuedParameter("tbv_ControlData"),
                           tbv_PaymentMethodData = paymentMethodDataTable.AsTableValuedParameter("tbv_PaymentMethodData")

          }, commandTimeout: 60); // I DID NOT CHANGE THIS FROM THE BORROWED CODE. THIS SAVE SHOULD NOT TAKE MORE THAN A COUPLE OF SECONDS. SO 60 COULD STILL BE VALID AS A TIMEOUT
        }


        if(i < 1)
        {
          error = "There was an issue saving the transaction.";
          return this;
        }

        return GetTransactionData();

      }
      catch (Exception ex)
      {

        new ErrorLog("Error in TransactionData.Save()", "Error Saving The Transaction", ex.StackTrace, ex.Source, query);
        return null;
      }
    }

  }
}