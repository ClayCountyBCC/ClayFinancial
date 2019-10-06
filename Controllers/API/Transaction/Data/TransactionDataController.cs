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

    //[HttpGet]
    //[Route("Get")]
    //public IHttpActionResult CreateDeposit(TransactionData transactionData)
    //{
    //  var ua = UserAccess.GetUserAccess(User.Identity.Name);

    //  if (ua.current_access == UserAccess.access_type.no_access)
    //  {
    //    return Unauthorized();
    //  }
    //  transactionData.created_by_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
    //  transactionData.SetUserProperties(ua);

    //  var tr = transactionData.CreateDeposit(ua);

    //  if (tr == null)
    //  {
    //    return InternalServerError();
    //  }

    //  return Ok(tr);
    //}


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
      var td = transactionData.SaveTransactionData(); 
      
      if(td != null)
      {
        return Ok(td);
      }

      return InternalServerError();

    }

    [HttpPost]
    [Route("EditPaymentTypes")]
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
        return InternalServerError();
      }

      return Ok(TransactionData.GetTransactionData(payment_types_data.First().transaction_id));
     
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
        return Ok(payment_method_data.error_text);
      }
      else
      {
        if(payment_method_data.payment_method_data_id > -1)
        {
          payment_method_data.EditPaymentMethod();
        }
        else
        {
          payment_method_data.SaveNewPaymentMethod();
        }

        return Ok();
      }

    }
    [HttpPost]
    [Route("AddPaymentMethod")]
    public IHttpActionResult AddPaymentMethod(PaymentMethodData payment_method_data)
    {
      //var ua = UserAccess.GetUserAccess(User.Identity.Name);
      ////var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      //payment_method_data.SetUserName(ua.user_name);

      //if (ua.current_access == UserAccess.access_type.no_access)
      //{
      //  return Unauthorized();
      //}

      //if (!payment_method_data.ValidateChange())
      //{
      //  if (payment_method_data.error_text.Length == 0)
      //  {
      //    payment_method_data.error_text = "There was an issue with validating the payment method.";

      //    return Ok(payment_method_data);
      //  }
      //}
      //else
      //{
      //  if (payment_method_data.payment_method_data_id > -1)
      //  {
      //    payment_method_data.EditPaymentMethod();
      //  }
      //  else
      //  {
      //    payment_method_data.SaveNewPaymentMethod();
      //  }

      //  return Ok(TransactionData.GetTransactionData(payment_method_data.transaction_id));
      //}

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

      if (control_data.control_data_id != -1)
      {
        if (control_data.department_id != -1)
        {
          control_data.error_text = "Cannot add new department controls";
          
        }
        return Ok(control_data.error_text);
      }

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
      var td = TransactionData.GetTransactionData(transaction_id);

      if(td == null)
      {
        return InternalServerError();
      }

      return Ok(td);

    }

   // edit controls

  }

  //control_data return history

  //payment_method_data return history
}

