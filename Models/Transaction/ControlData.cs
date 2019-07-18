using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class ControlData
  {
    // Read only class. this is control data coming from the client.
    public string label { get; } = "";
    public string value { get; } = "";

    public ControlData()
    {
      
    }


    
  }
}