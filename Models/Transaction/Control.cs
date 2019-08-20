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

    public bool Validate(Data.ControlData cd)
    {
      // Here we use this class' properties to validate our controldata
      // you'll notice it doesn't matter if it's a department control
      // or a payment type control

      // if there is anything to validate that is not specific to it's data type,
      // do it before this step.

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
          return ValidateMoney(cd);

        case "date":
          return ValidateDate(cd);

        case "number":
          return ValidateNumber(cd);

        case "dropdown":
          return ValidateDropdown(cd);

        default:
          // we don't know what data type this was.
          return false;

      }

    }

    private bool ValidateDropdown(Data.ControlData cd)
    {
      var valid_values = value.Split('|');
      if (!valid_values.Contains(value))
      {
        cd.error_text = "Invalid Value Selected";
        return false;
      }
      return true;
    }

    private bool ValidateMoney(Data.ControlData cd)
    {
      decimal result;

      return Decimal.TryParse(cd.value.Trim(), out result);
    }

    private bool ValidateNumber(Data.ControlData cd)
    {
      int result;
      if (is_active == false) return false;

      return (int.TryParse(cd.value, out result) && 
              (decimal.Parse(cd.value) - result == 0) &&
              cd.value.Length <= max_length);

    }

    private bool ValidateText(Data.ControlData cd)
    {
      
      return false;
    }

    private bool ValidateDate(Data.ControlData cd)
    {
      DateTime datevalue;
      if(!DateTime.TryParse(cd.value, out datevalue))
      {
        cd.error_text = "Invalid Date";
        return false;
      }
      return true;
    }

  }
}