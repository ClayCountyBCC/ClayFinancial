﻿using System;
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

    public long control_data_id { get; set; }
    public long prior_control_data_id { get; set; }
    public long transaction_payment_type_id { get; set; }
    public int department_id { get; set; }
    public long transaction_id { get; set; }
    public int control_id { get; set; }
    public string value { get; set; } = "";
    public bool is_active { get; set; } = true;
    public DateTime modified_on { get; set; } = DateTime.MinValue;
    public string modified_by { get; set; } = "";
    public string reason_for_change { get; set; } = "";
    public string error_text { get; set; } = "";
    public ControlData()
    {
      
    }

    public ControlData Get()
    {

      return new ControlData();
    }

    //public ControlData Validate(List<ControlData> control_data_list)
    //{
    //  List<int> bad_index = new List<int>();

    //  foreach (var c in control_data_list)
    //  {
    //    if(c.department_id > 0 && control_dictionary.ContainsKey(c.control_id))
    //    { 
          
    //    }

    //    if (c.value.Length > control_dictionary[c.control_id].max_length)
    //    {
    //      c.error_text = $@"{control_dictionary[c.control_id].label} value exeeds max length of {control_dictionary[c.control_id].max_length}";
    //      return this;
    //    }

    //    switch (control_dictionary[c.control_id].data_type)
    //    {
    //      case "text":
    //      case "bigtext":
    //        break;
    //      case "date":
    //        if (!DateTime.TryParse(c.value, out DateTime dateTime)) 
    //        {
    //          c.error_text = $@"Entered value ""{c.value}"" is not a valid {control_dictionary[c.control_id].label}";
    //        }
    //        break;
    //      case "dropdown":
            
    //        break;

    //    }

    //  }
    //  return this;
    //}


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

      dt.Columns.Add(new DataColumn("department_id", typeof(short))); // all records will have the same department_id; this should be validated
      dt.Columns.Add(new DataColumn("control_id", typeof(short)));
      dt.Columns.Add(new DataColumn("value", typeof(string)));
      dt.Columns.Add(new DataColumn("payment_type_id", typeof(long))); // only used if being populated as payment type control
      dt.Columns.Add(new DataColumn("payment_type_index", typeof(short))); // only used if being populated as payment type control

      return dt;

    }

    //public TransactionData ValidateTransactionData(TransactionData transactionData)
    //{
    //  // We treat the Data.TransactionData class as a department class because it has all of the
    //  // departmental data we'll need to validate

    //  // first we'll see if this department is active or not. If it's not, we shouldn't be allowing 
    //  // data to be saved

    //  if (!is_active)
    //  {
    //    transactionData.error_text = "Department is no longer active.";
    //    return transactionData;
    //  }

    //  // let's make sure the department controls are valid
    //  if (!ValidateDepartmentControls(transactionData)) return transactionData;




    //  return transactionData;
    //}

    //private bool ValidateDepartmentControls(Data.TransactionData transactionData)
    //{
    //  // things to validate here:
    //  // department controls are all required.
    //  // every control in controls_dict for this class needs to be present
    //  // every control in controls must have a valid value.
    //  var controlids = (from c in transactionData.department_control_data
    //                    select c.control_id).ToList();

    //  // let's make sure every department control is present in department_controls
    //  //foreach (int key in controls_dict.Keys)
    //  //{
    //  //  if (!controlids.Contains((short)key))
    //  //  {

    //  //    transactionData.error_text = "Missing department information: " + controls_dict[key].label;
    //  //    return false;
    //  //  }
    //  //}

    //  // now we validate each department control
    //  //foreach (Data.ControlData cd in transactionData.department_controls)
    //  //{
    //  //  // if one of our department controls isn't found in our controls_dict object,
    //  //  // it means that the client has an extra control
    //  //  if (!controls_dict.ContainsKey(cd.control_id))
    //  //  {
    //  //    transactionData.error_text = "Invalid Department information found.";
    //  //    return false;
    //  //  }

    //  //  var control = controls_dict[cd.control_id];

    //  //  if (!control.ValidateControlData(cd))
    //  //  {
    //  //    transactionData.error_text = "There was a problem with some of the data entered.";
    //  //    return false;
    //  //  }

    //  //}
    //  return true;
    //}
  }
}