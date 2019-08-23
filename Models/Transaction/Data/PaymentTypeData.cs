using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
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

    public static List<PaymentTypeData> Get(long transaction_id)
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
        LEFT OUTER JOIN ClayFinancial.dbo.data_changes_payment_type CPT 
          ON CPT.transaction_payment_type_id = PT.transaction_payment_type_id
        WHERE 
          transaction_id = @transaction_id
      
      ";

      var pt = Constants.Get_Data<PaymentTypeData>(query, param, Constants.ConnectionString.ClayFinancial);

      foreach(var type in pt)
      {

        type.control_data = ControlData.Get(transaction_id, type.transaction_payment_type_id);

        type.payment_method_data = PaymentMethodData.Get(transaction_id, type.transaction_payment_type_id);

      }


      return pt;
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
    public TransactionData SaveChangePaymentType()
    {
      // TODO: add code to save new payment type

      return TransactionData.GetTransactionData(transaction_id);

    }

    public bool ValidateChangePaymentType()
    {
      PaymentType pt = new PaymentType();

      if(!pt.ValidateChangePaymentType(this))
      {
       
        return false; 
      }

      return pt.ValidatePaymentType(this);

    }


  }
}// get the next transaction id