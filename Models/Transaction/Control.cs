using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class Control
  {
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
          id
          ,label
          ,value
          ,group_by
          ,data_type
          ,is_active
          ,required
          ,max_length
          ,ISNULL(validation_regex, '') validation_regex
        FROM departments
        WHERE is_active = 1
        ORDER BY name ASC";
      return Constants.Get_Data<Control>(sql, Constants.ConnectionString.ClayFinancial);
    }
  }
}