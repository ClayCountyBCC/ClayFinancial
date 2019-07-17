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
    public bool is_active { get; set; }
    public string organization { get; set; }
    public List<PaymentType> payment_types { get; set; } = new List<PaymentType>();
    public List<Control> controls { get; set; } = new List<Control>();

    public Department() { }

    public static List<Department> Get()
    {
      var payment_types = (from pt in PaymentType.GetCached()
                           where pt.is_active
                           select pt).ToList();


      var controls = (from c in Control.GetCached()
                      where c.is_active &&
                      c.department_id.HasValue
                      select c).ToList();


      string sql = @"
        SELECT
          id
          ,name
          ,ISNULL(organization, '') organization
          ,is_active
        FROM departments        
        ORDER BY name ASC";
      var departments = Constants.Get_Data<Department>(sql, Constants.ConnectionString.ClayFinancial);


      foreach(Department d in departments)
      {
        d.controls.AddRange((from c in controls
                             where c.department_id == d.id
                             select c).ToList());

        d.payment_types.AddRange((from pt in payment_types
                                  where pt.department_id == d.id
                                  select pt).ToList());
      }


      return departments;
    }

    public static List<Department> GetCached()
    {
      return (List<Department>)myCache.GetItem("departments");
    }

  }
}