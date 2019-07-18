using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class TransactionSave // temp name till I figure out more stuff
  {
    /*  
     *  
     * 
     * Transaction has
     *  - id
     *  - parent_transaction_id -- note: this is only true if one exists, other wise will be "";
     *  - department
     *    + name
     *    + organization
     *    + is_active
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
     * 
     * 
     * The above heirarchy does not show all data in the tables. This is solely the data necessary to save.
     * All tables storing transaction data will also have the transaction_id saved.
     *  
     *  
     * */


    public string transaction_id { get; set; } = "";
    public string parent_transaction_id { get; set; } = "";
    public DepartmentData department { get; set; }



    public TransactionSave()
    {
      
    }


    public bool validate()
    {

      return false;
    }


    public TransactionSave Save()
    {

      return new TransactionSave();
    }

  }
}