using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClayFinancial.Models.Transaction.Data;
using Dapper;
using System.Text;

namespace ClayFinancial.Models.Transaction
{
  public class TransactionView
  {

    public long transaction_id { get; set; } = -1;
    public long? child_transaction_id { get; set; }
    public string transaction_number { get; set; } = "";
    public string created_by_display_name { get; set; } = "";
    public DateTime created_on { get; set; } = DateTime.MinValue;
    public long department_id { get; set; } = -1;
    public string department_name { get; set; } = "";
    public bool has_been_modified { get; set; } = false;
    public decimal total_cash { get; set; } = -1;
    public decimal total_checks { get; set; } = -1;
    public int number_of_checks { get; set; } = -1;
    public string transaction_type { get; set; } = "";
    // we set my_transaction to true if this transaction was done by the user passed to the Get function
    public bool my_transaction { get; set; } = false;
    public bool can_modify { get; set; } = false;
    public TransactionView() { }  

    public static List<TransactionView> Get(UserAccess ua, long transaction_id = -1)
    {
      var sb = new StringBuilder();
      var param = new DynamicParameters();
      param.Add("@my_employee_id", ua.employee_id);

      var query = @"
        SELECT 
          TV.transaction_id
          ,TV.child_transaction_id
          ,TV.transaction_number
          ,TV.created_by_display_name
          ,CASE WHEN TV.created_by_employee_id = @my_employee_id 
            THEN 1 
            ELSE 0 
            END my_transaction
          ,CASE WHEN TV.child_transaction_id IS NULL AND TV.created_by_employee_id = @my_employee_id
            THEN 1
            ELSE 
              CASE WHEN TV.child_transaction_id IS NOT NULL 
                        AND CTV.child_transaction_id IS NULL
                        AND CTV.created_by_employee_id = @my_employee_id
                THEN 1
                ELSE 
                  CASE WHEN CTV.child_transaction_id IS NOT NULL 
                            AND GCTV.child_transaction_id IS NULL
                            AND GCTV.created_by_employee_id = @my_employee_id
                    THEN 1
                    ELSE 0
                    END
                END
            END can_modify
          ,TV.created_on
          ,TV.department_id
          ,TV.transaction_type
          ,TV.department_name
          ,TV.has_been_modified
          ,TV.total_cash
          ,TV.total_checks
          ,TV.number_of_checks
        FROM ClayFinancial.dbo.vw_transaction_view TV
        LEFT OUTER JOIN ClayFinancial.dbo.vw_transaction_view CTV ON TV.child_transaction_id = TV.transaction_id
        LEFT OUTER JOIN ClayFinancial.dbo.vw_transaction_view GCTV ON CTV.child_transaction_id = GCTV.transaction_id
      ";

      sb.AppendLine(query);

      if (transaction_id > -1)
      {
        // THIS MEANS WE ARE AFTER ALL TransactionView FOR A DEPOSIT
        param.Add("@transaction_id", transaction_id);
        sb.AppendLine("WHERE TV.child_transaction_id = @transaction_id");
      }

      return Constants.Get_Data<TransactionView>(sb.ToString(), param, Constants.ConnectionString.ClayFinancial);

    }


  }
}