using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClayFinancial.Models.Transaction.Data;
using Dapper;

namespace ClayFinancial.Models.Transaction
{
  public class TransactionView
  {

    public long transaction_id { get; set; }
    public string transaction_number { get; set; }
    public string created_by_display_name { get; set; }
    public DateTime created_on { get; set; }
    public long department_id { get; set; }
    public string department_name { get; set; }
    public bool has_been_modified { get; set; }
    public decimal total_cash { get; set; }
    public decimal total_checks { get; set; }
    public int number_of_checks { get; set; }
    public string transaction_type { get; set; }
    public TransactionView() { }  

    public static List<TransactionView> GetListOfTransactionView(long transaction_id = -1)
    {
      var param = new DynamicParameters();


      var query = @"
      USE ClayFinancial;


      WITH Transactions_With_Changes AS (
  
        SELECT
          CD.transaction_id    
        FROM data_control CD
        INNER JOIN data_changes_control CDC ON CD.control_data_id = CDC.original_control_data_id
        GROUP BY CD.transaction_id

        UNION

        SELECT
          PMD.transaction_id
        FROM data_payment_method PMD
        INNER JOIN data_changes_payment_method PMDC ON PMD.payment_method_data_id = PMDC.original_payment_method_data_id
        GROUP BY PMD.transaction_id

        UNION

        SELECT
          DPT.transaction_id
        FROM data_payment_type DPT
        INNER JOIN data_changes_payment_type DCPT ON DPT.transaction_payment_type_id = DCPT.transaction_payment_type_id
        GROUP BY DPT.transaction_id

      ), TransactionIds_With_Changes AS (

        SELECT DISTINCT
          transaction_id
        FROM Transactions_With_Changes

      ), PaymentMethodSums AS (

        SELECT
          transaction_id
          ,SUM(cash_amount) total_cash
          ,SUM(check_amount) total_checks
          ,SUM(CASE WHEN LEN(check_number) > 0 THEN 1 ELSE 0 END) number_checks
        FROM data_payment_method
        GROUP BY transaction_id

      )

      SELECT
        T.transaction_id
        ,T.transaction_number
        ,T.created_by_display_name
        ,T.created_on
        ,T.department_id
        ,T.transaction_type
        ,D.name department_name
        ,CASE WHEN TWC.transaction_id IS NULL THEN 0 ELSE 1 END has_been_modified
        ,PMS.total_cash
        ,PMS.total_checks
        ,PMS.number_of_checks
      FROM data_transaction T
      INNER JOIN departments D ON T.department_id = D.department_id
      LEFT OUTER JOIN TransactionIds_With_Changes TWC ON T.transaction_id = TWC.transaction_id
      LEFT OUTER JOIN PaymentMethodSums PMS ON T.transaction_id = PMS.transaction_id

        
      
      ";



      if (transaction_id > -1)
      {
        // THIS MEANS WE ARE AFTER ALL TransactionView FOR A DEPOSIT
        param.Add("transaction_id", transaction_id);
        query += "WHERE child_transaction_id = @transaction_id";
      }

      return Constants.Get_Data<TransactionView>(query, Constants.ConnectionString.ClayFinancial);


    }


  }
}