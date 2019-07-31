﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClayFinancial.Models.Transaction.Data;

namespace ClayFinancial.Controllers.MVC
{
  public class TransactionController : Controller
  {
    // GET: Transaction
    public ActionResult Index()
    {
      var transactionData = new TransactionData();

      transactionData.Save();

      return View();
    }
  }
}