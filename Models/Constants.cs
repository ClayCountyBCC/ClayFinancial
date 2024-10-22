using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using ClayFinancial.Models.Transaction;

namespace ClayFinancial.Models
{
  public static class Constants
  {
    public enum ConnectionString
    {
      ClayFinancial,
      Log,
      Finplus,
      FinplusQA
    }

    public static List<T> Get_Data<T>(string query, ConnectionString cs)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return (List<T>)db.Query<T>(query);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, T item, ConnectionString cs)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return (List<T>)db.Query<T>(query, item);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, DynamicParameters dbA, ConnectionString cs, int timeOut = 60)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return (List<T>)db.Query<T>(query, dbA, commandTimeout: timeOut);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static int Exec_Query(string query, DynamicParameters dbA, ConnectionString cs)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return db.Execute(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return -1;
      }
    }

    public static int Exec_Query<T>(string query, T item, ConnectionString cs)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return db.Execute(query, item);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return -1;

      }
    }

    public static T Exec_Scalar<T>(string query, ConnectionString cs, DynamicParameters dbA = null)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return db.ExecuteScalar<T>(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return default(T);
      }
    }

    public static string Get_ConnStr(ConnectionString cs)
    {
      if (UseProduction())
      {
        return ConfigurationManager.ConnectionStrings[cs.ToString()].ConnectionString;
      }
      else
      {
        return ConfigurationManager.ConnectionStrings[cs.ToString() + "QA"].ConnectionString;
      }
    }

    public static bool UseProduction()
    {
      switch (Environment.MachineName.ToUpper())
      {

        //case "MISHL17":
        //case "MISSL01":
        case "CLAYBCCIIS01":
        case "CLAYBCCDMZIIS01":
          return true;

        case "CLAYBCCDV10":
          return false;
        default:
          return false;
      }
    }

    //public static Dictionary<T, T2> Get_Dict<T, T2>(string dictionary_name)
    //{

    //  var dictionary = new Dictionary<T, T2>();
    //  var cd = new Dictionary<int,Control>();
    //  var dd = new Dictionary<int,Department>();
    //  var pd = new Dictionary<int,PaymentType>();

    //  switch (dictionary_name)
    //  {
    //    case "Control":
    //     var cl =  Control.GetCached();
    //      foreach (var c in cl)
    //      {
    //        cd[c.id] = c;
    //      }
    //      break;
    //    case "Department":
    //      var dl = Department.GetCached();
    //      foreach (var d in dl)
    //      {
    //        dd[d.id] = d;
    //      }
    //      break;
    //    case "PaymentTYpe":
    //      var pl = PaymentType.GetCached();
    //      foreach (var p in pl)
    //      {
    //        pd[p.id] = p;
    //      }
    //      break;
    //  }
    //  if (cd.Any())  return cd;
    //}



  }
}