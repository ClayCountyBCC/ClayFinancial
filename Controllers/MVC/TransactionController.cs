using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClayFinancial.Models.Transaction.Data;
using ClayFinancial.Models.Transaction;
using ClayFinancial.Models;

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

      // test new control; department controls cannot be added. only payment type controls
      // var control = Control.SaveControl

      // test edit control
      //var c = new ControlData()
      //{
      //  control_data_id = -1,
      //  transaction_id = 26,
      //  control_id = 36,
      //  prior_control_data_id = 86,
      //  transaction_payment_type_id = 46,
      //  reason_for_change = "Just to steal Dan's Test",
      //  department_id = -1,
      //  value = "I stole your test"


      //};

      //c.SetUsername("westje-test");

      //c.UpdateControlData();

      // test edit payment method
      //var pm = new PaymentMethodData()
      //{
      //  payment_method_data_id = -1
      // ,prior_payment_method_data_id = 134
      // ,transaction_payment_type_id = 29
      // ,transaction_id = 16
      // ,cash_amount = 0
      // ,check_amount = 120
      // ,check_count = 1
      // ,check_number = "5467"
      // ,reason_for_change = "umpteenth TEST OF EDIT PAYMENT METHOD"
      // ,check_from = "NOT A NEW ONE."
      // ,paying_for = "AMOUNT IS DIFFERENT (FOR REAL THIS TIME)"
      // ,is_active = true
      // ,added_after_save = false
      //};

      //// test SAVE NEW payment method
      //var pm = new PaymentMethodData()
      //{
      //  payment_method_data_id = -1
      // ,prior_payment_method_data_id = -1
      // ,transaction_payment_type_id = 29
      // ,transaction_id = 16
      // ,cash_amount = 0
      // ,check_amount = 123456
      // ,check_count = 1
      // ,check_number = "123456789"
      // ,reason_for_change = "OMG. NEVER GET WHAT I WANT. TEST ADD NEW PAYMNET METHOD"
      // ,check_from = "NEW ONE."
      // ,paying_for = "NEW AMOUNT"
      // ,is_active = true
      // ,added_after_save = true
      //};

      //pm.SetUserName("westje-test");
      //var i = pm.SavePaymentMethod();

      //var i = PaymentMethodData.GetPaymentMethodHistory(134);
      //var j = ControlData.GetControlDataHistory(87);



      //ViewBag.Development = Models.Constants.UseProduction() ? "" : "DEVELOPMENT";
 
      //var j = TransactionData.CreateDeposit(UserAccess.GetUserAccess("westje"), "Jeremy West", "localHost");


      return View();
    }
  }
}