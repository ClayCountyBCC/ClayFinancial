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
    public long? prior_payment_method_data_id { get; set; }
    public long transaction_payment_type_id { get; set; } = -1;
    public long transaction_id { get; set; } = -1;
    public decimal cash_amount { get; set; } = -1;
    public decimal check_amount { get; set; } = -1;
    public int check_count { get; set; } = 0;
    public string check_number { get; set; } = "";
    public string paying_for { get; set; } = "";
    public string check_from { get; set; } = "";
    public bool is_active { get; set; } = false;
    public bool added_after_save { get; set; } = false;
    public string modified_by { get; set; } = "";
    public DateTime modified_on { get; set; } = DateTime.MinValue;
    public string reason_for_change { get; set; } = "";
    public string error_text { get; set; } = "";

    public PaymentMethodData()
    {
    }

    public static List<PaymentMethodData> GetActiveTransactionPaymentMethods(long transaction_id)
    {
      var param = new DynamicParameters();
      param.Add("transaction_id", transaction_id);

      var query = @"
        SELECT 
          pm.payment_method_data_id
          ,cpm.original_payment_method_data_id
          ,pm.transaction_payment_type_id
          ,pm.transaction_id
          ,pm.cash_amount
          ,pm.check_amount
          ,pm.check_count
          ,pm.check_number
          ,pm.check_from
          ,pm.paying_for
          ,pm.is_active
          ,pm.added_after_save
          ,cpm.modified_on
          ,cpm.modified_by
          ,cpm.reason_for_change
        FROM data_payment_method pm
        LEFT OUTER JOIN data_changes_payment_method cpm on cpm.new_payment_method_data_id =  pm.payment_method_data_id
        WHERE 
          transaction_id = @transaction_id
          AND is_active = 1
        ORDER BY payment_method_data_id, original_payment_method_data_id
      ";

      var pm = Constants.Get_Data<PaymentMethodData>(query, param, Constants.ConnectionString.ClayFinancial);
      // pm.RemoveAll(p => p.cash_amount == 0 && p.check_amount == 0 && p.check_number.Length == 0 && p.is_active == false);
      return pm;
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
      dt.Columns.Add(new DataColumn("check_count", typeof(short)));
      dt.Columns.Add(new DataColumn("check_number", typeof(string)));
      dt.Columns.Add(new DataColumn("check_from", typeof(string)));
      dt.Columns.Add(new DataColumn("paying_for", typeof(string)));
      dt.Columns.Add(new DataColumn("payment_type_id", typeof(long)));
      dt.Columns.Add(new DataColumn("payment_type_index", typeof(short)));

      return dt;
    }

    public bool ValidateNew()
    {

      if (cash_amount < 0)
      {
        error_text = "Cash amount can not be less than zero";
        return false;
      }

      if (check_amount > 0)
      {
        if (check_count == 1)
        {
          if (check_number.Length == 0)
          {
            error_text = "The check number is missing";
            return false;
          }

          if (check_from.Length == 0)
          {
            error_text = "Missing data in the check from field";
            return false;
          }

        }
      }



      if (check_number.Length > 0 && check_amount <= 0)
      {
        error_text = "No amount was entered for check number " + check_number ;
        return false;
      }

      //if (check_number.Length > 0 && paying_for.Length == 0)
      //{
      //  error_text = "A check must have the 'Paying For' field filled out";
      //  return false;
      //}

      return true;
    }
    

    public bool ValidateChange()
    {
     
      if (!prior_payment_method_data_id.HasValue)
      {
        error_text = "There was an issue with the updated payment method";
        return false;
      }

      if (reason_for_change.Length == 0)
      {
        
        error_text = "Please enter a reason for the change to this payment method";
        return false;
      }

      //Need to be able to validate the number of checks has now changed from one person to the next.;

      return ValidateNew();
    }

    public static string GetSavePaymentMethodsQuery()
    {

      return @"
    
              -- INSERT data_payment_method
              -- INNER JOIN TO data_payment_type TO GET transaction_payment_type_id
              INSERT INTO data_payment_method 
              (
                transaction_payment_type_id,
                transaction_id, 
                cash_amount, 
                check_amount,
                check_count,
                check_number, 
                check_from, 
                paying_for
              )
              SELECT
                PTD.transaction_payment_type_id, 
                @transaction_id,
                cash_amount,
                check_amount,
                check_count,
                check_number, 
                check_from, 
                paying_for
              FROM @PaymentMethodData PMD
              INNER JOIN data_payment_type PTD ON 
                PTD.transaction_id = @transaction_id AND 
                PTD.payment_type_id = PMD.payment_type_id AND 
                PTD.payment_type_index = PMD.payment_type_index;
                
                ";
    }


  }
}
 