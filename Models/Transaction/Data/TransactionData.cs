using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction.Data
{
  public class TransactionData // temp name till I figure out more stuff
  {
    /*  
     *  
     * 
     * Transaction has
     *  - id
     *  - parent_transaction_id -- note: this is only true if one exists, other wise will be -1;
     *  - department
     *    + name
     *    + is_active
     *    +department_control_data
     *      - control_id
     *      - value
     *      - is_active
     *    + payment_type[]
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
     * 
     * 
     * The above heirarchy does not show all data in the tables. This is solely the data necessary to save.
     * All tables storing transaction data will also have the transaction_id saved.
     *  
     *  
     * */
    public long transaction_id { get; set; }
    public int fiscal_year { get; set; }
    public int employee_transaction_count { get; set; }
    public string transaction_number { get; set; }
    public int created_by_employee_id { get; set; }
    public int created_by_employee_ip_address { get; set; }
    public DateTime created_on { get; set; }
    public long parent_transaction_id { get; set; } = -1;
    public int department_id { get; set; }
    public List<ControlData> department_controls { get; set; }
    public List<PaymentTypeData> payment_types { get; set; }



    public TransactionData()
    {
      
    }


    public bool validate()
    {
      
      return false;
    }

    public List<TransactionData> Get()
    {

      return new List<TransactionData>();
    }

    public TransactionData Save()
    {

      return new TransactionData();
    }

  }
}