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
  public class ControlData
  {

    public long control_data_id { get; set; } = -1;
    public long prior_control_data_id { get; set; } = -1;
    public long? transaction_payment_type_id { get; set; }
    public int? department_id { get; set; }
    public long transaction_id { get; set; } = -1;
    public Control control { get; set; } = null; // the control for this ControlData
    public int control_id { get; set; } = -1;
    public string value { get; set; } = "";
    public bool is_active { get; set; } = true;
    public DateTime modified_on { get; set; } = DateTime.MinValue;
    public string modified_by { get; set; } = "";
    public string reason_for_change { get; set; } = "";
    public string error_text { get; set; } = "";
    private string username { get; set; } = "";
    public ControlData()
    {
      
    }

    public void SetUsername(string un)
    {
      username = un;
    }

    public static List<ControlData> GetActiveTransactionControls(long transaction_id)
    {
      var controls = Control.GetCached_Dict();

      var param = new DynamicParameters();
      param.Add("@transaction_id", transaction_id);

      var query = @"
        WITH ControlData AS (

          SELECT 
            control_data_id
            ,LCPT.sort_order
            ,DC.transaction_payment_type_id
            ,department_id
            ,DC.transaction_id
            ,DC.control_id
            ,value
            ,is_active
          FROM data_control DC
          INNER JOIN data_payment_type DPT ON DC.transaction_payment_type_id = DPT.transaction_payment_type_id
          INNER JOIN lookup_control_payment_type LCPT ON DPT.payment_type_id = LCPT.payment_type_id 
            AND DC.control_id = LCPT.control_id
          WHERE
            DC.transaction_id = @transaction_id
            AND is_active = 1

          UNION

          SELECT 
            control_data_id
            ,LCD.sort_order
            ,DC.transaction_payment_type_id
            ,DC.department_id
            ,DC.transaction_id
            ,DC.control_id
            ,value
            ,is_active
          FROM data_control DC
          INNER JOIN lookup_control_department LCD ON DC.control_id = LCD.control_id
            AND DC.department_id = LCD.department_id
          WHERE
            DC.transaction_id = @transaction_id
            AND is_active = 1
        )

        SELECT
          control_data_id
          ,transaction_payment_type_id
          ,department_id
          ,transaction_id
          ,control_id
          ,value
          ,is_active     
        FROM ControlData        
        ORDER BY transaction_payment_type_id, department_id, sort_order, control_id;
";


      var c_data = Constants.Get_Data<ControlData>(query, param, Constants.ConnectionString.ClayFinancial);
      foreach(ControlData cd in c_data)
      {
        if (controls.ContainsKey(cd.control_id))
        {
          cd.control = controls[cd.control_id];
        }
        else
        {
          new ErrorLog("Missing Control ID - " + cd.control_id, "GetActiveTransactionControls", "", "", "");
        }
      }
      return c_data;


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

    public static string GetSaveControlDataQuery()
  {
      return @"
      
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
  }

    public bool ValidateControlData(UserAccess ua)
    {

      var controls = Control.GetCachedDict();

      return controls[control_id].Validate(this, false);
    }

    public bool UpdateControlData()
    {

      var query = @"
        UPDATE data_transaction
        SET has_been_modified = 1
        WHERE transaction_id = @transaction_id;

        DECLARE @new_control_data_id BIGINT = -1;

        INSERT INTO data_control
        (
          transaction_payment_type_id
          ,prior_control_data_id
          ,department_id
          ,transaction_id
          ,control_id
          ,value
          ,is_active
        )
        VALUES
        (
          @transaction_payment_type_id 
          ,@prior_control_data_id
          ,@department_id
          ,@transaction_id
          ,@control_id
          ,@value
          ,1
        )
 
        SET @new_control_data_id = SCOPE_IDENTITY();

        UPDATE data_control
        SET is_active = 0
        WHERE control_data_id = @prior_control_data_id;
        
        BEGIN
          INSERT INTO data_changes_control
          (
              original_control_data_id
              ,new_control_data_id
              ,modified_by
              ,modified_on
              ,reason_for_change
          )

          VALUES
          (
            @prior_control_data_id
            ,@new_control_data_id
            ,@username
            ,GETDATE()
            ,@reason_for_change
          )
        END

      ";
      var i = Constants.Exec_Query(query, GetControlDataParameters(), Constants.ConnectionString.ClayFinancial);
      return i > -1;
      //return Constants.Exec_Scalar<ControlData>(query, Constants.ConnectionString.ClayFinancial, GetControlDataParameters()) != null;
    }

    public static List<ControlData> GetAllActiveControlDataForTransactions(List<long> transaction_ids, UserAccess ua)
    {
      var param = new DynamicParameters();

      param.Add("@transaction_ids", transaction_ids);

      var query = @"

        SELECT
          *
        FROM data_controls
        WHERE transaction_id IN @transaction_ids
          AND is_active = 1

      ";

      return Constants.Get_Data<ControlData>(query, param, Constants.ConnectionString.ClayFinancial);
    }



    private DynamicParameters GetControlDataParameters()
    {
      var param = new DynamicParameters();

      param.Add("@transaction_id", transaction_id);
      param.Add("@prior_control_data_id", control_data_id); // This should always be this.
      param.Add("@transaction_payment_type_id", transaction_payment_type_id);
      param.Add("@department_id", department_id);
      param.Add("@control_id", control_id);
      param.Add("@value", value);
      param.Add("@username", username);
      param.Add("@reason_for_change",reason_for_change);


      return param;
    }

    public static List<ControlData> GetControlDataHistory(long control_data_id, long transaction_id)
    {
      // this should work for both Department and Payment Type Controls
      var controls = Control.GetCached_Dict();
      var param = new DynamicParameters();
      param.Add("@control_data_id", control_data_id);
      param.Add("@transaction_id", transaction_id);

      var query = @"

        WITH QueryData AS (
          
          SELECT
            ISNULL(transaction_payment_type_id, 0) transaction_payment_type_id
            ,ISNULL(department_id, 0) department_id
            ,control_id
            ,transaction_id
          FROM data_control
          WHERE
            transaction_id = @transaction_id
            AND control_data_id = @control_data_id

        )

        SELECT 
          DC.control_data_id
          ,DC.prior_control_data_id
          ,DC.transaction_payment_type_id
          ,DC.department_id
          ,DC.transaction_id
          ,DC.control_id
          ,DC.value
          ,DC.is_active
          ,DCC.modified_on
          ,DCC.modified_by
          ,DCC.reason_for_change
        FROM data_control DC
        INNER JOIN QueryData Q ON DC.control_id = Q.control_id
          AND DC.transaction_id = Q.transaction_id
          AND ISNULL(DC.transaction_payment_type_id, 0) = Q.transaction_payment_type_id
          AND ISNULL(DC.department_id, 0) = Q.department_id
        LEFT OUTER JOIN data_changes_control DCC ON DCC.new_control_data_id = DC.control_data_id
        ORDER BY control_data_id DESC


      ";
      var control_data = Constants.Get_Data<ControlData>(query, param, Constants.ConnectionString.ClayFinancial);
      foreach(ControlData cd in control_data)
      {
        if (controls.ContainsKey(cd.control_id))
        {
          cd.control = controls[cd.control_id];
        }
        else
        {
          new ErrorLog("Missing Control ID - " + cd.control_id, "GetControlDataHistory", "", "", "");
        }
      }
      return control_data;
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