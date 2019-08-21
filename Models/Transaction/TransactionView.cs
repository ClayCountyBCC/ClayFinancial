using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class TransactionView
  {
    public int fiscal_year { get; set; }
    public int created_by_employee_id { get; set; }
    public int employee_transaction_count { get; set; }
    public string transaction_number { get; set; }
    public long transaction_id { get; set; }
    public long? parent_transaction_id { get; set; }
    public DateTime created_on { get; set; }
    public string created_by_username { get; set; }
    public string created_by_ip_address { get; set; }
    public int department_id { get; set; }
    public string department { get; set; }


    public TransactionView() { }
    public TransactionView(long id) 
    {
      transaction_id = id;

      /*
       *
       *  TODO: use this spot to fill the parts of the view to return it. 
       *  
       */


    }


   


  }
}