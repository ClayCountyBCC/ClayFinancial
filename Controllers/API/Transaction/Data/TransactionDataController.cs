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
      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      if (ua.current_access == UserAccess.access_type.no_access) return Unauthorized();

      return Ok(TransactionData.GetTransactionList(ua));
    }

    [HttpPost]
    [Route("Save")]

    // THIS SIGNATURE IS NOW UNNECESSARY AS THE List<long> transaction_ids IS NOW PART OF THE OBJECT
    //public IHttpActionResult SaveTransaction(TransactionData transaction, List<long> transaction_ids = null)
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

