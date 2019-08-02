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

  }
}