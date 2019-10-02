using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Dapper;

namespace ClayFinancial.Models.Transaction.Data
{
  public class PaymentTypeData
  {

    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public int payment_type_id { get; set; }
    public int payment_type_index { get; set; }
    public List<ControlData> control_data { get; set; }
    public List<PaymentMethodData> payment_method_data { get; set; }
    public string error_text { get; set; } = "";
    public bool added_after_save { get; set; } = false;
    public DateTime added_on { get; set; } = DateTime.MinValue;
    public string added_by { get; set; } = "";

    public static List<PaymentTypeData> Get(long transaction_id, List<ControlData> controls, List<PaymentMethodData> payment_methods)
    {
      var param = new DynamicParameters();

      param.Add("@transaction_id", transaction_id);
      var query = @"
      
        SELECT
          PT.transaction_payment_type_id,
          PT.transaction_id,
          PT.payment_type_id,
          PT.payment_type_index,
          PT.added_after_save,
          CPT.added_on,
          CPT.added_by
        FROM  ClayFinancial.dbo.data_payment_type PT
        INNER JOIN payment_types P ON P.payment_type_id = PT.payment_type_id
        LEFT OUTER JOIN ClayFinancial.dbo.data_changes_payment_type CPT 
          ON CPT.transaction_payment_type_id = PT.transaction_payment_type_id
        WHERE 
          transaction_id = @transaction_id
        ORDER BY P.name, PT.payment_type_index;
      ";

      var payment_types = Constants.Get_Data<PaymentTypeData>(query, param, Constants.ConnectionString.ClayFinancial);

      foreach (var payment_type in payment_types)
      {

        payment_type.control_data = (from c in controls
                                     where c.transaction_payment_type_id.HasValue &&
                                     c.transaction_payment_type_id.Value == payment_type.transaction_payment_type_id
                                     select c).ToList();

        payment_type.payment_method_data = (from p in payment_methods
                                            where p.transaction_payment_type_id == payment_type.transaction_payment_type_id
                                            select p).ToList();

      }


      return payment_types;
    }


    // IF ALL OF THE SAVING IS HAPPENING INSIDE OF ONE TRANSACTION, THEN THIS WILL NEED TO BE A GetDataTable() FUNCTION
    // THAT WILL POPULATE THE DATATABLE AND RETURN THAT AFTER THE DATA IS VALIDATED. NOT SAVE(); THIS IS TRUE FOR THE OTHER TWO FUNCTIONS:
    // ControlData.Save() AND PaymentMethodData.Save().
    public static DataTable GetPaymentTypeDataTable()
    {
      var dt = CreatePaymentTypeDataTable();



      return dt;
    }

    private static DataTable CreatePaymentTypeDataTable()
    {

      // TODO: create generic DataTable function.
      // Pass name of column and type for each column
      var dt = new DataTable("PaymentTypeData");


      dt.Columns.Add(new DataColumn("payment_type_id", typeof(short)));
      dt.Columns.Add(new DataColumn("payment_type_index", typeof(short)));

      return dt;
    }


    // This is used when a payment type has been added to a saved transaction

    public bool ValidateChangePaymentType()
    {
      PaymentType pt = new PaymentType();


      return pt.ValidatePaymentType(this);

    }

    public static bool SaveChangePaymentTypeData(List<PaymentTypeData> payment_type_data, UserAccess ua, string user_ip_address)
    {
      if (!payment_type_data.Any()) return false;
      var transaction_id = payment_type_data.FirstOrDefault().transaction_id;
      var param = new DynamicParameters();
      param.Add("@transaction_id", payment_type_data.FirstOrDefault().transaction_id);
      param.Add("@created_by_employee_id", ua.employee_id);
      param.Add("@username", ua.user_name);

      param.Add("@created_by_employee_ip_address", user_ip_address);
      param.Add("@created_by_display_name", ua.display_name);


      StringBuilder query = new StringBuilder();
      query.AppendLine(@"
          USE ClayFinancial;
     
          ");


      query.AppendLine(PaymentTypeData.GetSavePaymentTypeDataQuery());
      query.AppendLine(PaymentMethodData.GetSavePaymentMethodsQuery());
      query.AppendLine(ControlData.GetSaveControlDataQuery());

      // this needs to happen to recalculate the totals for the transaction.
      // we may need to consider having a transaction_data_changes table to track changes
      query.AppendLine(TransactionData.GetUpdateTransactionTotals());

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

        }


        // add tvp to parameter list
        param.Add("@ControlData", controlDataTable.AsTableValuedParameter("dbo.ControlData"));
        param.Add("@PaymentMethodData", paymentMethodDataTable.AsTableValuedParameter("dbo.PaymentMethodData"));
        param.Add("@PaymentTypeData", paymentTypeDataTable.AsTableValuedParameter("dbo.PaymentTypeData"));

        return Constants.Exec_Query(query.ToString(), param, Constants.ConnectionString.ClayFinancial) > -1;

      }
      catch (Exception ex)
      {

        new ErrorLog(ex, query.ToString());
        return false;

      }

    }

    public static string GetSavePaymentTypeDataQuery()
    {

      return
      @"              

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
              
              ";

    }
  }// get the next transaction id
}