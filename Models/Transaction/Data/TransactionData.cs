using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction.Data
{
  public class TransactionData // temp name till I figure out more stuff
  {
    /*  
     * Removed big comment as it was outdated.  The ERD in the database will suffice for this. 
     *  
     * */

    public long transaction_id { get; set; }
    public int fiscal_year { get; set; }
    public int created_by_employee_id { get; set; }
    public int employee_transaction_count { get; set; }
    public string transaction_number { get; set; }    
    public long parent_transaction_id { get; set; }
    public int department_id { get; set; }
    public List<ControlData> department_control_data { get; set; }
    public List<PaymentTypeData> payment_type_data { get; set; }
    public string error_text { get; set; } = "";
    public string received_from { get; set; } = "";
    public DateTime created_on { get; set; } = DateTime.MinValue;
    public string created_by_username { get; set; } = "";
    public string created_by_ip_address { get; set; } = "";

    public TransactionData()
    {
    }

    public bool validate()
    {
      return false;
    }

    public TransactionData Save()
    {

      return new TransactionData();
    }

  }
}