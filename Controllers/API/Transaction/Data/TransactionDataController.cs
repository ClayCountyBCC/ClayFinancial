using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ClayFinancial.Models.Transaction.Data;

namespace ClayFinancial.Controllers.API
{
  [RoutePrefix("API/Transaction")]
  public class TransactionDataController : ApiController
  {
    [HttpPost]
    [Route("Save")]
    public IHttpActionResult SaveTramsaction(TransactionData transaction)
    {

      transaction.SetUserProperties(/* GetCachedUserAccess(User.Identity.Name) */ );
      TransactionData td = transaction.Save(/* ua */);

      return Ok(td);

    }
  }
}

