using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Dapper;


namespace ClayFinancial.Models.Transaction.Data
{
  public class ControlData
  {
    // Read only class. this is control data coming from the client.
    // control_id, department_id or payment_type_id
    public int control_id { get; set; }
    public int department_id { get; set; }
    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public string value { get; set; } = "";
    public bool is_active { get; set; } = true;
    public DateTime created_on { get; set; } = DateTime.Now;
    public string created_by { get; set; } = "";
    public DateTime? modified_on { get; set; }
    public string modified_by { get; set; } = "";

    public ControlData()
    {
      
    }

    public ControlData Get()
    {

      return new ControlData();
    }

    public string Validate()
    {

      return "";
    }


    // IF ALL OF THE SAVING IS HAPPENING INSIDE OF ONE TRANSACTION, THEN THIS WILL NEED TO BE A GetDataTable() FUNCTION
    // THAT WILL POPULATE THE DATATABLE AND RETURN THAT. NOT SAVE(); THIS IS TRUE FOR THE OTHER TWO FUNCTIONS:
    // PaymentTypeData.Save() AND PaymentMethodData.Save().
    public static DataTable GetControlDataTable()
    {

      var dt = CreateControlDataTable();

      return dt;
    }

    private static DataTable CreateControlDataTable()
    {

      var dt = new DataTable("ControlData");


      dt.Columns.Add(new DataColumn("control_data_id", typeof(long)));
      dt.Columns.Add(new DataColumn("department_id", typeof(short))); // all records will have the same department_id; this should be validated
      dt.Columns.Add(new DataColumn("control_id", typeof(short)));
      dt.Columns.Add(new DataColumn("value", typeof(string)));
      dt.Columns.Add(new DataColumn("is_active", typeof(bool)));
      dt.Columns.Add(new DataColumn("created_on", typeof(DateTime)));
      dt.Columns.Add(new DataColumn("created_by", typeof(string)));
      dt.Columns.Add(new DataColumn("modified_on", typeof(DateTime)));
      dt.Columns.Add(new DataColumn("modified_by", typeof(string)));
      dt.Columns.Add(new DataColumn("payment_type_id", typeof(long))); // only used if being populated as payment type control
      dt.Columns.Add(new DataColumn("payment_type_index", typeof(short))); // only used if being populated as payment type control



      return dt;

    }
  }
}