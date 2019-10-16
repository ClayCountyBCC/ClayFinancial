using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ClayFinancial.Models.Transaction.Data;
using ClayFinancial.Models.Transaction;
using ClayFinancial.Models;

namespace ClayFinancial.Controllers.API
{
  [RoutePrefix("API/Transaction")]
  public class TransactionDataController : ApiController
  {
    /// <summary>
    /// 
    /// 
    /// </summary>
    /// <param name="page_number"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("Get")]
    public IHttpActionResult GetAllTransactionData(
      int page_number = -1
      ,string display_name_filter = ""
      ,string completed_filter = ""
      ,int department_id_filter = -1
      ,string transaction_type_filter = ""
      ,string transaction_number_filter = ""
      ,bool has_been_modified = false
      //,long transaction_id_filter = -1
    )
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      var tr = TransactionData.GetTransactionList
        (ua
        ,page_number
        ,display_name_filter
        ,completed_filter
        ,transaction_type_filter
        ,transaction_number_filter
        ,department_id_filter
        ,has_been_modified //   only true matters
      //  ,transaction_id_filter
      );
      if (tr == null)
      {
        return InternalServerError();
      }

      return Ok(tr);
    }
    [HttpGet]
    [Route("PageCount")]
    public IHttpActionResult Count(
      string display_name_filter = "",
      string completed_filter = "",
      int department_id_filter = -1,
      string transaction_type_filter = "",
      string transaction_number_filter = "",
      bool has_been_modified = false
    //,long transaction_id_filter = -1
    )
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      var count = TransactionData.GetTransactionPageCount(
        ua,
        display_name_filter,
        completed_filter,
        transaction_type_filter,
        transaction_number_filter,
        department_id_filter, 
        has_been_modified); 

