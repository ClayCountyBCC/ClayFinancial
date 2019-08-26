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

      foreach (var type in pt)
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


      var query = @"
          USE ClayFinancial;
    
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
    

              -- INSERT data_payment_method
              -- INNER JOIN TO data_payment_type TO GET transaction_payment_type_id
              INSERT INTO data_payment_method 
              (
                transaction_payment_type_id,
                transaction_id, 
                cash_amount, 
                check_amount, 
                check_number, 
                check_from, 
                paying_for
              )
              SELECT
                PTD.transaction_payment_type_id, 
                @transaction_id,
                cash_amount,
                check_amount, 
                check_number, 
                check_from, 
                paying_for
              FROM @PaymentMethodData PMD
              INNER JOIN data_payment_type PTD ON 
                PTD.transaction_id = @transaction_id AND 
                PTD.payment_type_id = PMD.payment_type_id AND 
                PTD.payment_type_index = PMD.payment_type_index;


              -- INSERT CONTROL DATA
              -- OUTER JOIN TO payment_type_data TO GET transaction_payment_type_id FOR payment_type_controls
              -- department_id WILL BE NULL FOR PAYMENT TYPE CONTROLS. THE VALUE IS NOT SET IN THE APPLICATION.
              -- THE department_id WILL NOT BE NULL FOR DEPARTMENT CONTROLS. THE VALUE IS SET IN THE APPLICATION.
              --    THE transaction_payment_type_id WILL BE NULL FOR DEPARTMENT CONTROLS.
              INSERT INTO data_control
              (
                transaction_payment_type_id,
                department_id,
                transaction_id,
                control_id,
                value
              )
              SELECT
                CASE WHEN PTD.transaction_payment_type_id = -1 THEN NULL ELSE PTD.transaction_payment_type_id END,
                CASE WHEN CD.department_id = -1 THEN NULL ELSE CD.department_id END,
                @transaction_id,
                CD.control_id,
                CD.value
              FROM @ControlData CD
              LEFT OUTER JOIN data_payment_type PTD ON 
                PTD.transaction_id = @transaction_id AND 
                PTD.payment_type_id = CD.payment_type_id AND 
                PTD.payment_type_index = CD.payment_type_index;


        ";



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

        return Constants.Exec_Query(query, param, Constants.ConnectionString.ClayFinancial) > -1;

      }
      catch (Exception ex)
      {

        new ErrorLog(ex, query);
        return false;

      }

    }
  }// get the next transaction id
}