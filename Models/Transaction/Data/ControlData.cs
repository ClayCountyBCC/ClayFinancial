using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction.Data
{
  public class ControlData
  {
    // Read only class. this is control data coming from the client.
    // control_id, department_id or payment_type_id
    public int control_id { get; set; }
    public int department_id { get; set; }
    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public string value { get; set; } = "";
    public bool is_active { get; set; } = true;
    public DateTime created_on { get; set; } = DateTime.Now;
    public string created_by { get; set; } = "";
    public DateTime? modified_on { get; set; }
    public string modified_by { get; set; } = "";

    public ControlData()
    {
      
    }

    
    
  }
}