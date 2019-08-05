using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class PaymentType
  {
    public int department_id { get; set; }
    public int payment_type_id { get; set; }
    public string name { get; set; }
    public bool is_active { get; set; }
    public bool does_tax_exempt_apply { get; set; }
    public List<Control> controls { get; set; } = new List<Control>();
    public List<PaymentMethod> payment_methods {get;set;} 
    public Dictionary<int, Control> controls_dict { get; set; } = new Dictionary<int, Control>();

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
          ,payment_type_id id
          ,name
          ,does_tax_exempt_apply
          ,is_active
        FROM vw_payment_types
        ORDER BY department_id ASC, name ASC";
      var payment_types = Constants.Get_Data<PaymentType>(sql, Constants.ConnectionString.ClayFinancial);


      foreach(PaymentType pt in payment_types)
      {
        var tmpControls = from c in controls
                          where c.payment_type_id == pt.id
                          select c;
        foreach(Control c in tmpControls)
        {
          pt.controls.Add(c);
          pt.controls_dict[c.id] = c;
        }
      }


      return payment_types;
    }

    public static List<PaymentType> GetCached()
    {
      return (List<PaymentType>)myCache.GetItem("payment_types");
    }

    public static Dictionary<int, PaymentType> Get_Dict()
    {
      var paymentTypes = PaymentType.GetCached();
      var d = new Dictionary<int, PaymentType>();
      foreach (PaymentType pt in paymentTypes)
      {
        d[pt.id] = pt;
      }
      return d;
    }
    public static Dictionary<int, PaymentType> GetCachedDict()
    {
      return (Dictionary<int, PaymentType>)myCache.GetItem("payment_type_dict");
    }


  }
}