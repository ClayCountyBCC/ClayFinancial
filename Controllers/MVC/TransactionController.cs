using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClayFinancial.Models.Transaction.Data;
using ClayFinancial.Models.Transaction;

namespace ClayFinancial.Controllers.MVC
{
  public class TransactionController : Controller
  {
    // GET: Transaction
    public ActionResult Index()
    {

      // test getting a single transaction
      // var tr = TransactionData.GetTransactionData(8);

      // test getting list of ALL transactionView
      // var tr = TransactionView.GetListOfTransactionView();

      // test new list of transaction data with pagination (page_number)
      // var tr = TransactionData.GetTransactionList(Models.UserAccess.GetUserAccess(User.Identity.Name),1);

      ViewBag.Development = Models.Constants.UseProduction() ? "" : "DEVELOPMENT";
      return View();
    }
  }
}