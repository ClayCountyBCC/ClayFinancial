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

    /*
     *      + payment_type
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
     * */
    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public bool tax_exempt { get; set; }
    public short payment_type_id { get; set; }
    public short payment_type_index { get; set; }
    public List<PaymentMethodData> payment_methods { get; set; }
    public List<ControlData> controls { get; set; }

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

      var payment_type_id = new DataColumn("payment_type_id", typeof(short));
      payment_type_id.ReadOnly = true;
      var payment_type_index = new DataColumn("payment_type_index", typeof(short));
      payment_type_index.ReadOnly = true;
      var tax_exempt = new DataColumn("tax_exempt", typeof(bool));
      tax_exempt.ReadOnly = true;


      dt.Columns.Add(payment_type_id);
      dt.Columns.Add(payment_type_index);
      dt.Columns.Add(tax_exempt);

      return dt;
    }
  }
}// get the next transaction id