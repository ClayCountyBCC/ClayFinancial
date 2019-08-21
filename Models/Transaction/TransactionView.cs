using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClayFinancial.Models.Transaction.Data;
namespace ClayFinancial.Models.Transaction
{
  public class TransactionView
  {

    private long transaction_id { get; set; }
    public string transaction_number { get; set; }
    public DateTime created_on { get; set; }
    public string created_by_username { get; set; }
    public long department_id { get; set; }
    public string department_name { get; set; }
    private string transaction_type { get; set; }
    public decimal cash_total { get; set; }
    public decimal checks_total { get; set; }
    public int number_of_checks { get; set; }
    public bool has_been_modified { get; set; }
    
    public TransactionView() { }  

    public static List<TransactionView> GetListOfTransactionView()
    {
      

      return new List<TransactionView>();
    }


  }
}