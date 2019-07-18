using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.TransactionSave
{
  public class PaymentTypeData
  {

    /*
     * 
     * 
     * 
     *      + payment_type
     *        - tax_exempt
     *        - payment_type_controls[]
     *           + transaction_payment_type_id
     *           + control_id
     *           + value
     *           + is_active
     *        - payment_methods[]
     *          + cash_amount
     *          + check_amount
     *          + check_number
     *          + check_from
     *          + paying_for
     *          + is_active
     * */

    public string transaction_id { get; set; }
    public bool tax_exempt { get; set; }
    public List<ControlData> controls { get; set; }
    public List<PaymentMethodData> payment_methods { get; set; }



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