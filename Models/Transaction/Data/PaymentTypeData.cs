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

    public PaymentTypeData Get()
    {
      return new PaymentTypeData();
    }

    public string Validate()
    {

      return "";
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


    private bool ValidatePaymentTypes(Data.TransactionData transactionData)
    {
      // everything we did for the department controls, we need to do here.
      // except that not every payment type should be filled out
      // but if a payment type is in our transactionData, we should be validating it.

      // Validate paymentTypeControlDatas

      // Validate paymentMethodData

      return false;

    }
  }
}// get the next transaction id