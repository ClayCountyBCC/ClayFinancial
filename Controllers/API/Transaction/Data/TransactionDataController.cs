﻿using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ClayFinancial.Models.Transaction.Data;
using ClayFinancial.Models;

namespace ClayFinancial.Controllers.API
{
  [RoutePrefix("API/Transaction")]
  public class TransactionDataController : ApiController
  {
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

      var newReceipt = transaction.SaveNewReceipt();
      
      if(newReceipt != null)
      {
        return Ok(newReceipt);
      }

      return InternalServerError();

      

    }
  }
}

