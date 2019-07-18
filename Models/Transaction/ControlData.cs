using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class ControlData
  {
    // Read only class. this is data coming from the client.
    public int control_id { get; }
    public string label { get; }
    public string value { get; }

    public ControlData()
    {
      
    }

    
  }
}