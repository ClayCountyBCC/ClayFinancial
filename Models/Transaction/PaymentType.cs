using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClayFinancial.Models.Transaction.Data;

namespace ClayFinancial.Models.Transaction
{
  public class PaymentType
  {
    public int department_id { get; set; }
    public int payment_type_id { get; set; }
    public string name { get; set; }
    public bool is_active { get; set; }
    public List<Control> controls { get; set; } = new List<Control>();
    //public List<PaymentMethodData> payment_methods { get; set; }
    public Dictionary<int, Control> controls_dict { get; set; } = new Dictionary<int, Control>();
    public string added_by { get; set; } = "";
    public DateTime added_on { get; set; } = DateTime.MinValue;
    public PaymentType() { }

    public static List<PaymentType> Get()
    {
      var controls = (from c in Control.GetCached()
                      where c.is_active &&
                      c.payment_type_id.HasValue
                      select c).ToList();

      string sql = @"
        SELECT
          department_id
          ,payment_type_id
          ,name
          ,is_active
        FROM vw_payment_types
        ORDER BY department_id ASC, name ASC";
      var payment_types = Constants.Get_Data<PaymentType>(sql, Constants.ConnectionString.ClayFinancial);


      foreach (PaymentType pt in payment_types)
      {
        var tmpControls = from c in controls
                          where c.payment_type_id == pt.payment_type_id
                          select c;
        foreach (Control c in tmpControls)
        {
          pt.controls.Add(c);
          pt.controls_dict[c.control_id] = c;
        }
      }


      return payment_types;
    }

    public static List<PaymentType> GetCached()
    {
      return (List<PaymentType>)myCache.GetItem("payment_types");
    }

    public bool ValidatePaymentType(Data.PaymentTypeData ptd)
    {
      // in order to have a valid payment type, all of the required controls
      // must have a value and all of the payment methods must be valid.
      foreach (Data.ControlData cd in ptd.control_data)
      {
        if (!controls_dict[cd.control_id].Validate(cd))
        {
          return false;
        }
      }

      // this object has been deemed unnecessary
      //var PaymentMethod = new PaymentMethod();


      foreach (Data.PaymentMethodData pmd in ptd.payment_method_data)
      {
        if (!pmd.ValidateNew())
        {
          return false;
        }
      }
      return true;
    }


    public bool ValidateChangePaymentType(PaymentTypeData ptd)
    {
      // add new, additional checks here if we determine they need to be.


      return true;

    }

  }
}