using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.TransactionSave
{
  public class ControlData
  {
    // Read only class. this is control data coming from the client.
    // control_id, department_id or payment_type_id
    public int control_id { get; set; }
    public int department_id { get; set; }
    public int payment_type_id { get; set; }
    public string value { get; } = "";

    public ControlData()
    {
      
    }

    
    
  }
}