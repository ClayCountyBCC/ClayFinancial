using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClayFinancial.Models.Transaction;

namespace ClayFinancial.Models.DataControl
{


  /*
   * 
   *  This class will be designed to facilitate
   *  the maintenance of the core data used in the ClayFinancial application.
   *  
   *    1. Payment Types
   *    2. Departments
   *    3. Controls
   *  
   *  This process will be used by the finance department to add/edit
   *  new payment types and departments. The controls, as of right now,
   *  are going to be maintained by MIS development team until we decide
   *  that should change.
   *  
   *  This class is not concerned with any trasnactions,
   *  only the core data used to render them.
   *  
   *  
   * 
  */



  public class DataControl
  {
    public List<PaymentType> payment_types_raw { get; set; }
    public List<Department> departments_raw { get; set; }
    public List<Control> controls_raw { get; set; }


    // get cached values when MyCache is implemented;
    // It will be easier to update the Get function in
    // each of the appropriate classes


    public DataControl()
    {

    }
    
    public List<DataControl> SaveNewPaymentType()
    {

      return new List<DataControl>();
    }

    public List<DataControl> UpdatePaymentType()
    {

      return new List<DataControl>();
    }
  }
}