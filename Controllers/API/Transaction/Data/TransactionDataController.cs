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
      , string display_name_filter = ""
      , string completed_filter = ""
      , int department_id_filter = -1
      , string transaction_type_filter = ""
      , string transaction_number_filter = ""
      , bool has_been_modified = false
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
        , page_number
        , display_name_filter
        , completed_filter
        , transaction_type_filter
        , transaction_number_filter
        , department_id_filter
        , has_been_modified //   only true matters
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

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      transactionData.created_by_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      transactionData.SetUserProperties(ua);

      if (!transactionData.ValidateTransaction())
      {
        if(transactionData.error_text.Length == 0)
        {
          transactionData.error_text = "There was an issue with some of the data";
        }
        return Ok(transactionData);
      }

      // TODO: new receipt needs to be a TransactionView
      var td = transactionData.SaveTransactionData();

      if (td)
      {
        return Ok(TransactionData.GetTransactionData(transactionData.transaction_id, ua.employee_id, ua));
      }
      else
      {
        return Ok(transactionData);
      }
    }

    [HttpPost]
    [Route("AddPaymentTypes")]
    public IHttpActionResult AddPaymentType(List<PaymentTypeData> payment_types_data)
    {
      if (!payment_types_data.Any()) return Ok(new TransactionData() { error_text = "there are no payment types in the list" });

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      // validate if user is able to edit or add payments to this transaction
      if (!TransactionData.ValidateEdit(payment_types_data[0].transaction_id, ua)) return Unauthorized();

      foreach (var pt in payment_types_data)
      {
        if (!pt.ValidateChangePaymentType())
        {
          // probably should return the entire transaction with a save error
          if (pt.error_text.Length > 0)
          {
            pt.error_text = "There was an issue with this payment type.";
            return Ok("There was an issue with the payment type data");
          }
        }
      }


      if (!PaymentTypeData.SaveChangePaymentTypeData(payment_types_data, ua, user_ip_address))
      {
        return Ok("There was an issue saving the payment type data");
      }

      return Ok();

    }

    [HttpPost]
    [Route("EditPaymentMethod")]
    public IHttpActionResult EditPaymentMethod(PaymentMethodData payment_method_data)
    {
      if (payment_method_data.payment_method_data_id == -1) return BadRequest();
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (!TransactionData.ValidateEdit(payment_method_data.transaction_id, ua)) return Unauthorized();

      //var user_ip_address = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
      payment_method_data.SetUserName(ua.user_name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }
      if (!payment_method_data.ValidateChange())
      {

        if (payment_method_data.error_text.Length == 0)
        {
          return Ok("There was an issue with validating the payment method.");
        }

      }
      else
      {
        payment_method_data.added_after_save = false;
        if (!payment_method_data.SavePaymentMethod())
        {
          if (payment_method_data.error_text.Length == 0)
          {
            return Ok("There was an issue editing the payment method.");
          }
        }
      }
      return Ok();

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

      if (!TransactionData.ValidateEdit(payment_method_data.transaction_id, ua)) return Unauthorized();

      payment_method_data.SetUserName(ua.user_name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      if (!TransactionData.ValidateEdit(payment_method_data.transaction_id, ua)) return Unauthorized();

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

      return Ok();
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
      if (!TransactionData.ValidateEdit(control_data.transaction_id, ua)) return Unauthorized();

      if (!control_data.ValidateControlData(ua))
      {
        if (control_data.error_text.Length > 0)
        {
          control_data.error_text = "There was an issue with the control data";
        }
      }
      if (!control_data.UpdateControlData())
      {
        if (control_data.error_text.Length == 0)
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

      if (ua.current_access == UserAccess.access_type.basic && td.department_id != ua.my_department_id)
      {
        return Unauthorized();
      }

      if (td == null)
      {
        return InternalServerError();
      }

      return Ok(td);

    }

    [HttpGet]
    [Route("GetControlData")]
    public IHttpActionResult GetAllActiveControlDataForTransactions(List<long> transaction_ids)
    {

      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      if (!TransactionData.ValidateTransactionListAccess(transaction_ids, ua)) { return Unauthorized(); }

      return Ok(ControlData.GetAllActiveControlDataForTransactions(transaction_ids));

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

      if (!TransactionData.ValidateTransactionListAccess(new List<long>() { transaction_id }, ua)) { return Unauthorized(); }

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
    public IHttpActionResult CreateDeposit(string selected_user_display_name)
    {
      if (selected_user_display_name == null) return BadRequest();

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      if (selected_user_display_name == "mine")
      {
        selected_user_display_name = ua.display_name;
      }
      else
      {
        var name_ua = UserAccess.GetUserAccessByDisplayName(selected_user_display_name);
        // We check to see if the name that they gave us has a higher level access
        // than they do.  If it is higher, then they can't do a deposit.
        if ((int)ua.current_access < (int)name_ua.current_access) return Unauthorized();
        if (ua.current_access == UserAccess.access_type.basic)
        {
          if (ua.my_department_id != name_ua.my_department_id) return Unauthorized();
        }
      }


      if (selected_user_display_name == "mine") selected_user_display_name = ua.display_name;

      var selected_employee_id = UserAccess.GetEmployeeIdFromDisplayName(selected_user_display_name);

      //validate there are receipts to deposit for selected name and current users access level
 
      if(TransactionData.ValidateNewDeposit(selected_employee_id, ua) == 0)
      {
        return Ok("There are no receipts to deposit");
      }

      var deposit_transaction = TransactionData.CreateDeposit(ua, selected_user_display_name, ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress );

      if (deposit_transaction == null)
      {
        return InternalServerError();
      }

      return Ok(deposit_transaction);
    }

    [HttpGet]
    [Route("GetAllNames")]
    public IHttpActionResult GetNameList()
    {      
      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access) return Unauthorized();

      return Ok(UserAccess.GetCachedUserDisplayNames(ua.display_name));

    }

    [HttpGet]
    [Route("GetDepositCount")]
    public IHttpActionResult GetDespositCount(string name)
    {
      // This endpoint is going to look at the user's access
      // and return a count of the number of receipts ready to be deposited.
      // the client will use this as an identifier, if the count is 0, it will now attempt
      // to create a deposit.

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      if (ua.current_access == UserAccess.access_type.no_access) return Unauthorized();
      if (name == "mine")
      {
        name = ua.display_name;
      }
      else
      {
        var name_ua = UserAccess.GetUserAccessByDisplayName(name);
        // We check to see if the name that they gave us has a higher level access
        // than they do.  If it is higher, then they can't do a deposit.
        if ((int)ua.current_access < (int)name_ua.current_access) return Ok(0);
        if (ua.my_department_id != name_ua.my_department_id) return Ok(0);
      }

      return Ok(TransactionData.GetReadyForDepositCount(name));
    }

    [HttpGet]
    [Route("GetSalesTaxAndTDC")]
    public IHttpActionResult GetSalesTaxAndTDC(long transaction_id)
    {

      var ua = UserAccess.GetUserAccess(User.Identity.Name);

      if (ua.current_access == UserAccess.access_type.no_access)
      {
        return Unauthorized();
      }

      var tax_and_tdc = TransactionData.GetTaxAndTDC(transaction_id);

      return Ok(tax_and_tdc);
    }


  }

}

