﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Caching;
using ClayFinancial.Models.Transaction;

namespace ClayFinancial.Models
{
  public class myCache
  {
    private static MemoryCache _cache = new MemoryCache("myCache");


    public static object GetItem(string key)
    {
      return GetOrAddExisting(key, () => InitItem(key));
    }

    public static object GetItem(string key, CacheItemPolicy CIP)
    {
      return GetOrAddExisting(key, () => InitItem(key), CIP);
    }

    public static T GetItem<T>(string key, Func<T> valuefactory, CacheItemPolicy CIP)
    {
      return GetOrAddExisting(key, valuefactory, CIP);
    }

    public static void UpdateItem(string key, object newvalue, CacheItemPolicy CIP)
    {
      _cache.Set(key, newvalue, CIP);
    }

    private static T GetOrAddExisting<T>(string key, Func<T> valueFactory, CacheItemPolicy CIP)
    {

      Lazy<T> newValue = new Lazy<T>(valueFactory);
      var oldValue = _cache.AddOrGetExisting(key, newValue, CIP) as Lazy<T>;
      try
      {
        return (oldValue ?? newValue).Value;
      }
      catch (Exception ex)
      {
        // Handle cached lazy exception by evicting from cache. Thanks to Denis Borovnev for pointing this out!
        new ErrorLog(ex);
        _cache.Remove(key);
        throw;
      }
    }

    private static T GetOrAddExisting<T>(string key, Func<T> valueFactory)
    {

      Lazy<T> newValue = new Lazy<T>(valueFactory);
      var oldValue = _cache.AddOrGetExisting(key, newValue, GetCIP()) as Lazy<T>;
      try
      {
        return (oldValue ?? newValue).Value;
      }
      catch
      {
        // Handle cached lazy exception by evicting from cache. Thanks to Denis Borovnev for pointing this out!
        _cache.Remove(key);
        throw;
      }
    }

    private static CacheItemPolicy GetCIP()
    {
      CacheItemPolicy CIP = new CacheItemPolicy()
      {

        AbsoluteExpiration = 
          DateTime.Now.CompareTo(DateTime.Parse(DateTime.Now.ToShortDateString() + " 6:00:00 AM")) < 0 ?
              DateTime.Parse(DateTime.Now.ToShortDateString() + " 6:00:00 AM")
            : DateTime.Parse(DateTime.Now.AddDays(1).ToShortDateString() + " 6:00:00 AM")  // if created after 6 AM then exp 6 am tomorrow
      };
      return CIP;
    }

    private static object InitItem(string key)
    {
      switch (key.Trim().ToLower())
      {

        case "controls":
          return Control.Get();

        case "controls_dict":
          return Control.Get_Dict();

        case "departments":
          return Department.Get();

        case "departments_dict":
          return Department.Get_Dict();

        case "payment_types":
          return PaymentType.Get();

        case "payment_types_dict":
          return PaymentType.Get_Dict();

        case "useraccess":
          return UserAccess.GetAllUserAccess();

        case "list_of_names":
          return UserAccess.GetAllUserDisplayNames();

        default:
          return null;
      }
    }


  }
}