
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

      foreach (Department d in departments)
      {
        var tmpControls = from c in controls
                          where c.department_id == d.department_id
                          select c;

        foreach (Control c in tmpControls)
        {
          d.controls_dict[c.control_id] = c;
          d.controls.Add(c);
        }

        var tmpPaymentTypes = from pt in payment_types
                              where pt.department_id == d.department_id
                              select pt;

        foreach (PaymentType pt in tmpPaymentTypes)
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
      foreach (Department dept in departments)
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


    public Data.TransactionData ValidateTransactionData(Data.TransactionData transactionData)
    {
      // We treat the Data.TransactionData class as a department class because it has all of the
      // departmental data we'll need to validate

      // first we'll see if this department is active or not. If it's not, we shouldn't be allowing 
      // data to be saved

      if (!is_active)
      {
        transactionData.error_text = "Department is no longer active.";
        return transactionData;
      }

      // let's make sure the department controls are valid
      if (!ValidateDepartmentControls(transactionData)) return transactionData;

      // if (!ValidatePaymentTypes(transactionData)) return transactionData;


      return transactionData;
    }

    private bool ValidateDepartmentControls(Data.TransactionData transactionData)
    {
      // things to validate here:
      // department controls are all required.
      // every control in controls_dict for this class needs to be present
      // every control in controls must have a valid value.
      var controlids = (from c in transactionData.department_control_data
                        select c.control_id).ToList();

      var distinctControlIds = controlids.Distinct();
      // Todo make  sure error text is set in the object being passed to this function 
      if(controlids.Count() != distinctControlIds.Count())
      {
        transactionData.error_text = "Invalid department information found.";
        return false;
      }


      // let's make sure every department control is present in department_controls
      foreach (int key in controls_dict.Keys)
      {
        if (!distinctControlIds.Contains((short)key))
        {
          transactionData.error_text = "Missing department information: " + controls_dict[key].label;
          return false;
        }
      }


      // now we validate each department control
      foreach (Data.ControlData cd in transactionData.department_control_data)
      {
        // if one of our department controls isn't found in our controls_dict object,
        // it means that the client has an extra control
        if (!controls_dict.ContainsKey(cd.control_id))
        {
          transactionData.error_text = "Invalid Department information found.";
          return false;
        }

        var control = controls_dict[cd.control_id];

        if (!control.ValidateControlData(cd))
        {
          transactionData.error_text = "There was a problem with some of the data entered.";
          return false;
        }

      }
      return true;
    }


    

  }
}