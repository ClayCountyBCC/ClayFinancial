using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace ClayFinancial.Models.Transaction.Data
{
  public class PaymentMethodData
  {

    /*
     * 
     * 
     *  - payment_methods[]
     *    + cash_amount
     *    + check_amount
     *    + check_number
     *    + check_from
     *    + paying_for
     *    + is_active
     *
     */
    public long payment_method_data_id { get; set; }
    public long transaction_id { get; set; }
    public long transaction_payment_type_id { get; set; }
    public decimal cash_amount { get; set; }
    public decimal check_amount { get; set; }
    public string check_number { get; set; }
    public string paying_for { get; set; }
    public string check_from { get; set; }
    public bool is_active { get; set; }

    public PaymentMethodData()
    {

    }

    public PaymentMethodData Get()
    {

      return new PaymentMethodData();
    }
    public string Validate()
    {

      return "";
    }
    // IF ALL OF THE SAVING IS HAPPENING INSIDE OF ONE TRANSACTION, THEN THIS WILL NEED TO BE A GetDataTable() FUNCTION
    // THAT WILL POPULATE THE DATATABLE AND RETURN THAT. NOT SAVE(); THIS IS ALSO TRUE FOR THE OTHER TWO FUNCTIONS:
    // ControlData.Save() AND PaymentTypeData.Save().
    public static DataTable GetPaymentMethodDataTable()
    {
      var dt = CreatePaymentMethodDataTable();

      return dt;
    }

    private static DataTable CreatePaymentMethodDataTable()
    {
      var dt = new DataTable("PaymentMethodData");
      var cash_amount = new DataColumn("cash_amount", typeof(decimal));
      cash_amount.ReadOnly = true;
      var check_amount = new DataColumn("check_amount", typeof(decimal));
      check_amount.ReadOnly = true;
      var check_number = new DataColumn("check_number", typeof(string));
      check_number.ReadOnly = true;
      var check_from = new DataColumn("check_from", typeof(string));
      check_from.ReadOnly = true;
      var paying_for = new DataColumn("paying_for", typeof(string));
      paying_for.ReadOnly = true;
      var payment_type_id = new DataColumn("payment_type_id", typeof(long));
      payment_type_id.ReadOnly = true;
      var payment_type_index = new DataColumn("payment_type_index", typeof(short));
      payment_type_index.ReadOnly = true;

      dt.Columns.Add(cash_amount);
      dt.Columns.Add(check_amount);
      dt.Columns.Add(check_number);
      dt.Columns.Add(check_from);
      dt.Columns.Add(paying_for);
      dt.Columns.Add(payment_type_id);
      dt.Columns.Add(payment_type_index);

      return dt;
    }
  }
}
 