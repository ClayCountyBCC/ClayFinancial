using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class DepartmentData
  {

  /*
   * 
   *    +department_control_data
   *      - control_id
   *      - value
   *      - is_active
   *    + payment_type
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
   */
   

   public int department_id { get; set; }
   public List<ControlData> controls { get; set; }
   public List<PaymentType> payment_types { get; set; }

  }
}
 