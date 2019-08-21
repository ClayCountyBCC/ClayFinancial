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

    public long payment_method_data_id { get; set; } = -1;
    public long prior_payment_method_data_id { get; set; } = -1;
    public long transaction_payment_type_id { get; set; } = -1;
    public long transaction_id { get; set; } = -1;
    public decimal cash_amount { get; set; } = -1;
    public decimal check_amount { get; set; } = -1;
    public string check_number { get; set; } = "";
    public string paying_for { get; set; } = "";
    public string check_from { get; set; } = "";
    public bool is_active { get; set; }
    public bool added_after_save { get; set; } = false;
    public string modified_by { get; set; } = "";
    public DateTime modified_on { get; set; } = DateTime.MinValue;
    public string reason_for_change { get; set; } = "";
    public string error_text { get; set; } = "";

    public PaymentMethodData()
    {
    }

    public PaymentMethodData Get()
    {
      
      return new PaymentMethodData();
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

      dt.Columns.Add(new DataColumn("cash_amount", typeof(decimal)));
      dt.Columns.Add(new DataColumn("check_amount", typeof(decimal)));
      dt.Columns.Add(new DataColumn("check_number", typeof(string)));
      dt.Columns.Add(new DataColumn("check_from", typeof(string)));
      dt.Columns.Add(new DataColumn("paying_for", typeof(string)));
      dt.Columns.Add(new DataColumn("payment_type_id", typeof(long)));
      dt.Columns.Add(new DataColumn("payment_type_index", typeof(short)));

      return dt;
    }

    public bool ValidateNew()
    {
      if (payment_method_data_id == -1 && prior_payment_method_data_id == -1)
      {

        if (cash_amount < 0)
        {
          error_text = "Cash amount can not be less than zero";
          return false;
        }

        if (check_amount > 0 && check_number.Length > 0 && check_number != "bulk")
        {
          error_text = "The check number is missing from a check with an amount of " + check_amount.ToString();
          return false;
        }

        if (check_number.Length > 0 && check_amount <= 0)
        {
          error_text = "The amount for check number " + check_number + " has not been entered";
          return false;
        }

        if (check_number.Length > 0 && paying_for.Length == 0)
        {
          error_text = "A check must have the 'Paying For' field filled out";
          return false;
        }

      }
      else
      {
        error_text = "There was an issue with this payment method";
        return false;
      }

      return true;
    }
    

    public bool ValidateChange()
    {
     
      if (prior_payment_method_data_id == -1)
      {
        error_text = "There was an issue with the updated payment method";
        return false;
      }

      if (reason_for_change.Length == 0)
      {
        
        error_text = "Please enter a reason for the change to this payment method";
        return false;
      }

      return ValidateNew();
    }
  }
}
 