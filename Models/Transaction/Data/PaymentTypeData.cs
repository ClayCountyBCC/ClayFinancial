using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction.Data
{
  public class PaymentTypeData
  {

    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public int payment_type_id { get; set; }
    public int payment_type_index { get; set; }
    public bool tax_exempt { get; set; }
    public List<ControlData> control_data { get; set; }    
    public List<PaymentMethodData> payment_method_data { get; set; }
    public string error_text { get; set; } = "";
    public bool added_after_save { get; set; } = false;

    public PaymentTypeData Get()
    {
      return new PaymentTypeData();
    }

    public bool Validate()
    {

      return true;

    }

    public PaymentTypeData Save()
    {
      return new PaymentTypeData();
    }
  }
}