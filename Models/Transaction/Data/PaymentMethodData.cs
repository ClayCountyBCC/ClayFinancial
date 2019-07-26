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
    public Int64 payment_method_data_id { get; set; }
    public long transaction_id { get; set; }
    public Int64 transaction_payment_type_id { get; set; }
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
    // THAT WILL POPULATE THE DATATABLE AND RETURN THAT. NOT SAVE(); THIS IS TRUE FOR THE OTHER TWO FUNCTIONS:
    // ControlData.Save() AND PaymentTypeData.Save().
    public PaymentMethodData Save()
    {
      var dt = CreatePaymentMethodDataTable();


      return new PaymentMethodData();
    }

    private DataTable CreatePaymentMethodDataTable()
    {
      var dt = new DataTable("PaymentMethodData");

      dt.Columns.Add(new DataColumn("payment_method_data_id", typeof(long)));
      dt.Columns.Add(new DataColumn("transaction_payment_type_id", typeof(long)));
      dt.Columns.Add(new DataColumn("department_id", typeof(long)));
      dt.Columns.Add(new DataColumn("transaction_id", typeof(long)));
      dt.Columns.Add(new DataColumn("cash_amount", typeof(decimal)));
      dt.Columns.Add(new DataColumn("check_amount", typeof(decimal)));
      dt.Columns.Add(new DataColumn("check_number", typeof(string)));
      dt.Columns.Add(new DataColumn("check_from", typeof(string)));
      dt.Columns.Add(new DataColumn("paying_for", typeof(string)));
      dt.Columns.Add(new DataColumn("is_active", typeof(bool)));

      return dt;
    }
  }
}
 