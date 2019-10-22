using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
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
    private string username { get; set; } = "";

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
    public static List<PaymentMethodData> GetActiveTransactionPaymentMethods(List<long> transaction_ids)
    {
      var param = new DynamicParameters();
      param.Add("transaction_id", transaction_ids);

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
          transaction_id IN @transaction_ids
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
    
    public bool ValidateChange()
    {
      
      if (transaction_id == -1)
      {
        error_text = "No transaction id available. Cannot save the payment method.";
        return false;
      }

      //if (!prior_payment_method_data_id.HasValue)
      //{
      //  error_text = "There was an issue with the updated payment method";
      //  return false;
      //}

      if (reason_for_change.Length == 0)
      {
        error_text = "Please enter a reason for the change to this payment method";
        return false;
      }

      //Need to be able to validate the number of checks has now changed from one person to the next.;

      return ValidateNew();
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
        error_text = "No amount was entered for check number " + check_number;
        return false;
      }

      return true;
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

    public bool SavePaymentMethod()
    {
      // AN EDITED METHOD WILL HAVE A REASON AND PRIOR PAYMENT METHOD DATA ID

      var param = new DynamicParameters();
      param.Add("@payment_method_data_id", payment_method_data_id);
      param.Add("@prior_payment_method_data_id", payment_method_data_id); // changed
      param.Add("@transaction_payment_type_id", transaction_payment_type_id);
      param.Add("@transaction_id", transaction_id);
      param.Add("@cash_amount", cash_amount);
      param.Add("@check_amount", check_amount);
      param.Add("@check_count", check_count);
      param.Add("@check_number", check_number);
      param.Add("@check_from", check_from);
      param.Add("@paying_for", paying_for);
      param.Add("@reason_for_change", reason_for_change);
      param.Add("@username", username);
      //param.Add("@added_after_save", payment_method_data_id == -1);

      var query = new StringBuilder();

      query.AppendLine(@"

        -- THIS WILL ONLY HAPPEN IF THIS IS AN EDIT BECAUSE @prior ID WILL BE -1 OTHERWISE
        IF @prior_payment_method_data_id > -1 
        BEGIN 

          UPDATE data_payment_method
          SET is_active = 0
          WHERE payment_method_data_id = @prior_payment_method_data_id;

        END

        INSERT INTO data_payment_method
        (
          prior_payment_method_data_id
          ,transaction_payment_type_id 
          ,transaction_id 
          ,cash_amount 
          ,check_amount 
          ,check_count 
          ,check_number 
          ,check_from 
          ,paying_for 
          ,is_active 
          ,added_after_save
        )
        VALUES
        (
          CASE WHEN @prior_payment_method_data_id = -1 THEN NULL ELSE @prior_payment_method_data_id END
          ,@transaction_payment_type_id 
          ,@transaction_id 
          ,@cash_amount 
          ,@check_amount 
          ,@check_count 
          ,@check_number 
          ,@check_from 
          ,@paying_for 
          ,1 -- newest one is always active
          -- NEW PAYMENT METHODS ARE ALWAYS ADDED AFTER SAVE, Edits are not 
          ,CASE WHEN @prior_payment_method_data_id = -1 THEN 1 ELSE 0 END 
        )
                
        SET @payment_method_data_id = SCOPE_IDENTITY();
        
        INSERT INTO data_changes_payment_method
        (
          original_payment_method_data_id
          ,new_payment_method_data_id
          ,modified_by
          ,reason_for_change
        )
        SELECT
          ISNULL(original_payment_method_data_id, @prior_payment_method_data_id)
          ,@payment_method_data_id
          ,@username
          ,@reason_for_change
        FROM data_payment_method D
        LEFT OUTER JOIN data_changes_payment_method C ON D.payment_method_data_id = C.new_payment_method_data_id
        WHERE D.payment_method_data_id=@prior_payment_method_data_id;
      ");

      query.AppendLine(TransactionData.GetUpdateTransactionTotals(true));

      var i = Constants.Exec_Query(query.ToString(), param, Constants.ConnectionString.ClayFinancial);

      return i > 0;

    }

    public void SetUserName(string un)
    {
      this.username = un;
    }

    public static List<PaymentMethodData> GetPaymentMethodHistory(long payment_method_data_id, long transaction_id)
    {
      var param = new DynamicParameters();
      param.Add("@payment_method_data_id", payment_method_data_id);
      param.Add("@transaction_id", transaction_id);
      var query = @"
      
        USE ClayFinancial;

        WITH DataChanges AS (

          SELECT
            R.original_payment_method_data_id
            ,R.new_payment_method_data_id
          FROM data_changes_payment_method B
          INNER JOIN data_changes_payment_method R ON B.original_payment_method_data_id = R.original_payment_method_data_id
          WHERE B.new_payment_method_data_id = @payment_method_data_id

        ), DataChangesFinal AS (

          SELECT TOP 1 
            original_payment_method_data_id payment_method_data_id
          FROM DataChanges
          UNION
          SELECT
            new_payment_method_data_id payment_method_data_id
          FROM DataChanges

        )

        SELECT
          DPM.payment_method_data_id
          ,DPM.prior_payment_method_data_id
          ,DPM.transaction_payment_type_id
          ,DPM.transaction_id
          ,DPM.cash_amount
          ,DPM.check_amount
          ,DPM.check_count
          ,DPM.check_number
          ,DPM.check_from
          ,DPM.paying_for
          ,DPM.is_active
          ,DPM.added_after_save
          ,DCPM.modified_by
          ,DCPM.modified_on
          ,DCPM.reason_for_change
        FROM data_payment_method DPM
        LEFT OUTER JOIN data_changes_payment_method DCPM ON DPM.payment_method_data_id = DCPM.new_payment_method_data_id
        LEFT OUTER JOIN DataChangesFinal DC ON DPM.payment_method_data_id = DC.payment_method_data_id 
        WHERE
          DPM.transaction_id = @transaction_id
          AND (DC.payment_method_data_id IS NOT NULL
          OR DPM.payment_method_data_id = @payment_method_data_id)
        ORDER BY DPM.payment_method_data_id DESC

      ";

      return Constants.Get_Data<PaymentMethodData>(query, param, Constants.ConnectionString.ClayFinancial);

    }
  }
}
 