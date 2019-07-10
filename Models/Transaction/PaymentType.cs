using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class PaymentType
  {
    public int id { get; set; }
    public string name { get; set; }
    public bool does_tax_exempt_apply { get; set; }
    
    public PaymentType() { }

    public static List<PaymentType> Get()
    {
      string sql = @"
        SELECT
          id
          ,name
          ,does_tax_exempt_apply
        FROM departments
        WHERE is_active = 1
        ORDER BY name ASC";
      return Constants.Get_Data<PaymentType>(sql, Constants.ConnectionString.ClayFinancial);
    }
  }
}