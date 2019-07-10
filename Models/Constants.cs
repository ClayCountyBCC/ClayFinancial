using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace ClayFinancial.Models
{
  public static class Constants
  {
    public enum ConnectionString
    {
      ClayFinancial,
      Log
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
        case "CLAYBCCDV10":
          // Test Environment Machines
          return false;

        //case "MISHL05":
        //case "MISSL01":
        case "CLAYBCCIIS01":
        case "CLAYBCCDMZIIS01":
          return true;

        default:
          // we'll return false for any machinenames we don't know.
          return false;
      }
    }

  }
}