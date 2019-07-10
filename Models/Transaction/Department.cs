using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class Department
  {
    public int id { get; set; }
    public string name { get; set; }
    public string organisation { get; set; }

    public Department() { }

    public static List<Department> Get()
    {
      string sql = @"
        SELECT
          id
          ,name
          ,ISNULL(organisation, '') organisation
        FROM departments
        WHERE is_active = 1
        ORDER BY name ASC";
      return Constants.Get_Data<Department>(sql, Constants.ConnectionString.ClayFinancial);
    }
  }
}