using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using System.Web;
using ClayFinancial.Models.Transaction.Data;

namespace ClayFinancial.Models.Transaction
{
  public class PaymentType
  {
    public int department_id { get; set; } = -1;
    public int payment_type_id { get; set; } = -1;
    public string name { get; set; } = "";
    public bool is_active { get; set; } = false;
    public List<Control> controls { get; set; } = new List<Control>();
    //public List<PaymentMethodData> payment_methods { get; set; }
    public Dictionary<int, Control> controls_dict { get; set; } = new Dictionary<int, Control>();
    public string added_by { get; set; } = "";
    public DateTime added_on { get; set; } = DateTime.MinValue;
    public PaymentType() { }

    public static List<PaymentType> Get()
    {
      var controls = (from c in Control.GetCached()
                      where c.payment_type_id.HasValue
                      select c).ToList();

      string sql = @"
        SELECT
          department_id
          ,payment_type_id
          ,name
          ,is_active
        FROM vw_payment_types
        ORDER BY department_id ASC, name ASC";

      var payment_types = Constants.Get_Data<PaymentType>(sql, Constants.ConnectionString.ClayFinancial);

      foreach (PaymentType pt in payment_types)
      {
        var tmpControls = from c in controls
                          where c.payment_type_id == pt.payment_type_id
                          select c;

        foreach (Control c in tmpControls)
        {
          pt.controls.Add(c);
          pt.controls_dict[c.control_id] = c;
        }
      }

      return payment_types;
    }

    public static Dictionary<int, PaymentType> Get_Dict()
    {
      var payment_types = PaymentType.GetCached();

      Dictionary<int, PaymentType> d = new Dictionary<int, PaymentType>();

      foreach(PaymentType p in payment_types)
      {
        d[p.payment_type_id] = p;
      }
      return d;
    }

    public static List<PaymentType> GetCached()
    {
      return (List<PaymentType>)myCache.GetItem("payment_types");
    }

    public static Dictionary<int, PaymentType> GetCached_Dict()
    {
      return (Dictionary<int, PaymentType>)myCache.GetItem("payment_types_dict");
    }

    public bool ValidatePaymentType(Data.PaymentTypeData ptd)
    {
      // in order to have a valid payment type, all of the required controls
      // must have a value and all of the payment methods must be valid.
      if(ptd.payment_type_id == 63)
      {

        // validate the transaction number is valid (control_id 87)
        foreach (var c in ptd.control_data)
        {
          if (c.control_id == 87)
          {
            var transaction_number = c.value.Trim();

            if (transaction_number.Length == 0)
            {
              c.error_text = "No transaction number entered";
              return false;
            }

            if (transaction_number.Length != 13 ||
                transaction_number.IndexOf('-', 0) != 2 ||
                transaction_number.IndexOf('-', 3) != 7)
            {
              c.error_text = "Invalid deposit transaction number format. Please check you entered the receipt number correctly";
              return false;
            }

            c.error_text = CheckIfValidSecurityDeposit(transaction_number);
            if (c.error_text.Length > 0) return false;

          }
        }
        
      }


      foreach (Data.ControlData cd in ptd.control_data)
      {
        if (!controls_dict[cd.control_id].Validate(cd))
        {
          return false;
        }
      }

      // this object has been deemed unnecessary
      //var PaymentMethod = new PaymentMethod();


      foreach (Data.PaymentMethodData pmd in ptd.payment_method_data)
      {
        if (!pmd.ValidateNew())
        {
          return false;
        }
      }
      return true;
    }


    public bool ValidateChangePaymentType(PaymentTypeData ptd)
    {
      // add new, additional checks here if we determine they need to be.


      return true;

    }

    private string CheckIfValidSecurityDeposit(string transaction_number)
    {
      var param = new DynamicParameters();
      param.Add("@transaction_number", transaction_number);

      var query = @"

        SELECT count(transaction_number)
        FROM data_transaction DT
        INNER JOIN data_payment_type DPT ON DPT.transaction_id = DT.transaction_id AND DPT.payment_type_id = 62
        WHERE DT.transaction_number = @transaction_number

      ";

      var td = Constants.Exec_Scalar<int>(query,  Constants.ConnectionString.ClayFinancial, param);

      if (td < 1) return "This transaction does not have a security deposit.";

      if (td > 1)
      {
        new ErrorLog(transaction_number,
                    "Transaction number " + transaction_number + " has multiple Rental - Security deposit Payment Types",
                    "PaymentType.CheckIfValidSecurityDeposit(string transaction_number)",
                    "",
                    "");
        return "Multiple security deposits exist on this transaction.";

      }

      return "";
    }
  }
}