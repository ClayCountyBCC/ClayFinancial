﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace ClayFinancial.Models
{
  public class ErrorLog
  {
    public int AppId { get; set; } = 20040;
    public string ApplicationName { get; set; } = "ClayFinancial";
    public string ErrorText { get; set; }
    public string ErrorMessage { get; set; }
    public string ErrorStacktrace { get; set; }
    public string ErrorSource { get; set; }
    public string Query { get; set; }

    public ErrorLog(string text,
      string message,
      string stacktrace,
      string source,
      string errorQuery)
    {
      ErrorText = text;
      ErrorMessage = message;
      ErrorStacktrace = stacktrace;
      ErrorSource = source;
      Query = (Constants.UseProduction() ? "PRODUCTION" : "DEVELOPMENT") + errorQuery;
      SaveLog();
    }

    public ErrorLog(Exception ex, string errorQuery = "")
    {
      ErrorText = ex.ToString();
      ErrorMessage = ex.Message;
      ErrorStacktrace = ex.StackTrace;
      ErrorSource = ex.Source;
      Query = (Constants.UseProduction() ? "PRODUCTION" : "DEVELOPMENT") + errorQuery;
      SaveLog();
    }

    private void SaveLog(ErrorLog el = null, string c_name = "ProdLog")
    {
      string sql = @"
          INSERT INTO ErrorData 
          (applicationName, AppId, errorText, errorMessage, 
          errorStacktrace, errorSource, query)  
          VALUES (@applicationName, @AppId, @errorText, @errorMessage,
            @errorStacktrace, @errorSource, @query);";

      var cs = ConfigurationManager.ConnectionStrings[c_name].ConnectionString;

      try
      {
        using (IDbConnection db = new SqlConnection(cs))
        {
          db.Execute(sql, this);
        }
      }
      catch (Exception ex)
      {
        SaveLog(this, "LOG");
        SaveLog(new ErrorLog(ex, sql), "LOG");
      }
    }

    public static void SaveEmail(string to, string subject, string body)
    {
      string sql = @"
          INSERT INTO EmailList 
          (EmailTo, EmailSubject, EmailBody)  
          VALUES (@To, @Subject, @Body);";

      try
      {
        var dbArgs = new Dapper.DynamicParameters();
        dbArgs.Add("@To", to);
        dbArgs.Add("@Subject", subject);
        dbArgs.Add("@Body", body);
        var cs = ConfigurationManager.ConnectionStrings["LOG"].ConnectionString;
        using (IDbConnection db = new SqlConnection(cs))
        {
          db.Execute(sql, dbArgs);
        }
      }
      catch (Exception ex)
      {
        // if we fail to save an email to the production server,
        // let's save it to the backup DB server.
        new ErrorLog(ex, sql);
      }
    }


  }
}