      return Ok(count); 

    }


    [HttpPost]
    [Route("Save")]
    public IHttpActionResult SaveTransaction(TransactionData transactionData)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if(ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      transactionData.created_by_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      transactionData.SetUserProperties(ua);

      if (!transactionData.ValidateTransaction())
      {
        transactionData.error_text = "There was an issue with some of the data";
        return Ok(transactionData);
      }

      // TODO: new receipt needs to be a TransactionView
      var td = transactionData.SaveTransactionData(ua.employee_id); 
      
      if(td)
      {
        return Ok();
      }

      return InternalServerError();

    }

    [HttpPost]
    [Route("AddPaymentTypes")]
    public IHttpActionResult AddPaymentType(List<PaymentTypeData> payment_types_data)
    {
      if (!payment_types_data.Any()) return Ok(new TransactionData() {error_text = "there are no payment types in the list" }); ;

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      // todo add validation check to see if user can add payment type to this transaction
      foreach (var pt in payment_types_data)
      {
        if (!pt.ValidateChangePaymentType())
        {
          // probable should return the entire transaction with a save error
          if (pt.error_text.Length > 0)
          {
            pt.error_text = "There was an issue with this payment type.";
            return Ok("There was an issue with the payment type data");
          }
        }
      }


      if(!PaymentTypeData.SaveChangePaymentTypeData(payment_types_data, ua,user_ip_address))
      {
        return Ok("There was an issue saving the payment type data");
      }

      return Ok();
     
    }

    [HttpPost]
    [Route("EditPaymentMethod")]
    public IHttpActionResult EditPaymentMethod(PaymentMethodData payment_method_data)
    {
      if (payment_method_data.payment_method_data_id == -1) return Ok("Cannot edit this payment.");
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      //var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      payment_method_data.SetUserName(ua.user_name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      if (!payment_method_data.ValidateChange())
      {

        if(payment_method_data.error_text.Length == 0)
        {
          payment_method_data.error_text = "There was an issue with validating the payment method.";
        }

      }
      else
      {
        payment_method_data.added_after_save = false;
        if (!payment_method_data.SavePaymentMethod())
        {
          if (payment_method_data.error_text.Length == 0)
          {
            payment_method_data.error_text = "There was an issue editing the payment method.";
          }
        }
      }
     return Ok(payment_method_data.error_text);

    }
    [HttpPost]
    [Route("AddPaymentMethod")]
    public IHttpActionResult AddPaymentMethod(PaymentMethodData payment_method_data)
    {
      if (payment_method_data.payment_method_data_id > 0)
      {
        return Ok("This payment method has already been added.");
      }
      else
      {
        if (payment_method_data.cash_amount > 0)
        {
          return Ok("Cannot add additional cash payment method.");
        }
      }

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      payment_method_data.SetUserName(ua.user_name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }


      if (!payment_method_data.ValidateNew())
      {
        if (payment_method_data.error_text.Length == 0)
        {
          payment_method_data.error_text = "There was an issue with validating the payment method.";

        }
      }
      else
      {
        payment_method_data.added_after_save = true;

        if (!payment_method_data.SavePaymentMethod())
        {
          if (payment_method_data.error_text.Length == 0)
          {
            payment_method_data.error_text = "There was an issue saving the new payment method.";
          }
        }
      }

      return Ok(payment_method_data.error_text);
    }

    [HttpPost]
    [Route("EditControls")]
    public IHttpActionResult UpdateControl(ControlData control_data)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      //var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      control_data.SetUsername(ua.user_name);



      // I think this is doing something wrong
      // we need to make sure that control_data.control_data_id is not equal to -1
      // In this if statement, if it is anything other than -1 we return an error.
      //if (control_data.control_data_id != -1)
      //{
      //  if (control_data.department_id != -1)
      //  {
      //    control_data.error_text = "Cannot add new department controls";

      //  }
      //  return Ok(control_data.error_text);
      //}
      // replacing above
      if (control_data.control_data_id == -1) return BadRequest();
      // this works because the clientside UI should never attempt this

      if (!control_data.ValidateControlData())
      {
        if (control_data.error_text.Length > 0)
        {
          control_data.error_text = "There was an issue with the control data";
        }
      }
      if(!control_data.UpdateControlData())
      {
        if(control_data.error_text.Length == 0)
        {
          control_data.error_text = "There was an issue updating the control";
        }
      }

      return Ok(control_data.error_text);

    }

    [HttpGet]
    [Route("GetTransactionData")]
    public IHttpActionResult GetTransactionData(long transaction_id)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      
      var td = TransactionData.GetTransactionData(transaction_id, ua.employee_id, ua);

      if(ua.current_access == UserAccess.access_type.basic && td.department_id != ua.my_department_id)
      {
        return Unauthorized();
      }

      if(td == null)
      {
        return InternalServerError();
      }

      return Ok(td);

    }


    [HttpGet]
    [Route("GetControlDataHistory")]
    public IHttpActionResult GetControlHistory(long control_data_id = -1, long transaction_id = -1)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      if (control_data_id == -1 || transaction_id == -1)
      {
        return BadRequest();
      }

      var cl = ControlData.GetControlDataHistory(control_data_id, transaction_id);

      if (cl == null)
      {
        return InternalServerError();
      }

      return Ok(cl);

    }

    [HttpGet]
    [Route("GetPaymentMethodHistory")]
    public IHttpActionResult GetPaymentMethodHistory(long payment_method_data_id = -1, long transaction_id = -1)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      if (payment_method_data_id == -1 || transaction_id == -1)
      {
        return BadRequest();
      }

      var pm = PaymentMethodData.GetPaymentMethodHistory(payment_method_data_id, transaction_id);

      if (pm == null)
      {
        return InternalServerError();
      }
      return Ok(pm);
    }

    [HttpPost]
    [Route("CreateDeposit")]
    public IHttpActionResult CreateDeposit(string selected_user_display_name = "")

    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      var selected_employee_id = TransactionData.GetEmployeeIdFromDisplayName(selected_user_display_name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      //validate there are receipts to deposit for selected name and current users access level
      var error = TransactionData.ValidateNewDeposit(selected_employee_id, ua);
      if(error.Length > 0)
      {
        return Ok(error);
      }



      var deposit_transaction = TransactionData.CreateDeposit(ua, selected_user_display_name, ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress );

      if (deposit_transaction == null)
      {
        return InternalServerError();
      }

      return Ok(deposit_transaction);
    }

    [HttpGet]
    [Route("GetNameList")]
    public IHttpActionResult GetNameList()
    {
      var name_list = new List<string>();
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access) return Ok(name_list);

      return Ok(myCache.GetItem("list_of_names"));


    }


  }

}

