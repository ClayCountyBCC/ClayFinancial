using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace ClayFinancial.Models.Transaction.Data
{
  public class PaymentTypeData
  {

    /*
     *      + payment_type
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
     * */
    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public bool tax_exempt { get; set; }
    public int payment_type_id { get; set; }
    public int payment_type_counter { get; set; }
    public List<ControlData> control_data { get; set; }    


    public PaymentTypeData Get()
    {
      return new PaymentTypeData();
    }

    public bool Validate()
    {

      return true;

    }

    public PaymentTypeData Save()
    {
      return new PaymentTypeData();
    }

    private DataTable CreatePaymentTypeDataTable()
    {

        // TODO: create generic DataTable function.
        // Pass name of column and type for each column
      var dt = new DataTable("PaymentTypeData");

      var transaction_payment_type_id = new DataColumn("transaction_payment_type_id", typeof(long));
      var transaction_id = new DataColumn("transaction_id",typeof(long));
      var payment_type_id = new DataColumn("payment_type_id", typeof(short));
      var payment_type_index = new DataColumn("payment_type_index", typeof(short));
      var tax_exempt = new DataColumn("tax_exempt", typeof(bool));

      dt.Columns.Add(transaction_payment_type_id);
      dt.Columns.Add(transaction_id);
      dt.Columns.Add(payment_type_id);
      dt.Columns.Add(payment_type_index);
      dt.Columns.Add(tax_exempt);

      return dt;
    }
  }
}