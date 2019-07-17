using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ClayFinancial.Controllers.API
{
  [RoutePrefix("API/Transaction")]
  public class DepartmentController : ApiController
  {
    [HttpGet]
    [Route("Departments")]
    public IHttpActionResult GetDepartment()
    {
      return Ok(Models.Transaction.Department.GetCached());
    }
  }
}
