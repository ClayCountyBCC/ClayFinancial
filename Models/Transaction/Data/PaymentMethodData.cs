using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction.Data
{
  public class PaymentMethodData
  {

    /*
     * 
     * 
     *  - payment_methods[]
     *    + cash_amount
     *    + check_amount
     *    + check_number
     *    + check_from
     *    + paying_for
     *    + is_active
     *
     */
    public long payment_method_data_id { get; set; }
    public long prior_payment_method_data_id { get; set; }
    public long transaction_id { get; set; }
    public decimal cash_amount { get; set; }
    public decimal check_amount { get; set; }
    public string check_number { get; set; }
    public string paying_for { get; set; }
    public string check_from { get; set; }
    public bool is_active { get; set; }

    public PaymentMethodData()
    {

    }

    public PaymentMethodData Get()
    {

      return new PaymentMethodData();
    }

    public PaymentMethodData Save()
    {

      return new PaymentMethodData();
    }
  }
}
 