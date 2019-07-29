using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class Department
  {
    public int department_id { get; set; }
    public string name { get; set; }
    public bool is_active { get; set; }
    public string organization { get; set; }
    public List<PaymentType> payment_types { get; set; } = new List<PaymentType>();
    public List<Control> controls { get; set; } = new List<Control>();
    public Dictionary<int, PaymentType> payment_types_dict { get; set; } = new Dictionary<int, PaymentType>();
    public Dictionary<int, Control> controls_dict { get; set; } = new Dictionary<int, Control>();

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
          department_id
          ,name
          ,ISNULL(organization, '') organization
          ,is_active
        FROM departments        
        ORDER BY name ASC";
      var departments = Constants.Get_Data<Department>(sql, Constants.ConnectionString.ClayFinancial);


      foreach(Department d in departments)
      {

        var tmpControls = from c in controls
                          where c.department_id == d.department_id
                          select c;
        
        foreach(Control c in tmpControls)
        {
          d.controls_dict[c.control_id] = c;
          d.controls.Add(c);
        }

        var tmpPaymentTypes = from pt in payment_types
                              where pt.department_id == d.department_id
                              select pt;

        
        foreach(PaymentType pt in tmpPaymentTypes)
        {
          d.payment_types_dict[pt.payment_type_id] = pt;
          d.payment_types.Add(pt);
        }

      }


      return departments;
    }

    public static Dictionary<int, Department> Get_Dict()
    {
      var departments = Department.GetCached();
      var d = new Dictionary<int, Department>();
      foreach(Department dept in departments)
      {
        d[dept.department_id] = dept;
      }
      return d;
    }

    public static List<Department> GetCached()
    {
      return (List<Department>)myCache.GetItem("departments");
    }

    public static Dictionary<int, Department> GetCachedDict()
    {
      return (Dictionary<int, Department>)myCache.GetItem("departments_dict");
    }

  }
}