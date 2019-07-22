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

   public string transaction_id { get; set; }
   public decimal cash_amount { get; set; }
    public decimal check_amount { get; set; }
    public int check_number { get; set; }
    public string paying_for { get; set; }
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
 