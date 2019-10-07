using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class Control
  {
    public int? department_id { get; set; } 
    public int? department_sort_order { get; set; } 
    public int? payment_type_id { get; set; } 
    public int? payment_type_sort_order { get; set; } 
    public int control_id { get; set; }
    public string label { get; set; }
    public string value { get; set; }
    public string group_by { get; set; } = "";
    public string data_type { get; set; } = "";
    public bool is_active { get; set; } = true;
    public bool required { get; set; } = false;
    public int max_length { get; set; } = 500;
    public string validation_regex { get; set; } = "";
    public string render_hints { get; set; } = "";
    public bool is_printed { get; set; } = true;
    public Dictionary<int, Control> controls_dict { get; set; } = new Dictionary<int, Control>();


    public Control() { }

    public static List<Control> Get()
    {
      string sql = @"
        SELECT
          department_id
          ,department_sort_order
          ,payment_type_id
          ,payment_type_sort_order
          ,control_id
          ,label
          ,value
          ,group_by
          ,data_type
          ,is_active
          ,required
          ,max_length
          ,validation_regex
          ,render_hints
          ,is_printed
        FROM vw_controls
        WHERE 
          (department_id IS NOT NULL
          OR payment_type_id IS NOT NULL)
        ORDER BY 
          department_id ASC, 
          department_sort_order ASC, 
          payment_type_id ASC, 
          payment_type_sort_order ASC";
      return Constants.Get_Data<Control>(sql, Constants.ConnectionString.ClayFinancial);
    }

    public static List<Control> GetCached()
    {
      return (List<Control>)myCache.GetItem("controls");
    }

    public static Dictionary<int, Control> Get_Dict()
    {
      var controls = Control.GetCached();
      var d = new Dictionary<int, Control>();
      foreach(Control c in controls)
      {
        d[c.control_id] = c;
      }
      return d;
    }

    public static Dictionary<int, Control> GetCached_Dict()
    {
      return (Dictionary<int, Control>)myCache.GetItem("controls_dict");
    }

    public bool Validate(Data.ControlData cd)
    {
      // Here we use this class' properties to validate our controldata
      // you'll notice it doesn't matter if it's a department control
      // or a payment type control

      // if there is anything to validate that is not specific to it's data type,
      // do it before this step.
      if (!is_active)
      {
        cd.error_text = "This is no longer a valid control";
        return false;
      }

      if (cd.value.Length > max_length) 
      {
        cd.error_text = "Data is too long.";
        return false;
      }

      switch (this.data_type)
      {

        case "bigtext":
        case "text":
          return ValidateText(cd);

        case "money":
        case "number":
          return ValidateDecimal(cd);

        case "date":
          return ValidateDate(cd);

        case "count":
          return ValidateCount(cd);

        case "dropdown":
          return ValidateDropdown(cd);

        default:
          cd.error_text = "Unknown data type";
          return false;

      }

    }

    private bool ValidateDropdown(Data.ControlData cd)
    {
      var valid_values = value.Split('|');
      if (!valid_values.Contains(cd.value))
      {
        cd.error_text = "Invalid Value Selected";
        return false;
      }
      return true;
    }

    private bool ValidateDecimal(Data.ControlData cd)
    {
      if (decimal.TryParse(cd.value, out _))
      {
        return false;
      }
      return true;
    }

    private bool ValidateText(Data.ControlData cd)
    {

      return true;

    }

    private bool ValidateCount(Data.ControlData cd)
    {

      if (!int.TryParse(cd.value, out int result))
      {
        cd.error_text = "Invalid value for " + label;
        return false;
      }
      decimal.TryParse(cd.value, out decimal test);

      return test - result == 0;
      
    }

    private bool ValidateDate(Data.ControlData cd)
    {
      if (!DateTime.TryParse(cd.value, out DateTime datevalue))
      {
        cd.error_text = "Invalid Date";
        return false;
      }
      return true;
    }

    public bool ValidateUpdatedControl(Data.ControlData cd)
    {
      return Validate(cd);
    }
    public static Dictionary<int, Control> GetCachedDict()
    {
      return (Dictionary<int, Control>)myCache.GetItem("controls_dict");
    }
  }
}