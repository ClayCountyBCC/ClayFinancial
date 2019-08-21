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

    [HttpGet]
    [Route("Get")]
    public IHttpActionResult GetAllTransactionView()

    {
      
      return InternalServerError();
    }

    [HttpPost]
    [Route("Save")]
    public IHttpActionResult SaveTransaction(TransactionData transaction)
    {
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if(ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      transaction.created_by_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      transaction.SetUserProperties(ua);

      if (!transaction.ValidateNewReceipt())
      {
        transaction.error_text = "There was an issue with some of the data";
        return Ok(transaction);
      }

      // TODO: new receipt needs to be a TransactionView
      var newReceipt = transaction.SaveNewReceipt(); 
      
      if(newReceipt != null)
      {
        return Ok(newReceipt);
      }

      return InternalServerError();

    }


    [HttpPost]
    [Route("AddPaymentType")]
    public IHttpActionResult AddPaymentType(PaymentTypeData payment_type_data)
    {
      if (!payment_type_data.ValidateChangePaymentType())
      {
         return InternalServerError();
      }

      return Ok(payment_type_data.SaveChangePaymentType());
     
    }


    [HttpPost]
    [Route("ChangePaymentMethod")]
    public IHttpActionResult AddPaymentType(PaymentMethodData payment_method_data)
    {

      if(payment_method_data.ValidateChange())
      {

        return Ok(TransactionData.GetTransactionData(payment_method_data.transaction_id));
      }
      return InternalServerError();
    }



    [HttpGet]
    [Route("GetTransactionData")]
    public IHttpActionResult GetTransactionData(long transaction_id)
    {
      var td = TransactionData.GetTransactionData(transaction_id);

      if(td == null)
      {
        return InternalServerError();
      }

      return Ok(td);

    }

  }
}

