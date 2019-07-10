using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClayFinancial.Models.Transaction
{
  public class InitialConfiguration
  {
    // this is the object sent down to the client to give them the data that 
    // it will need in order to create the application controls.
    // list of departments
    // list of payment types
    // dictionary of controls by department id
    // dictionary of controls by payment type id
    // Some flags to indicate the user's access level
    public List<Department> departments { get; set; } = new List<Department>();
    public List<PaymentType> payment_types { get; set; } = new List<PaymentType>();
    public List<Control> controls { get; set; } = new List<Control>();


    public List<Department> departments_raw { get; set; } = new List<Department>();
    public List<PaymentType> payment_types_raw { get; set; } = new List<PaymentType>();
    public List<Control> controls_raw { get; set; } = new List<Control>();



  }
}