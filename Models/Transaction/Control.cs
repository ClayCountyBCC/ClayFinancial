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
    public int id { get; set; }
    public string label { get; set; }
    public string value { get; set; }    
    public string data_type { get; set; }
    public bool is_active { get; set; }
    public bool required { get; set; }
    public int max_length { get; set; }
    public string validation_regex { get; set; }

    public Control() { }

    public static List<Control> Get()
    {
      string sql = @"
        SELECT
          department_id
          ,department_sort_order
          ,payment_type_id
          ,payment_type_sort_order
          ,control_id id
          ,label
          ,value
          ,group_by
          ,data_type
          ,is_active
          ,required
          ,max_length
          ,validation_regex
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
      var list = Control.GetCached();
      var d = new Dictionary<int, Control>();
      foreach (Control l in list)
      {
        d[l.id] = l;
      }
      return d;
    }
    public static Dictionary<int, Control> GetCachedDict()
    {
      return (Dictionary<int, Control>)myCache.GetItem("control_dict");
    }

    public string Validate()
    {

      return "";
    }
  }
}