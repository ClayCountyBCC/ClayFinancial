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
    public long control_data_id { get; set; }
    public long prior_control_data_id { get; set; }
    public int control_id { get; set; }    
    public int department_id { get; set; }
    public long transaction_payment_type_id { get; set; }
    public long transaction_id { get; set; }
    public string value { get; set; } = "";
    public bool is_active { get; set; } = true;
    public string modified_by { get; set; } = "";
    public DateTime modified_on { get; set; } = DateTime.MinValue;
    public string error_text { get; set; } = "";

    public ControlData()
    {
    }

    
    
  }
}