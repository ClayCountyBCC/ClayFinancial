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
      ,string username_filter = ""
      ,string completed_filter = ""
      ,string transaction_type_filter = ""
      ,string transaction_number_filter = ""
      //,long transaction_id_filter = -1
    )
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      var tr = TransactionData.GetTransactionList(ua,
        page_number
        ,username_filter
        ,completed_filter
        ,transaction_type_filter
        ,transaction_number_filter
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
    [Route("AddPaymentType")]
    public IHttpActionResult AddPaymentType(List<PaymentTypeData> payment_types_data)
    {
      if (!payment_types_data.Any()) return Ok(new TransactionData() {error_text = "there are no payment types in the list" }); ;

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      var td = new TransactionData();

      td.payment_type_data = payment_types_data;
      // todo add validation check to see if user can add payment type to this transaction
      foreach (var pt in payment_types_data)
      {
        if (!pt.ValidateChangePaymentType())
        {
          // probable should return the entire transaction with a save error
          td.has_error = true;

          if (pt.error_text.Length > 0) return Ok(td);

        }
      }

      if(td.has_error)
      {
        td.error_text = "There was an issue validating the new payment type(s)";
        return Ok(td);
      }

      if(!PaymentTypeData.SaveChangePaymentTypeData(payment_types_data, ua,user_ip_address))
      {
        return InternalServerError();
      }

      return Ok(td);
     
    }

    [HttpPost]
    [Route("ChangePaymentMethod")]
    public IHttpActionResult AddPaymentType(PaymentMethodData payment_method_data)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      if (payment_method_data.ValidateChange())
      {
        return Ok(TransactionData.GetTransactionData(payment_method_data.transaction_id));
      }
      return InternalServerError();
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
}

