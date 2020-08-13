"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = undefined && undefined.__awaiter || function (n, t, i, r) {
  function u(n) {
    return n instanceof i ? n : new i(function (t) {
      t(n);
    });
  }return new (i || (i = Promise))(function (i, f) {
    function o(n) {
      try {
        e(r.next(n));
      } catch (t) {
        f(t);
      }
    }function s(n) {
      try {
        e(r["throw"](n));
      } catch (t) {
        f(t);
      }
    }function e(n) {
      n.done ? i(n.value) : u(n.value).then(o, s);
    }e((r = r.apply(n, t || [])).next());
  });
},
    Utilities,
    Transaction;(function (n) {
  function t(n) {
    typeof n == "string" && (n = document.getElementById(n));n.classList.add("hide");n.classList.remove("show");n.classList.remove("show-inline");n.classList.remove("show-flex");
  }function r(n) {
    typeof n == "string" && (n = document.getElementById(n));n.classList.add("show");n.classList.remove("hide");n.classList.remove("show-inline");n.classList.remove("show-flex");
  }function a(n) {
    typeof n == "string" && (n = document.getElementById(n));n.classList.add("show-inline");n.classList.remove("hide");n.classList.remove("show");n.classList.remove("show-flex");
  }function v(n) {
    typeof n == "string" && (n = document.getElementById(n));n.classList.add("show-inline-flex");n.classList.remove("hide");n.classList.remove("show");n.classList.remove("show-flex");
  }function y(n) {
    typeof n == "string" && (n = document.getElementById(n));n.classList.add("show-flex");n.classList.remove("hide");n.classList.remove("show-inline");n.classList.remove("show");
  }function o(n, u, f) {
    if ((typeof n == "string" && (n = document.getElementById(n)), u)) {
      i(n);var _r = document.createElement("div");_r.classList.add("notification");_r.classList.add("is-danger");var _f = document.createElement("button");if ((_f.classList.add("delete"), _f.onclick = function () {
        t(n);
      }, _r.appendChild(_f), Array.isArray(u))) {
        (function () {
          var n = document.createElement("ul");u.forEach(function (t) {
            var i = document.createElement("li");i.appendChild(document.createTextNode(t));n.appendChild(i);
          });_r.appendChild(n);
        })();
      } else _r.appendChild(document.createTextNode(u));n.appendChild(_r);
    }r(n);(f == undefined || f === !0) && window.setTimeout(function () {
      t(n);
    }, 3e4);
  }function p(n, t) {
    i(n);n.appendChild(document.createTextNode(t));
  }function i(n) {
    if (n !== null && n !== undefined) while (n.firstChild) n.removeChild(n.firstChild);
  }function w(n, t) {
    var i = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var r = document.createElement("option");return r.value = n, r.text = t, r.selected = i, r;
  }function s(n) {
    return typeof n == "string" && (n = document.getElementById(n)), n.value;
  }function b(n, t) {
    typeof n == "string" && (n = document.getElementById(n));n.value = t;
  }function u(n, t) {
    typeof n == "string" && (n = document.getElementById(n));i(n);n.appendChild(document.createTextNode(t));
  }function h(n) {
    var i = n.replace("nav-", ""),
        t = document.querySelectorAll("#menuTabs > li > a");if (t.length > 0) for (var _i4 = 0; _i4 < t.length; _i4++) {
      var _r2 = t.item(_i4);_r2.id === n ? _r2.parentElement.classList.add("is-active") : _r2.parentElement.classList.remove("is-active");
    }f("#views > section", i);
  }function k(n, t, i) {
    c(n, "nav-" + i);f(t, i);
  }function c(n, t) {
    var i = document.querySelectorAll(n);if (i.length > 0) for (var _n = 0; _n < i.length; _n++) {
      var _r3 = i.item(_n);_r3.id === t ? _r3.classList.add("is-active") : _r3.classList.remove("is-active");
    }
  }function f(n, i) {
    var u = document.querySelectorAll(n);if (u.length > 0) for (var _n2 = 0; _n2 < u.length; _n2++) {
      var _f2 = u.item(_n2);_f2.id === i ? r(_f2) : t(_f2);
    }
  }function d(n) {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      var t;
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return fetch(n, { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-cache", credentials: "include" });

          case 2:
            t = context$3$0.sent;

            if (t.ok) {
              context$3$0.next = 5;
              break;
            }

            throw new Error(t.statusText);

          case 5:
            context$3$0.next = 7;
            return t.text();

          case 7:
            return context$3$0.abrupt("return", context$3$0.sent);

          case 8:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function g(n) {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      var t;
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return fetch(n, { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-cache", credentials: "include" });

          case 2:
            t = context$3$0.sent;

            if (t.ok) {
              context$3$0.next = 5;
              break;
            }

            throw new Error(t.statusText);

          case 5:
            context$3$0.next = 7;
            return t.json();

          case 7:
            return context$3$0.abrupt("return", context$3$0.sent);

          case 8:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function nt(n, t) {
    return fetch(n, { method: "POST", body: JSON.stringify(t), cache: "no-cache", headers: { "Content-Type": "application/json" }, credentials: "include" }).then(function (n) {
      if (!n.ok) throw new Error(n.statusText);return n.json();
    });
  }function tt(n, t) {
    return fetch(n, { method: "POST", body: t !== null ? JSON.stringify(t) : "", cache: "no-cache", headers: { "Content-Type": "application/json" }, credentials: "include" }).then(function (n) {
      return n;
    });
  }function it(n) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }function rt(n) {
    if (n instanceof Date) return n.toLocaleDateString("en-us");var t = new Date(n);return t.toLocaleDateString("en-US");
  }function ut(n) {
    return n instanceof Date ? n.toLocaleString("en-us") : new Date(n).toLocaleString("en-US");
  }function ft(n, t, i) {
    typeof n == "string" && (n = document.getElementById(n));var r = n;r.tagName.toLowerCase() === "select" ? r.parentElement.classList.remove("is-danger") : r.classList.remove("is-danger");var u = s(r).trim();return u.length == 0 ? (r.tagName.toLowerCase() === "select" ? r.parentElement.classList.add("is-danger") : r.classList.add("is-danger"), o(t, i), r.focus(), r.scrollTo(), "") : u;
  }function et(n, t) {
    typeof n == "string" && (n = document.getElementById(n));var i = n;i.disabled = t;i.classList.toggle("is-loading", t);
  }function ot(n) {
    var i = document.createElement("li");n.selected && i.classList.add("is-active");var t = document.createElement("a");if ((t.id = n.id, t.onclick = function () {
      l(n);
    }, n.icon.length > 0)) {
      var _i5 = document.createElement("span");_i5.classList.add("icon");_i5.classList.add(Transaction.app_input_size);var _r4 = document.createElement("i"),
          _u = n.icon.split(" ");var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _u[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _n3 = _step.value;
          _r4.classList.add(_n3);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      _i5.appendChild(_r4);t.appendChild(_i5);
    }return t.appendChild(document.createTextNode(n.label)), i.appendChild(t), i;
  }function l(n) {
    u("menuTitle", n.title);u("menuSubTitle", n.subTitle);h(n.id);document.getElementById(n.autofocusId).focus();
  }function st(t, i) {
    var r = document.getElementById(t);var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = i[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _t2 = _step2.value;
        r.appendChild(n.Create_Menu_Element(_t2));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }function ht() {
    return (navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf("OPR")) != -1 ? "Opera" : navigator.userAgent.indexOf("Chrome") != -1 ? "Chrome" : navigator.userAgent.indexOf("Safari") != -1 ? "Safari" : navigator.userAgent.indexOf("Firefox") != -1 ? "Firefox" : navigator.userAgent.indexOf("MSIE") != -1 || !!document.DOCUMENT_NODE == !0 ? "IE" : "unknown";
  }function ct(n) {
    var t = "/",
        i = window.location.pathname.toLowerCase().indexOf(n);return i == 0 && (t = n + "/"), t;
  }function lt(n) {
    var t = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var i = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    var r = document.createElement("div");r.classList.add("level");var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = n[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _n4 = _step3.value;
        r.appendChild(e(_n4));
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (t.length > 0) {
      var _n5 = document.createElement("div");_n5.classList.add("level-left");r.appendChild(_n5);var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = t[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _t3 = _step4.value;
          _n5.appendChild(e(_t3));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }if (i.length > 0) {
      var _n6 = document.createElement("div");_n6.classList.add("level-right");r.appendChild(_n6);var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = i[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _t4 = _step5.value;
          _n6.appendChild(e(_t4));
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }return r;
  }function e(n) {
    var _i$classList;

    var i = document.createElement("div");(_i$classList = i.classList).add.apply(_i$classList, ["level-item"].concat(_toConsumableArray(n.classes)));var t = document.createElement("div");if ((i.appendChild(t), n.heading.length > 0)) {
      var _i6 = document.createElement("p");_i6.classList.add("heading");_i6.appendChild(document.createTextNode(n.heading));t.appendChild(_i6);
    }if (n.title_text.length > 0) {
      var _i7 = document.createElement("p");_i7.classList.add("title");_i7.appendChild(document.createTextNode(n.title_text));t.appendChild(_i7);
    } else n.title !== null && t.appendChild(n.title);return i;
  }function at(n, t, i) {
    var r = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];
    var u = arguments.length <= 4 || arguments[4] === undefined ? -1 : arguments[4];
    n !== "td" && n !== "th" && (n = "td");var f = document.createElement(n);return r.length > 0 && (f.style.width = r), t.length > 0 && f.appendChild(document.createTextNode(t)), i.length > 0 && f.classList.add(i), u > -1 && (f.colSpan = u), f;
  }n.Hide = t;n.Show = r;n.Show_Inline = a;n.Show_Inline_Flex = v;n.Show_Flex = y;n.Error_Show = o;n.Simple_Error_Show = p;n.Clear_Element = i;n.Create_Option = w;n.Get_Value = s;n.Set_Value = b;n.Set_Text = u;n.Show_Menu = h;n.Handle_Tabs = k;n.Activate_Inactivate_Selector = c;n.Show_Hide_Selector = f;n.Get_Empty = d;n.Get = g;n.Post = nt;n.Post_Empty = tt;n.Format_Amount = it;n.Format_Date = rt;n.Format_DateTime = ut;n.Validate_Text = ft;n.Toggle_Loading_Button = et;n.Create_Menu_Element = ot;n.Update_Menu = l;n.Build_Menu_Elements = st;n.CheckBrowser = ht;n.Get_Path = ct;n.Create_Centered_Level = lt;n.CreateTableCell = at;
})(Utilities || (Utilities = {})), (function (n) {
  "use strict";
  var t = function t() {
    _classCallCheck(this, t);

    this.label = "";this.value = "";
  };

  n.SimpleValue = t;
})(Utilities || (Utilities = {}));__awaiter = undefined && undefined.__awaiter || function (n, t, i, r) {
  function u(n) {
    return n instanceof i ? n : new i(function (t) {
      t(n);
    });
  }return new (i || (i = Promise))(function (i, f) {
    function o(n) {
      try {
        e(r.next(n));
      } catch (t) {
        f(t);
      }
    }function s(n) {
      try {
        e(r["throw"](n));
      } catch (t) {
        f(t);
      }
    }function e(n) {
      n.done ? i(n.value) : u(n.value).then(o, s);
    }e((r = r.apply(n, t || [])).next());
  });
}, (function (n) {
  function o() {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return n.Department.GetDepartments().then(function (t) {
              n.payment_types = [];n.controls = [];n.departments = t;n.DepartmentControl = n.Department.CreateDepartmentElement(n.departments);w();var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                var _loop = function () {
                  var t = _step6.value;
                  var i = n.payment_types.map(function (n) {
                    return n.payment_type_id;
                  });n.payment_types = n.payment_types.concat(t.payment_types.filter(function (n) {
                    return i.indexOf(n.payment_type_id) === -1;
                  }));var r = t.controls.map(function (n) {
                    return n.control_id;
                  });n.controls = n.controls.concat(t.controls.filter(function (n) {
                    return r.indexOf(n.control_id) === -1;
                  }));t.control_groups = n.ControlGroup.CreateControlGroups(t.controls);_iteratorNormalCompletion8 = true;
                  _didIteratorError8 = false;
                  _iteratorError8 = undefined;

                  try {
                    for (_iterator8 = t.payment_types[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                      var _t5 = _step8.value;
                      _t5.control_groups = n.ControlGroup.CreateControlGroups(_t5.controls);
                    }
                  } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
                        _iterator8["return"]();
                      }
                    } finally {
                      if (_didIteratorError8) {
                        throw _iteratorError8;
                      }
                    }
                  }
                };

                for (var _iterator6 = n.departments[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var _iteratorNormalCompletion8;

                  var _didIteratorError8;

                  var _iteratorError8;

                  var _iterator8, _step8;

                  _loop();
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                    _iterator6["return"]();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }

              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                var _loop2 = function () {
                  var t = _step7.value;
                  var i = n.controls.map(function (n) {
                    return n.control_id;
                  });n.controls = n.controls.concat(t.controls.filter(function (n) {
                    return i.indexOf(n.control_id) === -1;
                  }));
                };

                for (var _iterator7 = n.payment_types[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  _loop2();
                }
              } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
                    _iterator7["return"]();
                  }
                } finally {
                  if (_didIteratorError7) {
                    throw _iteratorError7;
                  }
                }
              }
            });

          case 2:
            context$3$0.next = 4;
            return n.GetAllNames().then(function (n) {
              var t = document.getElementById("nameFilter"),
                  i = document.getElementById("depositNameFilter");var _iteratorNormalCompletion9 = true;
              var _didIteratorError9 = false;
              var _iteratorError9 = undefined;

              try {
                for (var _iterator9 = n[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  var _n7 = _step9.value;
                  t.add(Utilities.Create_Option(_n7, _n7, !1)), i.add(Utilities.Create_Option(_n7, _n7, !1));
                }
              } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
                    _iterator9["return"]();
                  }
                } finally {
                  if (_didIteratorError9) {
                    throw _iteratorError9;
                  }
                }
              }
            });

          case 4:
            context$3$0.next = 6;
            return n.GetTransactionList(1);

          case 6:
            setInterval(function () {
              var i = new Date(),
                  t = i.getHours();t > 5 && t < 19 && n.GetTransactionList(n.current_page, !1);
            }, 3e5);
          case 7:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function s(t) {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return n.Data.TransactionData.GetSpecificTransaction(t).then(function (t) {
              console.log("transaction to show", t), n.currentReceipt = new n.Receipt(t), n.currentReceipt.ShowReceipt(t);
            });

          case 2:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function h(t) {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return n.Data.TransactionData.GetSpecificTransaction(t).then(function (t) {
              console.log("transaction to show", t), n.currentReceipt = new n.Receipt(t), n.ViewReceiptDetail();
            });

          case 2:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function u(t) {
    var i = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            n.current_page = t;context$3$0.next = 3;
            return n.Data.TransactionData.GetTransactionList().then(function (t) {
              n.transactions = t, n.Data.TransactionData.RenderTransactionList(t), console.log("transactions", n.transactions), Utilities.Toggle_Loading_Button(n.Data.TransactionData.reload_button, !1), i && n.ViewTransactions();
            });

          case 3:
            context$3$0.next = 5;
            return n.Data.TransactionData.GetTransactionPageCount().then(function (t) {
              n.page_count = t, ut();
            });

          case 5:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function c() {
    n.currentReceipt = new n.Receipt();var t = document.getElementById("linkReceiptInProgress");t.classList.remove("has-background-grey-light", "has-text-grey");t.style.cursor = "pointer";n.ViewReceiptDetail();
  }function l() {
    n.currentReceipt = new n.Receipt();n.currentReceipt = null;var t = document.getElementById("linkReceiptInProgress");t.classList.add("has-background-grey-light", "has-text-grey");t.style.cursor = "default";
  }function a() {}function v() {
    var n = "/",
        t = window.location.pathname.toLowerCase().indexOf("/clayfinancial");return t == 0 && (n = "/clayfinancial/"), n;
  }function y(t) {
    var i = n.payment_types.filter(function (n) {
      return n.payment_type_id === t;
    });return i.length === 1 ? i[0] : null;
  }function p(t) {
    var i = n.controls.filter(function (n) {
      return n.control_id === t;
    });return i.length === 1 ? i[0] : null;
  }function w() {
    var r = document.getElementById("departmentFilter");r.add(Utilities.Create_Option("", "All Departments", !0));var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = n.departments[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var _n8 = _step10.value;
        r.add(Utilities.Create_Option(_n8.department_id.toString(), _n8.name, !1));
      }
    } catch (err) {
      _didIteratorError10 = true;
      _iteratorError10 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
          _iterator10["return"]();
        }
      } finally {
        if (_didIteratorError10) {
          throw _iteratorError10;
        }
      }
    }

    var u = document.getElementById("nameFilter");u.add(Utilities.Create_Option("mine", "My Transactions", !0));u.add(Utilities.Create_Option("", "All Users", !1));var f = document.getElementById("depositNameFilter");f.add(Utilities.Create_Option("", "Select A Name to Deposit", !0));f.add(Utilities.Create_Option("mine", "My Transactions", !1));var t = document.getElementById("statusFilter");t.add(Utilities.Create_Option("", "All Statuses", !1));t.add(Utilities.Create_Option("i", "Incomplete", !0));t.add(Utilities.Create_Option("c", "Completed", !1));var i = document.getElementById("typeFilter");i.add(Utilities.Create_Option("", "All Types", !0));i.add(Utilities.Create_Option("R", "Receipts", !1));i.add(Utilities.Create_Option("D", "Deposits", !1));
  }function b(t) {
    var i = t || window.event;t.keyCode == 13 && (console.log("enter"), n.FilterTransactions());
  }function k() {
    n.department_id_filter = parseInt(Utilities.Get_Value("departmentFilter"));n.name_filter = Utilities.Get_Value("nameFilter");n.completed_filter = Utilities.Get_Value("statusFilter");n.transaction_type_filter = Utilities.Get_Value("typeFilter");n.transaction_number_filter = Utilities.Get_Value("transactionNumberFilter");n.modified_only_filter = document.getElementById("modifiedFilter").checked;n.GetTransactionList(1);
  }function d() {
    n.currentReceipt === null || f();
  }function r() {
    Utilities.Hide(n.deposit_view_container);Utilities.Hide(n.Data.TransactionData.transaction_view_container);Utilities.Hide(n.Data.TransactionData.action_container);Utilities.Hide(n.Receipt.receipt_container);
  }function f() {
    r();Utilities.Show(n.Data.TransactionData.action_container);
  }function g() {
    r();Utilities.Show(n.Receipt.receipt_container);
  }function nt() {
    r();Utilities.Show(n.Data.TransactionData.transaction_view_container);
  }function tt() {
    r();Utilities.Show(n.deposit_view_container);Utilities.Hide("createDepositButton");Utilities.Set_Value("depositNameFilter", "");
  }function it(t) {
    t.getAttribute("disabled") === null && u(n.current_page - 1);
  }function rt(t) {
    t.getAttribute("disabled") === null && u(n.current_page + 1);
  }function ut() {
    var t = document.getElementById("resultsPreviousPage"),
        i = document.getElementById("resultsNextPage");n.current_page === 1 ? t.setAttribute("disabled", "") : t.removeAttribute("disabled");n.page_count <= n.current_page ? i.setAttribute("disabled", "") : i.removeAttribute("disabled");var r = document.getElementById("resultsPaginationList");Utilities.Clear_Element(r);r.appendChild(ft());
  }function ft() {
    var u = n.current_page,
        f = n.page_count,
        r = document.createDocumentFragment();if ((u < 1 && (n.current_page = 1), u > f && (u = f), f < 8)) {
      for (var _n9 = 1; _n9 <= f; _n9++) {
        r.appendChild(t(_n9, _n9 === u));
      }return r;
    }if (u === 3) {
      for (var _n10 = 1; _n10 <= 4; _n10++) {
        r.appendChild(t(_n10, _n10 === u));
      }r.appendChild(i());for (var _n11 = f - 1; _n11 <= f; _n11++) {
        r.appendChild(t(_n11, _n11 === u));
      }return r;
    }if (u === f - 2) {
      for (var _n12 = 1; _n12 <= 2; _n12++) {
        r.appendChild(t(_n12, _n12 === u));
      }r.appendChild(i());for (var _n13 = f - 3; _n13 <= f; _n13++) {
        r.appendChild(t(_n13, _n13 === u));
      }return r;
    }if (u < 3 || u > f - 3) {
      for (var _n14 = 1; _n14 <= 3; _n14++) {
        r.appendChild(t(_n14, _n14 === u));
      }r.appendChild(i());for (var _n15 = f - 2; _n15 <= f; _n15++) {
        r.appendChild(t(_n15, _n15 === u));
      }return r;
    }r.appendChild(t(1, !1));r.appendChild(i());for (var _n16 = u - 1; _n16 <= u + 1; _n16++) {
      r.appendChild(t(_n16, _n16 === u));
    }return r.appendChild(i()), r.appendChild(t(f, !1)), r;
  }function t(t, i) {
    var u = document.createElement("li"),
        r = document.createElement("a");return r.classList.add("pagination-link"), r.setAttribute("aria-label", "Goto page " + t.toString()), i ? (r.classList.add("is-current"), r.setAttribute("aria-current", "page"), r.style.cursor = "default") : r.onclick = function () {
      n.GetTransactionList(t);var i = document.getElementById("transaction_list_view_header");i !== null && i.scrollIntoView(!0);
    }, r.appendChild(document.createTextNode(t.toString())), u.appendChild(r), u;
  }function i() {
    var t = document.createElement("li"),
        n = document.createElement("span");return n.classList.add("pagination-ellipsis"), n.innerHTML = "&hellip;", t.appendChild(n), t;
  }function et(n, t) {
    var r = document.createElement("tr"),
        i = document.createElement("td");return i.colSpan = n, i.appendChild(document.createTextNode(t)), r.appendChild(i), r;
  }function ot() {
    n.editing_control_data = null;n.editing_payment_method_data = null;document.getElementById("change_transaction").classList.add("is-active");
  }function st() {
    document.getElementById("change_transaction").classList.remove("is-active");
  }function ht(t, i, r) {
    Utilities.Set_Text("change_field_label", r);n.ShowChangeModal();n.Data.ControlData.GetAndDisplayControlHistory(t, i).then(function () {});
  }function ct(t, i, r, u) {
    Utilities.Set_Text("change_field_label", u);n.ShowChangeModal();n.Data.PaymentMethodData.GetAndDisplayHistory(t, r, i).then(function () {});
  }function lt() {
    Utilities.Toggle_Loading_Button("change_transaction_save", !0);var t = Utilities.Get_Value(n.reason_for_change_input).trim();if (t.length === 0) {
      var _t6 = document.getElementById(n.reason_for_change_input),
          _i8 = document.getElementById(n.reason_for_change_input_container);n.ControlGroup.UpdateInputError(_t6, _i8, "This is required.");Utilities.Toggle_Loading_Button("change_transaction_save", !1);return;
    }if (n.editing_control_data !== null) {
      if (!n.editing_control_data.Validate()) {
        Utilities.Toggle_Loading_Button("change_transaction_save", !1);return;
      }n.editing_control_data.reason_for_change = t;n.editing_control_data.SaveControlChanges();n.GetTransactionList(n.current_page);
    } else {
      if (!n.editing_payment_method_data.Validate()) {
        Utilities.Toggle_Loading_Button("change_transaction_save", !1);return;
      }n.editing_payment_method_data.reason_for_change = t;n.editing_payment_method_data.SaveChanges();n.GetTransactionList(n.current_page);
    }
  }function at() {
    var t = n.GetPath();return Utilities.Get(t + "API/Transaction/GetAllNames");
  }function e() {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      var t, _i9;

      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            Utilities.Hide("createDepositButton");Utilities.Set_Value("depositCount", "0");t = Utilities.Get_Value("depositNameFilter");

            if (!(t.length !== 0)) {
              context$3$0.next = 7;
              break;
            }

            _i9 = n.GetPath();
            context$3$0.next = 7;
            return Utilities.Get_Empty(_i9 + "API/Transaction/GetDepositCount?name=" + t).then(function (n) {
              var t = parseInt(n);Utilities.Set_Value("depositCount", n);t > 0 && Utilities.Show("createDepositButton");
            });

          case 7:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }function vt() {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            Utilities.Toggle_Loading_Button("createDepositButton", !0);context$3$0.next = 3;
            return e().then(function () {
              var t = parseInt(Utilities.Get_Value("depositCount"));if (!isNaN(t) && t > 0) {
                var _t7 = Utilities.Get_Value("depositNameFilter"),
                    _i10 = n.GetPath();Utilities.Post(_i10 + "API/Transaction/CreateDeposit?selected_user_display_name=" + _t7, null).then(function (t) {
                  var i = t.transaction_id;n.ShowReceiptDetail(i);n.GetTransactionList(n.current_page, !1);Utilities.Toggle_Loading_Button("createDepositButton", !1);
                }, function (n) {
                  console.log("error!", n), Utilities.Toggle_Loading_Button("createDepositButton", !1);
                });
              } else {
                Utilities.Toggle_Loading_Button("createDepositButton", !1);alert("The Receipts ready for deposit was updated, a deposit can not be created at this time.");return;
              }
            });

          case 3:
          case "end":
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }n.app_input_size = "is-normal";n.error_scrolled = !1;n.departments = [];n.payment_types = [];n.controls = [];n.transactions = [];n.currentReceipt = null;n.DepartmentControl = null;n.DepartmentControlContainer = null;n.current_page = 1;n.page_count = 0;n.department_id_filter = -1;n.name_filter = "mine";n.completed_filter = "i";n.transaction_type_filter = "";n.modified_only_filter = !1;n.transaction_number_filter = "";n.editing_control_data = null;n.editing_payment_method_data = null;n.reason_for_change_input = "reason_for_change";n.reason_for_change_input_container = "reason_for_change_container";n.change_edit_container = "change_edit_container";n.change_transaction_history_table_header = "change_transaction_history_header";n.change_transaction_history_table_body = "change_transaction_history_table";n.deposit_view_container = "deposit_view";n.Start = o;n.ShowReceipt = s;n.ShowReceiptDetail = h;n.GetTransactionList = u;n.NewReceipt = c;n.ResetReceipt = l;n.NewDeposit = a;n.GetPath = v;n.FindPaymentType = y;n.FindControl = p;n.SearchOnEnter = b;n.FilterTransactions = k;n.ViewReceiptInProgress = d;n.ViewReceiptDetail = f;n.ViewPrintableReceipt = g;n.ViewTransactions = nt;n.ViewDeposit = tt;n.PreviousPage = it;n.NextPage = rt;n.CreateMessageRow = et;n.ShowChangeModal = ot;n.CloseChangeModal = st;n.LoadControlDataChange = ht;n.LoadPaymentTypeDataChange = ct;n.SaveChanges = lt;n.GetAllNames = at;n.GetDepositCount = e;n.CreateDeposit = vt;
})(Transaction || (Transaction = {})), (function (n) {
  var t = function t(n, _t, i) {
    var _classes;

    _classCallCheck(this, t);

    this.classes = [];this.heading = "";this.title = null;this.title_text = "";this.heading = n;this.title = i;_t.length > 0 && (this.title_text = _t, this.title = null);
    for (var _len = arguments.length, r = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      r[_key - 3] = arguments[_key];
    }

    r.length > 0 && (_classes = this.classes).push.apply(_classes, r);
  };

  n.LevelItem = t;
})(Utilities || (Utilities = {})), (function (n) {
  var t = (function () {
    function t() {
      _classCallCheck(this, t);

      this.percent_used = 0;this.controls = [];
    }

    _createClass(t, [{
      key: "CreateControlData",
      value: function CreateControlData(t) {
        var i = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
        var u = [],
            r = document.createElement("div");r.classList.add("columns", "is-multiline");t.appendChild(r);var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = this.controls[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var _t8 = _step11.value;
            var f = new n.Data.ControlData(_t8, -1, i);u.push(f);r.appendChild(f.container_element);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
              _iterator11["return"]();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return u;
      }
    }], [{
      key: "CreateControlGroups",
      value: function CreateControlGroups(i) {
        var r = [],
            u = new t();var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
          for (var _iterator12 = i[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var _t9 = _step12.value;
            _t9.is_active && (_t9.rendered_input_element = n.Control.CreateControl(_t9), u.controls.push(_t9));
          }
        } catch (err) {
          _didIteratorError12 = true;
          _iteratorError12 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
              _iterator12["return"]();
            }
          } finally {
            if (_didIteratorError12) {
              throw _iteratorError12;
            }
          }
        }

        return r.push(u), r;
      }
    }, {
      key: "CreateSavedControlGroups",
      value: function CreateSavedControlGroups(i) {
        var r = [],
            u = new t();var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = i[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var _t10 = _step13.value;
            _t10.control.rendered_input_element = n.Control.CreateSavedControl(_t10), u.controls.push(_t10.control);
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13["return"]) {
              _iterator13["return"]();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }

        return r.push(u), r;
      }
    }, {
      key: "CreateInputFieldContainerByControl",
      value: function CreateInputFieldContainerByControl(n, t) {
        var i = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return this.CreateInputFieldContainer(t, n.label, i, n.render_hints);
      }
    }, {
      key: "CreateInputFieldContainer",
      value: function CreateInputFieldContainer(t, i) {
        var r = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var u = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];
        var f = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var o = null;if (t.getAttribute("transaction_id") !== null) {
          (function () {
            var r = t.getAttribute("transaction_id"),
                u = t.getAttribute("control_data_id");if (u !== null) o = function () {
              n.LoadControlDataChange(u, r, i);
            };else {
              (function () {
                var u = t.getAttribute("payment_method_data_id"),
                    f = t.getAttribute("is_cash").toLowerCase() === "true";o = function () {
                  n.LoadPaymentTypeDataChange(u, f, r, i);
                };
              })();
            }
          })();
        }o !== null && (t.onclick = function () {
          o();
        });var e = document.createElement("div");e.classList.add("field");var s = document.createElement("label");if ((s.classList.add("label", n.app_input_size), i.length > 0 ? s.appendChild(document.createTextNode(i)) : s.innerHTML = "&nbsp;", e.appendChild(s), t.getAttribute("transaction_id") !== null)) {
          var _n17 = document.createElement("a");_n17.style.marginLeft = ".5em";_n17.style.fontSize = ".75em";_n17.style.fontWeight = "400";_n17.onclick = function () {
            o();
          };_n17.appendChild(document.createTextNode("edit"));s.appendChild(_n17);
        }var h = document.createElement("div");if ((h.classList.add("control"), h.appendChild(t), e.appendChild(h), f)) {
          var _n18 = document.createElement("p");_n18.classList.add("help", "guide");e.appendChild(_n18);
        }var c = document.createElement("p");if ((c.classList.add("help", "is-danger"), e.appendChild(c), r)) {
          var _n19 = document.createElement("div");return _n19.classList.add("column"), u.length > 0 && _n19.classList.add(u), _n19.appendChild(e), _n19;
        }return u.length > 0 && e.classList.add(u), e;
      }
    }, {
      key: "CreateButtonlistFieldContainer",
      value: function CreateButtonlistFieldContainer(t, i) {
        var r = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var u = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];
        var f = document.createElement("div");f.classList.add("field");var e = document.createElement("label");e.classList.add("label", n.app_input_size);i.length > 0 ? e.appendChild(document.createTextNode(i)) : e.innerHTML = "&nbsp;";f.appendChild(e);var o = document.createElement("div");o.classList.add("control");var s = document.createElement("div");s.classList.add("buttons");var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          for (var _iterator14 = t[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var _n20 = _step14.value;
            s.appendChild(_n20);
          }
        } catch (err) {
          _didIteratorError14 = true;
          _iteratorError14 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion14 && _iterator14["return"]) {
              _iterator14["return"]();
            }
          } finally {
            if (_didIteratorError14) {
              throw _iteratorError14;
            }
          }
        }

        if ((o.appendChild(s), f.appendChild(o), r)) {
          var _n21 = document.createElement("div");return _n21.classList.add("column"), u.length > 0 && _n21.classList.add(u), _n21.appendChild(f), _n21;
        }return u.length > 0 && f.classList.add(u), f;
      }
    }, {
      key: "CreateSelectFieldContainerByControl",
      value: function CreateSelectFieldContainerByControl(n, t) {
        var i = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return this.CreateSelectFieldContainer(t, n.label, i, n.render_hints);
      }
    }, {
      key: "CreateSelectFieldContainer",
      value: function CreateSelectFieldContainer(t, i) {
        var r = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var u = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];
        var f = document.createElement("div");f.classList.add("field");r && (f.classList.add("column"), u.length > 0 && f.classList.add(u));var e = document.createElement("label");if ((e.classList.add("label", "is-normal"), e.appendChild(document.createTextNode(i)), f.appendChild(e), t.getAttribute("transaction_id") !== null)) {
          (function () {
            var r = document.createElement("a");r.style.marginLeft = ".5em";r.style.fontSize = ".75em";r.style.fontWeight = "400";var u = t.getAttribute("transaction_id"),
                f = t.getAttribute("control_data_id");r.onclick = function () {
              n.LoadControlDataChange(f, u, i);
            };r.appendChild(document.createTextNode("edit"));e.appendChild(r);
          })();
        }var o = document.createElement("div");o.classList.add("control");var s = document.createElement("div");s.classList.add("select", "is-normal");s.appendChild(t);o.appendChild(s);f.appendChild(o);var h = document.createElement("p");return h.classList.add("help", "is-danger"), f.appendChild(h), f;
      }
    }, {
      key: "CreateInput",
      value: function CreateInput(n, t, i, r) {
        var u = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];
        var f = document.createElement("input");return f.type = n, f.maxLength = t, f.classList.add("input", "is-normal"), f.type === "number" && (f.onwheel = function (n) {
          n.preventDefault();
        }, f.step = "0.01", f.min = "0"), f.placeholder = r, f.required = i, f.value = u, f;
      }
    }, {
      key: "UpdateSelectError",
      value: function UpdateSelectError(t) {
        var i = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
        var r = t.querySelector("p.help.is-danger"),
            u = t.querySelector("div.select");i.length === 0 ? (Utilities.Clear_Element(r), u.classList.remove("is-danger")) : (Utilities.Simple_Error_Show(r, i), u.classList.add("is-danger"), n.error_scrolled || (n.error_scrolled = !0, t.scrollIntoView(!0)));
      }
    }, {
      key: "UpdateInputError",
      value: function UpdateInputError(t, i) {
        var r = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
        var u = i.querySelector("p.help.is-danger");r.length === 0 ? (Utilities.Clear_Element(u), t.classList.remove("is-danger")) : (Utilities.Simple_Error_Show(u, r), t.classList.add("is-danger"), n.error_scrolled || (n.error_scrolled = !0, i.scrollIntoView(!0)));
      }
    }, {
      key: "UpdateInputGuide",
      value: function UpdateInputGuide(n) {
        var t = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
        var i = n.querySelector("p.help.guide");if (i === null) {
          console.log("UpdateInputGuide called, no guide elements found", n, t);return;
        }Utilities.Set_Text(i, t);
      }
    }, {
      key: "ValidateDropdown",
      value: function ValidateDropdown(n, i, r) {
        var u = "";return n.value === "-1" && (u = "You must choose one of these options."), r.indexOf(n.value) === -1 && u.length === 0 && (u = "Please select a valid value."), t.UpdateSelectError(i, u), u.length === 0;
      }
    }, {
      key: "ValidateDate",
      value: function ValidateDate(n, i) {
        var r = "";return n.valueAsDate === null && n.required && (r = "You must selected a date."), t.UpdateInputError(n, i, r), r.length === 0;
      }
    }, {
      key: "ValidateText",
      value: function ValidateText(n, i) {
        var r = "";return n.required && n.value.length === 0 && (r = "This field is required."), n.maxLength > 0 && n.value.length > n.maxLength && r.length === 0 && (r = "You entered " + n.value.length.toString() + " characters but " + n.maxLength.toString() + " is the maximum number of characters allowed."), t.UpdateInputError(n, i, r), r.length === 0;
      }
    }, {
      key: "ValidateNumber",
      value: function ValidateNumber(n, i) {
        var r = "";return n.value.length === 0 && (r = "You must enter a number. (No commas or $ allowed)."), n.valueAsNumber === NaN && r.length === 0 && (r = "Please enter Numbers and Decimal points only."), t.UpdateInputError(n, i, r), r.length === 0;
      }
    }, {
      key: "ValidateCount",
      value: function ValidateCount(n, i) {
        var r = "";return n.value.length === 0 && n.required && (r = "You must enter a number. (No commas, decimal points, or $ allowed)."), n.valueAsNumber === NaN && r.length === 0 && (r = "Please enter Numbers only."), n.valueAsNumber < 0 && (r = "This value must be 0 or greater."), t.UpdateInputError(n, i, r), r.length === 0;
      }
    }, {
      key: "ValidateMoney",
      value: function ValidateMoney(n, i) {
        var r = "";n.value.length === 0 && (r = "You must enter a number. (No commas or $ allowed).");n.valueAsNumber === NaN && r.length === 0 && (r = "Please enter Numbers and Decimal points only.");n.valueAsNumber < 0 && r.length === 0 && (r = "Negative numbers are not allowed.");var u = n.value.split(".");return u.length === 2 && r.length === 0 && u[1].length > 2 && (r = "Too many digits after the decimal place. Amounts are limited to 2 digits after the decimal place."), t.UpdateInputError(n, i, r), r.length === 0;
      }
    }]);

    return t;
  })();

  n.ControlGroup = t;
})(Transaction || (Transaction = {}));__awaiter = undefined && undefined.__awaiter || function (n, t, i, r) {
  function u(n) {
    return n instanceof i ? n : new i(function (t) {
      t(n);
    });
  }return new (i || (i = Promise))(function (i, f) {
    function o(n) {
      try {
        e(r.next(n));
      } catch (t) {
        f(t);
      }
    }function s(n) {
      try {
        e(r["throw"](n));
      } catch (t) {
        f(t);
      }
    }function e(n) {
      n.done ? i(n.value) : u(n.value).then(o, s);
    }e((r = r.apply(n, t || [])).next());
  });
}, (function (n) {
  var t;(function (t) {
    var i = (function () {
      function i(n, t, _i, r) {
        if (t === undefined) t = false;
        var u = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

        _classCallCheck(this, i);

        this.payment_method_data_id = -1;this.prior_payment_method_data_id = -1;this.transaction_payment_type_id = -1;this.transaction_id = -1;this.cash_amount = 0;this.check_amount = 0;this.check_count = 0;this.check_number = "";this.check_from = "";this.paying_for = "";this.is_active = !0;this.added_after_save = !1;this.modified_by = "";this.modified_on = new Date();this.reason_for_change = "";this.error_text = "";this.is_cash = !1;this.show_cancel = !1;this.cash_amount_input_element = null;this.cash_amount_input_element_container = null;this.check_amount_input_element = null;this.check_amount_input_element_container = null;this.check_count_input_element = null;this.check_count_input_element_container = null;this.check_number_input_element = null;this.check_number_input_element_container = null;this.paying_for_input_element = null;this.paying_for_input_element_container = null;this.check_from_input_element = null;this.check_from_input_element_container = null;this.add_check_button_element = null;this.cancel_check_button_element = null;this.check_buttons_container_element = null;this.payment_method_change = function () {};this.validate_money_regex = "(?=.*?d)^$?(([1-9]d{0,2}(,d{3})*)|d+)?(.d{1,2})?$";this.control_to_render = null;this.is_cash = n;this.show_cancel = t;this.payment_method_data_id = _i;this.payment_method_change = r;n ? this.RenderCashControls(u) : this.RenderCheckControls(u);
      }

      _createClass(i, [{
        key: "Validate",
        value: function Validate() {
          return this.is_cash ? this.ValidateCash() : this.ValidateCheck();
        }
      }, {
        key: "ValidateCash",
        value: function ValidateCash() {
          var n = !0,
              t = this.ValidateCashAmount();return !t && n && (n = t), n;
        }
      }, {
        key: "ValidateCashAmount",
        value: function ValidateCashAmount() {
          return n.ControlGroup.ValidateMoney(this.cash_amount_input_element, this.cash_amount_input_element_container);
        }
      }, {
        key: "ValidateCheck",
        value: function ValidateCheck() {
          var t = !0,
              n = this.ValidateCheckAmount();return !n && t && (t = n), n = this.ValidateCheckCount(), !n && t && (t = n), n = this.ValidateCheckNumber(), !n && t && (t = n), n = this.ValidateCheckFrom(), !n && t && (t = n), n = this.ValidatePayingFor(), !n && t && (t = n), t;
        }
      }, {
        key: "ValidateCheckAmount",
        value: function ValidateCheckAmount() {
          return n.ControlGroup.ValidateMoney(this.check_amount_input_element, this.check_amount_input_element_container);
        }
      }, {
        key: "ValidateCheckCount",
        value: function ValidateCheckCount() {
          return n.ControlGroup.ValidateCount(this.check_count_input_element, this.check_count_input_element_container);
        }
      }, {
        key: "ValidateCheckNumber",
        value: function ValidateCheckNumber() {
          var i = this.check_number_input_element,
              t = "";return i.value.length > 0 && this.check_amount === 0 && (t = "This field should only be used if a check is entered."), i.value.length === 0 && this.check_amount > 0 && this.check_count === 1 && (t = "A check number is required when you enter a check amount and set the check count to 1 check."), i.value.length > 50 && (t = "The check number can be at most 50 characters long."), n.ControlGroup.UpdateInputError(this.check_number_input_element, this.check_number_input_element_container, t), t.length === 0;
        }
      }, {
        key: "ValidatePayingFor",
        value: function ValidatePayingFor() {
          var i = this.paying_for_input_element,
              t = "";return i.value.length > 0 && this.check_amount === 0 && (t = "This field should only be used if a check amount is entered."), i.value.length > 500 && (t = "This field can be at most 500 characters long."), n.ControlGroup.UpdateInputError(this.paying_for_input_element, this.paying_for_input_element_container, t), t.length === 0;
        }
      }, {
        key: "ValidateCheckFrom",
        value: function ValidateCheckFrom() {
          var i = this.check_from_input_element,
              t = "";return i.value.length > 0 && this.check_amount === 0 && (t = "This field should only be used if a check amount is entered."), i.value.length === 0 && this.check_amount > 0 && this.check_count === 1 && (t = "This field is required if you enter a check amount and set the check count to 1 check."), i.value.length > 500 && (t = "This field can be at most 500 characters long."), n.ControlGroup.UpdateInputError(this.check_from_input_element, this.check_from_input_element_container, t), t.length === 0;
        }
      }, {
        key: "RenderCashControls",
        value: function RenderCashControls(t) {
          var _this = this;

          var i = document.createElement("div");i.classList.add("columns");this.cash_amount_input_element = n.ControlGroup.CreateInput("number", 15, !0, "0");t === null ? this.cash_amount_input_element.oninput = function () {
            _this.cash_amount = 0, _this.ValidateCashAmount() && (_this.cash_amount = _this.cash_amount_input_element.valueAsNumber), _this.payment_method_change();
          } : (this.cash_amount_input_element.value = t.cash_amount.toString(), this.cash_amount_input_element.setAttribute("payment_method_data_id", t.payment_method_data_id.toString()), this.cash_amount_input_element.setAttribute("transaction_id", t.transaction_id.toString()), this.cash_amount_input_element.setAttribute("is_cash", "true"));this.cash_amount_input_element_container = n.ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", !0, "is-one-quarter");i.appendChild(this.cash_amount_input_element_container);this.control_to_render = i;
        }
      }, {
        key: "RenderCheckControls",
        value: function RenderCheckControls(t) {
          var _this2 = this;

          var i = document.createElement("div");if ((i.classList.add("columns", "is-multiline", "check"), this.check_amount_input_element = n.ControlGroup.CreateInput("number", 15, !1, "0"), t === null ? this.check_amount_input_element.oninput = function () {
            _this2.check_amount = 0, _this2.ValidateCheckAmount() && (_this2.check_amount = _this2.check_amount_input_element.valueAsNumber, _this2.check_amount > 0 ? (Utilities.Show_Flex(_this2.check_buttons_container_element), _this2.check_count_input_element.required = !0) : (Utilities.Hide(_this2.check_buttons_container_element), _this2.check_count_input_element.required = !1)), _this2.payment_method_change();
          } : (this.check_amount_input_element.readOnly = !0, this.check_amount_input_element.value = t.check_amount.toString(), this.check_amount_input_element.setAttribute("payment_method_data_id", t.payment_method_data_id.toString()), this.check_amount_input_element.setAttribute("transaction_id", t.transaction_id.toString()), this.check_amount_input_element.setAttribute("is_cash", "false")), this.check_count_input_element = n.ControlGroup.CreateInput("number", 5, !1, "# of Checks"), this.check_count_input_element.step = "1", this.check_count_input_element.min = "0", t === null ? this.check_count_input_element.oninput = function (t) {
            if (_this2.ValidateCheckCount()) if ((_this2.check_count = t.target.valueAsNumber, _this2.check_amount > 0)) switch (_this2.check_count) {case 0:
                n.ControlGroup.UpdateInputGuide(_this2.check_count_input_element_container, "Partial Check");break;case 1:
                n.ControlGroup.UpdateInputGuide(_this2.check_count_input_element_container, "Single Check");break;default:
                n.ControlGroup.UpdateInputGuide(_this2.check_count_input_element_container, "Bulk Check");} else n.ControlGroup.UpdateInputGuide(_this2.check_count_input_element_container, "");else n.ControlGroup.UpdateInputGuide(_this2.check_count_input_element_container, "");_this2.payment_method_change();
          } : (this.check_count_input_element.readOnly = !0, this.check_count_input_element.value = t.check_count.toString(), this.check_count_input_element.setAttribute("payment_method_data_id", t.payment_method_data_id.toString()), this.check_count_input_element.setAttribute("transaction_id", t.transaction_id.toString()), this.check_count_input_element.setAttribute("is_cash", "false")), this.check_number_input_element = n.ControlGroup.CreateInput("text", 50, !1, "Check Number"), t === null ? this.check_number_input_element.oninput = function (n) {
            _this2.ValidateCheckNumber() && (_this2.check_number = n.target.value);
          } : (this.check_number_input_element.readOnly = !0, this.check_number_input_element.value = t.check_number, this.check_number_input_element.setAttribute("payment_method_data_id", t.payment_method_data_id.toString()), this.check_number_input_element.setAttribute("transaction_id", t.transaction_id.toString()), this.check_number_input_element.setAttribute("is_cash", "false")), this.paying_for_input_element = n.ControlGroup.CreateInput("text", 500, !1, "Check Paying For"), t === null ? this.paying_for_input_element.oninput = function (n) {
            _this2.ValidatePayingFor() && (_this2.paying_for = n.target.value);
          } : (this.paying_for_input_element.readOnly = !0, this.paying_for_input_element.value = t.paying_for, this.paying_for_input_element.setAttribute("payment_method_data_id", t.payment_method_data_id.toString()), this.paying_for_input_element.setAttribute("transaction_id", t.transaction_id.toString()), this.paying_for_input_element.setAttribute("is_cash", "false")), this.check_from_input_element = n.ControlGroup.CreateInput("text", 500, !1, "Check From"), t === null ? this.check_from_input_element.oninput = function (n) {
            _this2.ValidateCheckFrom() && (_this2.check_from = n.target.value);
          } : (this.check_from_input_element.readOnly = !0, this.check_from_input_element.value = t.check_from, this.check_from_input_element.setAttribute("payment_method_data_id", t.payment_method_data_id.toString()), this.check_from_input_element.setAttribute("transaction_id", t.transaction_id.toString()), this.check_from_input_element.setAttribute("is_cash", "false")), this.add_check_button_element = document.createElement("button"), this.add_check_button_element.classList.add("button", "is-info", n.app_input_size), this.add_check_button_element.appendChild(document.createTextNode("Add Another Check")), this.check_amount_input_element_container = n.ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", !0, "is-one-quarter"), i.appendChild(this.check_amount_input_element_container), this.check_count_input_element_container = n.ControlGroup.CreateInputFieldContainer(this.check_count_input_element, "# of Checks", !0, "is-2", !0), i.appendChild(this.check_count_input_element_container), this.check_number_input_element_container = n.ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", !0, "is-one-quarter"), i.appendChild(this.check_number_input_element_container), this.show_cancel)) {
            var _t11 = [];this.cancel_check_button_element = document.createElement("button");this.cancel_check_button_element.classList.add("button", "is-warning", n.app_input_size);this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));_t11.push(this.add_check_button_element);_t11.push(this.cancel_check_button_element);this.check_buttons_container_element = n.ControlGroup.CreateButtonlistFieldContainer(_t11, "", !0, "is-one-quarter");
          } else this.check_buttons_container_element = n.ControlGroup.CreateInputFieldContainer(this.add_check_button_element, "", !0, "is-one-quarter"), t === null && this.check_buttons_container_element.classList.add("hide");i.appendChild(this.check_buttons_container_element);this.paying_for_input_element_container = n.ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", !0, "is-half");t === null && (this.paying_for_input_element_container.style.display = "none");i.appendChild(this.paying_for_input_element_container);this.check_from_input_element_container = n.ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", !0, "is-half");i.appendChild(this.check_from_input_element_container);this.control_to_render = i;
        }
      }, {
        key: "SaveChanges",
        value: function SaveChanges() {
          var _this3 = this;

          var t = n.GetPath();Utilities.Post_Empty(t + "API/Transaction/EditPaymentMethod", this).then(function (t) {
            t.text().then(function (i) {
              i.length === 0 ? (n.CloseChangeModal(), n.ShowReceiptDetail(_this3.transaction_id), n.editing_control_data = null, n.editing_payment_method_data = null, n.GetTransactionList(n.current_page, !1)) : alert("There was a problem saving this change.\r\n" + t), Utilities.Toggle_Loading_Button("change_transaction_save", !1);
            });
          });
        }
      }], [{
        key: "GetHistory",
        value: function GetHistory(t, i) {
          var r = n.GetPath();return Utilities.Get(r + "API/Transaction/GetPaymentMethodHistory?payment_method_data_id=" + t + "&transaction_id=" + i);
        }
      }, {
        key: "GetAndDisplayHistory",
        value: function GetAndDisplayHistory(n, t, r) {
          return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$4$0() {
            return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
              while (1) switch (context$5$0.prev = context$5$0.next) {
                case 0:
                  context$5$0.next = 2;
                  return i.GetHistory(n, t).then(function (n) {
                    i.MarkDataToEdit(n, r), i.DisplayHistory(n, r), i.DisplayEdit();
                  });

                case 2:
                case "end":
                  return context$5$0.stop();
              }
            }, callee$4$0, this);
          }));
        }
      }, {
        key: "MarkDataToEdit",
        value: function MarkDataToEdit(i, r) {
          n.editing_control_data = null;n.editing_payment_method_data = null;var u = i.filter(function (n) {
            return n.is_active;
          });if (u.length === 1) {
            var f = u[0],
                _i11 = new t.PaymentMethodData(r, !1, f.payment_method_data_id, function () {});_i11.payment_method_data_id = f.payment_method_data_id;_i11.transaction_id = f.transaction_id;_i11.transaction_payment_type_id = f.transaction_payment_type_id;_i11.prior_payment_method_data_id = f.prior_payment_method_data_id;_i11.is_active = !0;r ? (_i11.cash_amount = f.cash_amount, _i11.cash_amount_input_element.valueAsNumber = f.cash_amount) : (_i11.check_amount = f.check_amount, _i11.check_amount_input_element.valueAsNumber = f.check_amount, _i11.check_count = f.check_count, _i11.check_count_input_element.valueAsNumber = f.check_count, _i11.check_from = f.check_from, _i11.check_from_input_element.value = f.check_from, _i11.check_number = f.check_number, _i11.check_number_input_element.value = f.check_number, _i11.paying_for = f.paying_for, _i11.paying_for_input_element.value = f.paying_for);n.editing_payment_method_data = _i11;
          } else alert("Invalid data stored in database for this transaction.");
        }
      }, {
        key: "DisplayEdit",
        value: function DisplayEdit() {
          if (n.editing_payment_method_data !== null) {
            var _t12 = document.getElementById(n.change_edit_container);Utilities.Clear_Element(_t12);_t12.classList.remove("columns");var _i12 = n.editing_payment_method_data;Utilities.Clear_Element(_i12.check_buttons_container_element);_t12.appendChild(_i12.control_to_render);Utilities.Set_Value(n.reason_for_change_input, "");
          }
        }
      }, {
        key: "CreateCashHistoryHeader",
        value: function CreateCashHistoryHeader() {
          var n = document.createElement("tr");return n.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%")), n.appendChild(Utilities.CreateTableCell("th", "Cash Amount", "has-text-right", "15%")), n.appendChild(Utilities.CreateTableCell("th", "", "", "35%")), n;
        }
      }, {
        key: "CreateCheckHistoryHeader",
        value: function CreateCheckHistoryHeader() {
          var n = document.createElement("tr");return n.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "10%")), n.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Check Amount", "has-text-right", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Check Count", "has-text-centered", "10%")), n.appendChild(Utilities.CreateTableCell("th", "Check #", "has-text-left", "10%")), n.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-left", "10%")), n.appendChild(Utilities.CreateTableCell("th", "Paying For", "has-text-left", "15%")), n;
        }
      }, {
        key: "DisplayHistory",
        value: function DisplayHistory(t, r) {
          var u = document.getElementById(n.change_transaction_history_table_header);Utilities.Clear_Element(u);r ? u.appendChild(i.CreateCashHistoryHeader()) : u.appendChild(i.CreateCheckHistoryHeader());var f = document.getElementById(n.change_transaction_history_table_body);Utilities.Clear_Element(f);var _iteratorNormalCompletion15 = true;
          var _didIteratorError15 = false;
          var _iteratorError15 = undefined;

          try {
            for (var _iterator15 = t[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
              var _n22 = _step15.value;
              r ? f.appendChild(i.CreateCashHistoryRow(_n22)) : f.appendChild(i.CreateCheckHistoryRow(_n22));
            }
          } catch (err) {
            _didIteratorError15 = true;
            _iteratorError15 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion15 && _iterator15["return"]) {
                _iterator15["return"]();
              }
            } finally {
              if (_didIteratorError15) {
                throw _iteratorError15;
              }
            }
          }
        }
      }, {
        key: "CreateCashHistoryRow",
        value: function CreateCashHistoryRow(n) {
          var t = document.createElement("tr");if (new Date(n.modified_on).getFullYear() < 1e3) {
            var _n23 = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");_n23.colSpan = 3;t.appendChild(_n23);
          } else t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(n.modified_on), "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.modified_by, "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.reason_for_change, "has-text-left"));return t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.cash_amount), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", "", "", "35%")), t;
        }
      }, {
        key: "CreateCheckHistoryRow",
        value: function CreateCheckHistoryRow(n) {
          var t = document.createElement("tr");if (new Date(n.modified_on).getFullYear() < 1e3) {
            var _n24 = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");_n24.colSpan = 3;t.appendChild(_n24);
          } else t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(n.modified_on), "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.modified_by, "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.reason_for_change, "has-text-left"));return t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.check_amount), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", n.check_count.toString(), "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.check_number, "has-text-left")), t.appendChild(Utilities.CreateTableCell("td", n.check_from, "has-text-left")), t.appendChild(Utilities.CreateTableCell("td", n.paying_for, "has-text-left")), t;
        }
      }]);

      return i;
    })();

    t.PaymentMethodData = i;
  })(t = n.Data || (n.Data = {}));
})(Transaction || (Transaction = {})), (function (n) {
  var t = (function () {
    function t() {
      _classCallCheck(this, t);

      this.control_groups = [];
    }

    _createClass(t, [{
      key: "Constructor",
      value: function Constructor() {}
    }]);

    return t;
  })();

  n.PaymentType = t;
})(Transaction || (Transaction = {})), (function (n) {
  var t = (function () {
    function t() {
      _classCallCheck(this, t);

      this.rendered_input_element = null;this.valid_values = [];this.is_printed = !1;
    }

    _createClass(t, [{
      key: "Constructor",
      value: function Constructor() {}
    }], [{
      key: "CreateControl",
      value: function CreateControl(n) {
        var i = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        switch (n.data_type) {case "date":case "text":
            return t.CreateInput(n, i);case "number":case "money":case "count":
            return t.CreateNumericInput(n, i);case "bigtext":
            return t.CreateTextArea(n, i);case "dropdown":
            return t.CreateSelect(n, i);}return null;
      }
    }, {
      key: "CreateSavedControl",
      value: function CreateSavedControl(n) {
        var i = t.CreateControl(n.control, n.value);return i.tagName.toLowerCase() !== "select" ? i.readOnly = !0 : i.disabled = !0, i.setAttribute("control_data_id", n.control_data_id.toString()), i.setAttribute("transaction_id", n.transaction_id.toString()), i;
      }
    }, {
      key: "CreateInput",
      value: function CreateInput(t, i) {
        var r = document.createElement("input");if ((r.type = t.data_type, r.maxLength = t.max_length, r.classList.add("input", n.app_input_size), r.placeholder = t.label, r.required = t.required, r.type === "date" && i !== null)) {
          var _n25 = i.split("/");if (_n25.length === 3) {
            var _t13 = _n25[2] + "-";_t13 += _n25[0].length === 1 ? "0" + _n25[0] : _n25[0];_t13 += "-";_t13 += _n25[1].length === 1 ? "0" + _n25[1] : _n25[1];r.value = _t13;
          } else r.value = i;
        } else r.value = i === null ? "" : i;return r.setAttribute("control_id", t.control_id.toString()), r;
      }
    }, {
      key: "CreateNumericInput",
      value: function CreateNumericInput(t, i) {
        var r = document.createElement("input");return r.type = "number", r.maxLength = t.max_length, r.classList.add("input", n.app_input_size), r.placeholder = "0", r.required = t.required, t.data_type === "count" ? (r.step = "1", r.min = "0", r.pattern = "[0-9]") : r.step = "any", r.value = i === null ? "" : i, r.setAttribute("control_id", t.control_id.toString()), r;
      }
    }, {
      key: "CreateTextArea",
      value: function CreateTextArea(t, i) {
        var r = document.createElement("textarea");return r.maxLength = t.max_length, r.classList.add("textarea", n.app_input_size), r.placeholder = t.label, r.required = t.required, r.rows = 4, r.value = i === null ? "" : i, r.setAttribute("control_id", t.control_id.toString()), r;
      }
    }, {
      key: "CreateSelect",
      value: function CreateSelect(n, t) {
        n.valid_values = n.value.split("|");var i = document.createElement("select");i.required = n.required;i.appendChild(Utilities.Create_Option("-1", "Select a " + n.label, !1));var _iteratorNormalCompletion16 = true;
        var _didIteratorError16 = false;
        var _iteratorError16 = undefined;

        try {
          for (var _iterator16 = n.valid_values[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
            var _n26 = _step16.value;
            var _t14 = Utilities.Create_Option(_n26, _n26, !1);i.appendChild(_t14);
          }
        } catch (err) {
          _didIteratorError16 = true;
          _iteratorError16 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion16 && _iterator16["return"]) {
              _iterator16["return"]();
            }
          } finally {
            if (_didIteratorError16) {
              throw _iteratorError16;
            }
          }
        }

        return i.value = t !== null ? t : "-1", i;
      }
    }]);

    return t;
  })();

  n.Control = t;
})(Transaction || (Transaction = {})), (function (n) {
  var t = (function () {
    function t() {
      _classCallCheck(this, t);

      this.organization = "";this.payment_types = [];this.controls = [];this.control_groups = [];
    }

    _createClass(t, [{
      key: "Constructor",
      value: function Constructor() {}
    }], [{
      key: "GetDepartments",
      value: function GetDepartments() {
        var t = n.GetPath();return Utilities.Get(t + "API/Transaction/Departments");
      }
    }, {
      key: "CreateDepartmentElement",
      value: function CreateDepartmentElement(n) {
        var t = document.createElement("select"),
            i = document.createElement("option");i.selected = !0;i.value = "-1";i.appendChild(document.createTextNode("Select a Department"));t.appendChild(i);var _iteratorNormalCompletion17 = true;
        var _didIteratorError17 = false;
        var _iteratorError17 = undefined;

        try {
          for (var _iterator17 = n[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
            var _n27 = _step17.value;
            if (_n27.is_active) {
              var _i13 = document.createElement("option");_i13.appendChild(document.createTextNode(_n27.name));_i13.value = _n27.department_id.toString();t.appendChild(_i13);
            }
          }
        } catch (err) {
          _didIteratorError17 = true;
          _iteratorError17 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion17 && _iterator17["return"]) {
              _iterator17["return"]();
            }
          } finally {
            if (_didIteratorError17) {
              throw _iteratorError17;
            }
          }
        }

        return t.selectedIndex = -1, t;
      }
    }, {
      key: "CreateDepartmentElementLevel",
      value: function CreateDepartmentElementLevel(n) {
        var t = document.createElement("div");t.classList.add("level");var i = document.createElement("div");i.classList.add("level-left");var r = document.createElement("div");r.classList.add("level-item", "has-text-centered");var u = document.createElement("div"),
            f = document.createElement("p");f.classList.add("heading");f.appendChild(document.createTextNode("Select Department"));var e = document.createElement("div");return e.classList.add("select"), e.appendChild(n), u.appendChild(f), u.appendChild(e), r.appendChild(u), i.appendChild(r), t.appendChild(i), t;
      }
    }, {
      key: "CreateDepartmentElementField",
      value: function CreateDepartmentElementField(t) {
        return n.ControlGroup.CreateSelectFieldContainer(t, "Department", !0, "is-one-half");
      }
    }, {
      key: "FindDepartment",
      value: function FindDepartment(t) {
        var i = n.departments.filter(function (n) {
          return n.department_id === t;
        });return i.length === 1 ? i[0] : null;
      }
    }]);

    return t;
  })();

  n.Department = t;
})(Transaction || (Transaction = {}));__awaiter = undefined && undefined.__awaiter || function (n, t, i, r) {
  function u(n) {
    return n instanceof i ? n : new i(function (t) {
      t(n);
    });
  }return new (i || (i = Promise))(function (i, f) {
    function o(n) {
      try {
        e(r.next(n));
      } catch (t) {
        f(t);
      }
    }function s(n) {
      try {
        e(r["throw"](n));
      } catch (t) {
        f(t);
      }
    }function e(n) {
      n.done ? i(n.value) : u(n.value).then(o, s);
    }e((r = r.apply(n, t || [])).next());
  });
}, (function (n) {
  var t;(function (t) {
    var i = (function () {
      function i(t, _i2, r) {
        var _this4 = this;

        _classCallCheck(this, i);

        this.control_data_id = -1;this.prior_control_data_id = -1;this.transaction_payment_type_id = -1;this.department_id = -1;this.transaction_id = -1;this.control_id = -1;this.control = null;this.payment_type_id = -1;this.payment_type_index = -1;this.value = "";this.is_active = !0;this.modified_on = new Date();this.modified_by = "";this.reason_for_change = "";this.error_text = "";this.selected_control = null;this.input_element = null;this.container_element = null;var u = t.rendered_input_element ? t.rendered_input_element.getAttribute("control_data_id") : null;if ((this.selected_control = t, this.control_id = t.control_id, this.input_element = r ? t.rendered_input_element.cloneNode(!0) : t.rendered_input_element ? t.rendered_input_element : n.Control.CreateControl(t), this.payment_type_id = _i2, u === null)) {
          var _n28 = this.input_element;_n28.type === "number" && (_n28.onwheel = function (n) {
            n.preventDefault();
          });this.input_element.oninput = function (n) {
            var i = n.target;if (_this4.Validate()) switch (t.data_type) {case "date":
                var n = i.valueAsDate;n.setMinutes(n.getTimezoneOffset());_this4.value = Utilities.Format_Date(n);break;case "number":
                _this4.value = i.valueAsNumber.toString();break;case "count":
                _this4.value = i.valueAsNumber.toString();i.value = i.valueAsNumber.toString();break;case "money":
                _this4.value = i.valueAsNumber.toString();break;default:
                _this4.value = i.value;}
          };
        }this.container_element = t.data_type === "dropdown" ? n.ControlGroup.CreateSelectFieldContainerByControl(t, this.input_element, !0) : n.ControlGroup.CreateInputFieldContainerByControl(t, this.input_element, !0);
      }

      _createClass(i, [{
        key: "Validate",
        value: function Validate() {
          switch (this.selected_control.data_type) {case "dropdown":
              return this.ValidateDropdown();case "count":
              return this.ValidateCount();case "date":
              return this.ValidateDate();case "number":
              return this.ValidateNumber();case "money":
              return this.ValidateMoney();case "text":case "bigtext":
              return this.ValidateText();default:
              return !1;}
        }
      }, {
        key: "ValidateDropdown",
        value: function ValidateDropdown() {
          return n.ControlGroup.ValidateDropdown(this.input_element, this.container_element, this.selected_control.valid_values);
        }
      }, {
        key: "ValidateDate",
        value: function ValidateDate() {
          return n.ControlGroup.ValidateDate(this.input_element, this.container_element);
        }
      }, {
        key: "ValidateText",
        value: function ValidateText() {
          return n.ControlGroup.ValidateText(this.input_element, this.container_element);
        }
      }, {
        key: "ValidateNumber",
        value: function ValidateNumber() {
          return n.ControlGroup.ValidateNumber(this.input_element, this.container_element);
        }
      }, {
        key: "ValidateCount",
        value: function ValidateCount() {
          return n.ControlGroup.ValidateCount(this.input_element, this.container_element);
        }
      }, {
        key: "ValidateMoney",
        value: function ValidateMoney() {
          return n.ControlGroup.ValidateMoney(this.input_element, this.container_element);
        }
      }, {
        key: "SaveControlChanges",
        value: function SaveControlChanges() {
          var _this5 = this;

          var t = n.GetPath();console.log("saving this control data", this);Utilities.Post(t + "API/Transaction/EditControls", this).then(function (t) {
            t.length > 0 ? alert("There was a problem saving this change.\r\n" + t) : (n.CloseChangeModal(), n.ShowReceiptDetail(_this5.transaction_id), n.editing_control_data = null), Utilities.Toggle_Loading_Button("change_transaction_save", !1);
          });
        }
      }, {
        key: "SetErrorText",
        value: function SetErrorText(t) {
          this.selected_control.data_type === "dropdown" ? n.ControlGroup.UpdateSelectError(this.container_element, t) : n.ControlGroup.UpdateInputError(this.input_element, this.container_element, t);
        }
      }], [{
        key: "GetControlHistory",
        value: function GetControlHistory(t, i) {
          var r = n.GetPath();return Utilities.Get(r + "API/Transaction/GetControlDataHistory?control_data_id=" + t + "&transaction_id=" + i);
        }
      }, {
        key: "GetAndDisplayControlHistory",
        value: function GetAndDisplayControlHistory(n, t) {
          return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function callee$4$0() {
            return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
              while (1) switch (context$5$0.prev = context$5$0.next) {
                case 0:
                  context$5$0.next = 2;
                  return i.GetControlHistory(n, t).then(function (n) {
                    i.MarkDataToEdit(n), i.DisplayControlHistory(n), i.DisplayControlToEdit();
                  });

                case 2:
                case "end":
                  return context$5$0.stop();
              }
            }, callee$4$0, this);
          }));
        }
      }, {
        key: "MarkDataToEdit",
        value: function MarkDataToEdit(i) {
          n.editing_control_data = null;n.editing_payment_method_data = null;var r = i.filter(function (n) {
            return n.is_active;
          });if (r.length === 1) {
            var _i14 = r[0],
                u = new t.ControlData(_i14.control, _i14.payment_type_id, !1);u.transaction_payment_type_id = _i14.transaction_payment_type_id;u.department_id = _i14.department_id;u.is_active = _i14.is_active;u.control_data_id = _i14.control_data_id;u.transaction_id = _i14.transaction_id;u.value = _i14.value;switch (_i14.control.data_type) {case "date":
                if (_i14.value !== "" && _i14.value !== null) {
                  var _n29 = _i14.value.split("/");if (_n29.length === 3) {
                    var _t15 = _n29[2] + "-";_t15 += _n29[0].length === 1 ? "0" + _n29[0] : _n29[0];_t15 += "-";_t15 += _n29[1].length === 1 ? "0" + _n29[1] : _n29[1];u.input_element.value = _t15;
                  }
                }break;default:
                u.input_element.value = _i14.value;}u.control = u.selected_control;n.editing_control_data = u;
          } else alert("Invalid data stored in database for this transaction.");
        }
      }, {
        key: "DisplayControlToEdit",
        value: function DisplayControlToEdit() {
          if (n.editing_control_data !== null) {
            var _t16 = document.getElementById(n.change_edit_container);Utilities.Clear_Element(_t16);_t16.classList.add("columns");var _i15 = n.editing_control_data;_t16.appendChild(_i15.container_element);Utilities.Set_Value(n.reason_for_change_input, "");
          }
        }
      }, {
        key: "CreateControlDataHistoryHeader",
        value: function CreateControlDataHistoryHeader() {
          var n = document.createElement("tr");return n.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%")), n.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%")), n.appendChild(Utilities.CreateTableCell("th", "Value", "has-text-left", "50%")), n;
        }
      }, {
        key: "DisplayControlHistory",
        value: function DisplayControlHistory(t) {
          var r = document.getElementById(n.change_transaction_history_table_header);Utilities.Clear_Element(r);r.appendChild(i.CreateControlDataHistoryHeader());var u = document.getElementById(n.change_transaction_history_table_body);Utilities.Clear_Element(u);var _iteratorNormalCompletion18 = true;
          var _didIteratorError18 = false;
          var _iteratorError18 = undefined;

          try {
            for (var _iterator18 = t[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
              var _n30 = _step18.value;
              u.appendChild(i.CreateControlDataHistoryRow(_n30));
            }
          } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion18 && _iterator18["return"]) {
                _iterator18["return"]();
              }
            } finally {
              if (_didIteratorError18) {
                throw _iteratorError18;
              }
            }
          }
        }
      }, {
        key: "CreateControlDataHistoryRow",
        value: function CreateControlDataHistoryRow(n) {
          var t = document.createElement("tr");if (new Date(n.modified_on).getFullYear() < 1e3) {
            var _n31 = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");_n31.colSpan = 3;t.appendChild(_n31);
          } else t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(n.modified_on), "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.modified_by, "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.reason_for_change, "has-text-left"));return t.appendChild(Utilities.CreateTableCell("td", n.value, "has-text-left")), t;
        }
      }]);

      return i;
    })();

    t.ControlData = i;
  })(t = n.Data || (n.Data = {}));
})(Transaction || (Transaction = {})), (function (n) {
  var t;(function (t) {
    var i = (function () {
      function i(n, t, _i3) {
        var r = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        _classCallCheck(this, i);

        this.transaction_payment_type_id = -1;this.transaction_id = -1;this.payment_type_id = -1;this.payment_type_index = -1;this.payment_type = null;this.control_data = [];this.added_after_save = !1;this.error_text = "";this.payment_method_data = [];this.payment_type_parent_container = null;this.payment_type_container = null;this.selected_payment_type = null;this.cancel_payment_type_button = null;this.add_another_payment_type_button = null;this.save_button = null;this.control_groups = [];this.total_cash_element = null;this.total_checks_element = null;this.total_number_checks_element = null;this.next_payment_method_id = 0;this.selected_payment_type = n;this.payment_type_parent_container = t;this.payment_type_id = n.payment_type_id;this.payment_type_index = r !== null ? r.payment_type_index : _i3;var u = document.createElement("li");u.style.display = "block";this.payment_type_container = u;r !== null ? (this.transaction_payment_type_id = r.transaction_payment_type_id, this.transaction_id = r.transaction_id, this.RenderSavedPaymentTypeControls(u, r), this.RenderSavedPaymentMethods(u, r)) : (this.RenderPaymentTypeControls(u), this.RenderPaymentMethods(u));this.RenderPaymentTypeFooter(u);r !== null && this.SavedPaymentMethodDataCalculateTotals(r.payment_method_data);this.payment_type_parent_container.appendChild(u);
      }

      _createClass(i, [{
        key: "Validate",
        value: function Validate() {
          var n = !0;var _iteratorNormalCompletion19 = true;
          var _didIteratorError19 = false;
          var _iteratorError19 = undefined;

          try {
            for (var _iterator19 = this.control_data[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
              var _t17 = _step19.value;
              var _i16 = _t17.Validate();!_i16 && n && (n = !1);
            }
          } catch (err) {
            _didIteratorError19 = true;
            _iteratorError19 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion19 && _iterator19["return"]) {
                _iterator19["return"]();
              }
            } finally {
              if (_didIteratorError19) {
                throw _iteratorError19;
              }
            }
          }

          var _iteratorNormalCompletion20 = true;
          var _didIteratorError20 = false;
          var _iteratorError20 = undefined;

          try {
            for (var _iterator20 = this.payment_method_data[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
              var _t18 = _step20.value;
              var _i17 = _t18.Validate();!_i17 && n && (n = !1);
            }
          } catch (err) {
            _didIteratorError20 = true;
            _iteratorError20 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion20 && _iterator20["return"]) {
                _iterator20["return"]();
              }
            } finally {
              if (_didIteratorError20) {
                throw _iteratorError20;
              }
            }
          }

          return n;
        }
      }, {
        key: "RenderPaymentTypeControls",
        value: function RenderPaymentTypeControls(n) {
          var _iteratorNormalCompletion21 = true;
          var _didIteratorError21 = false;
          var _iteratorError21 = undefined;

          try {
            for (var _iterator21 = this.selected_payment_type.control_groups[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
              var _control_data;

              var _t19 = _step21.value;
              (_control_data = this.control_data).push.apply(_control_data, _toConsumableArray(_t19.CreateControlData(n)));
            }
          } catch (err) {
            _didIteratorError21 = true;
            _iteratorError21 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion21 && _iterator21["return"]) {
                _iterator21["return"]();
              }
            } finally {
              if (_didIteratorError21) {
                throw _iteratorError21;
              }
            }
          }
        }
      }, {
        key: "CreateHeaderButton",
        value: function CreateHeaderButton(n) {
          var _i$classList2;

          var i = document.createElement("button");
          for (var _len2 = arguments.length, t = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            t[_key2 - 1] = arguments[_key2];
          }

          return i.appendChild(document.createTextNode(n)), (_i$classList2 = i.classList).add.apply(_i$classList2, ["button"].concat(t)), i;
        }
      }, {
        key: "RenderPaymentTypeFooter",
        value: function RenderPaymentTypeFooter(n) {
          var i = [];this.total_cash_element = document.createElement("span");this.total_cash_element.classList.add("title");this.total_cash_element.appendChild(document.createTextNode("$0.00"));this.total_checks_element = document.createElement("span");this.total_checks_element.classList.add("title");this.total_checks_element.appendChild(document.createTextNode("$0.00"));this.total_number_checks_element = document.createElement("span");this.total_number_checks_element.classList.add("title");this.total_number_checks_element.appendChild(document.createTextNode("0"));i.push(new Utilities.LevelItem("Total Cash", "", this.total_cash_element, "has-text-centered"));i.push(new Utilities.LevelItem("Total Checks", "", this.total_checks_element, "has-text-centered"));i.push(new Utilities.LevelItem("# Checks", "", this.total_number_checks_element, "has-text-centered"));this.add_another_payment_type_button = this.CreateHeaderButton("Add", "is-info");this.cancel_payment_type_button = this.CreateHeaderButton("Cancel", "is-warning");this.save_button = this.CreateHeaderButton("Preview & Save", "is-success");var t = document.createElement("div");t.classList.add("buttons");t.appendChild(this.add_another_payment_type_button);t.appendChild(this.cancel_payment_type_button);t.appendChild(this.save_button);var r = [];r.push(new Utilities.LevelItem("", "", t, "has-text-centered"));var u = Utilities.Create_Centered_Level(i, [], r);u.classList.add("has-background-grey-lighter");n.appendChild(u);
        }
      }, {
        key: "RenderPaymentMethods",
        value: function RenderPaymentMethods(n) {
          var t = document.createElement("fieldset"),
              i = document.createElement("legend");i.classList.add("label");i.appendChild(document.createTextNode("Payment Methods"));t.appendChild(i);this.AddCashPaymentMethod(t);this.AddCheckPaymentMethod(t);n.appendChild(t);
        }
      }, {
        key: "AddCheckPaymentMethod",
        value: function AddCheckPaymentMethod(n) {
          var _this6 = this;

          var i = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
          var r = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
          var u = new t.PaymentMethodData(!1, i, this.next_payment_method_id++, function () {
            _this6.PaymentMethodDataChanged();
          });n.appendChild(u.control_to_render);this.payment_method_data.push(u);r ? (Utilities.Set_Text(u.add_check_button_element, "Save this Check"), u.add_check_button_element.classList.remove("is-info"), u.add_check_button_element.classList.add("is-success"), u.add_check_button_element.onclick = function () {
            _this6.SavePaymentMethodData(u, u.add_check_button_element);
          }) : u.add_check_button_element.onclick = function () {
            _this6.AddCheckPaymentMethod(n, !0, r);
          };i && (u.cancel_check_button_element.onclick = function () {
            n.removeChild(u.control_to_render);var t = _this6.payment_method_data.findIndex(function (n) {
              return n.payment_method_data_id === u.payment_method_data_id;
            });t > -1 && _this6.payment_method_data.splice(t, 1);u = null;_this6.PaymentMethodDataChanged();
          });
        }
      }, {
        key: "AddCashPaymentMethod",
        value: function AddCashPaymentMethod(n) {
          var _this7 = this;

          var i = new t.PaymentMethodData(!0, !1, this.next_payment_method_id++, function () {
            _this7.PaymentMethodDataChanged();
          });n.appendChild(i.control_to_render);this.payment_method_data.push(i);
        }
      }, {
        key: "PaymentMethodDataChanged",
        value: function PaymentMethodDataChanged() {
          var n = 0,
              t = 0,
              i = 0;var _iteratorNormalCompletion22 = true;
          var _didIteratorError22 = false;
          var _iteratorError22 = undefined;

          try {
            for (var _iterator22 = this.payment_method_data[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
              var r = _step22.value;
              n += r.cash_amount, t += r.check_amount, i += r.check_count;
            }
          } catch (err) {
            _didIteratorError22 = true;
            _iteratorError22 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion22 && _iterator22["return"]) {
                _iterator22["return"]();
              }
            } finally {
              if (_didIteratorError22) {
                throw _iteratorError22;
              }
            }
          }

          this.total_cash_element.innerHTML = Utilities.Format_Amount(n);this.total_checks_element.innerHTML = Utilities.Format_Amount(t);this.total_number_checks_element.innerHTML = i.toString();
        }
      }, {
        key: "SavedPaymentMethodDataCalculateTotals",
        value: function SavedPaymentMethodDataCalculateTotals(n) {
          var t = 0,
              i = 0,
              r = 0;var _iteratorNormalCompletion23 = true;
          var _didIteratorError23 = false;
          var _iteratorError23 = undefined;

          try {
            for (var _iterator23 = n[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
              var _n32 = _step23.value;
              t += _n32.cash_amount, i += _n32.check_amount, r += _n32.check_count;
            }
          } catch (err) {
            _didIteratorError23 = true;
            _iteratorError23 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion23 && _iterator23["return"]) {
                _iterator23["return"]();
              }
            } finally {
              if (_didIteratorError23) {
                throw _iteratorError23;
              }
            }
          }

          this.total_cash_element.innerHTML = Utilities.Format_Amount(t);this.total_checks_element.innerHTML = Utilities.Format_Amount(i);this.total_number_checks_element.innerHTML = r.toString();
        }
      }, {
        key: "RenderSavedPaymentTypeControls",
        value: function RenderSavedPaymentTypeControls(t, i) {
          this.control_groups = n.ControlGroup.CreateSavedControlGroups(i.control_data);var _iteratorNormalCompletion24 = true;
          var _didIteratorError24 = false;
          var _iteratorError24 = undefined;

          try {
            for (var _iterator24 = this.control_groups[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
              var _control_data2;

              var _n33 = _step24.value;
              (_control_data2 = this.control_data).push.apply(_control_data2, _toConsumableArray(_n33.CreateControlData(t, !1)));
            }
          } catch (err) {
            _didIteratorError24 = true;
            _iteratorError24 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion24 && _iterator24["return"]) {
                _iterator24["return"]();
              }
            } finally {
              if (_didIteratorError24) {
                throw _iteratorError24;
              }
            }
          }
        }
      }, {
        key: "RenderSavedPaymentMethods",
        value: function RenderSavedPaymentMethods(n, t) {
          var i = document.createElement("fieldset"),
              r = document.createElement("legend");r.classList.add("label");r.appendChild(document.createTextNode("Payment Methods"));i.appendChild(r);var u = null,
              f = [],
              e = [].concat(_toConsumableArray(t.payment_method_data));e.sort(function (n, t) {
            return t.cash_amount - n.cash_amount;
          });do {
            var _n34 = e.shift();_n34.check_amount > 0 || _n34.check_number.length > 0 || _n34.check_count > 0 || _n34.check_from.length > 0 || _n34.paying_for.length > 0 ? f.push(_n34) : _n34.cash_amount > 0 || u === null ? u = _n34 : f.push(_n34);
          } while (e.length > 0);this.AddSavedCashPaymentMethod(i, u);var _iteratorNormalCompletion25 = true;
          var _didIteratorError25 = false;
          var _iteratorError25 = undefined;

          try {
            for (var _iterator25 = f[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
              var _n35 = _step25.value;
              this.AddSavedCheckPaymentMethod(i, _n35);
            }
          } catch (err) {
            _didIteratorError25 = true;
            _iteratorError25 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion25 && _iterator25["return"]) {
                _iterator25["return"]();
              }
            } finally {
              if (_didIteratorError25) {
                throw _iteratorError25;
              }
            }
          }

          n.appendChild(i);
        }
      }, {
        key: "AddSavedCheckPaymentMethod",
        value: function AddSavedCheckPaymentMethod(n, i) {
          var _this8 = this;

          var r = new t.PaymentMethodData(!1, !1, this.next_payment_method_id++, null, i);n.appendChild(r.control_to_render);this.payment_method_data.push(r);r.add_check_button_element.onclick = function () {
            _this8.AddCheckPaymentMethod(n, !0, !0);
          };
        }
      }, {
        key: "AddSavedCashPaymentMethod",
        value: function AddSavedCashPaymentMethod(n, i) {
          var r = new t.PaymentMethodData(!0, !1, this.next_payment_method_id++, null, i);n.appendChild(r.control_to_render);this.payment_method_data.push(r);
        }
      }, {
        key: "SavePaymentMethodData",
        value: function SavePaymentMethodData(t, i) {
          var _this9 = this;

          if ((Utilities.Toggle_Loading_Button(i, !0), t.Validate())) {
            t.transaction_id = this.transaction_id;t.payment_method_data_id = -1;t.transaction_payment_type_id = this.transaction_payment_type_id;var r = n.GetPath();Utilities.Post_Empty(r + "API/Transaction/AddPaymentMethod", t).then(function (t) {
              t.text().then(function (t) {
                if ((console.log("response text", t, t.length), Utilities.Toggle_Loading_Button(i, !1), t.length > 0)) {
                  alert("there was an error attempting to add this check, please refresh this web page and try again.");return;
                }n.ShowReceiptDetail(_this9.transaction_id);
              });
            });
          }
        }
      }, {
        key: "FindPaymentTypeControl",
        value: function FindPaymentTypeControl(n) {
          return this.control_data.find(function (t) {
            return t.control_id === n;
          });
        }
      }]);

      return i;
    })();

    t.PaymentTypeData = i;
  })(t = n.Data || (n.Data = {}));
})(Transaction || (Transaction = {})), (function (n) {
  var t = (function () {
    function t() {
      var _this10 = this;

      var i = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      _classCallCheck(this, t);

      this.currentTransaction = null;this.savedTransaction = null;this.view_container = null;this.receipt_number_element = null;this.county_manager_element = null;this.created_by_element = null;this.created_on_element = null;this.receipt_view_contents_element = null;this.receipt_view_totals_element = null;this.receipt_preview_controls_element = null;this.receipt_preview_cancel_button_element = null;this.receipt_preview_save_button_element = null;this.view_container = document.getElementById(t.receipt_container);this.receipt_number_element = document.getElementById("receipt_view_number");this.created_by_element = document.getElementById("receipt_created_by");this.county_manager_element = document.getElementById("receipt_view_county_manager");this.created_on_element = document.getElementById("receipt_view_date");this.receipt_view_contents_element = document.getElementById("receipt_view_contents");this.receipt_view_totals_element = document.getElementById("receipt_view_totals");this.currentTransaction = new n.Data.TransactionData("R", i);this.receipt_preview_controls_element = document.getElementById("receipt_preview_controls");this.receipt_preview_cancel_button_element = document.getElementById("receipt_view_cancel");this.receipt_preview_save_button_element = document.getElementById("receipt_view_save");this.receipt_preview_cancel_button_element.onclick = function () {
        n.ViewReceiptDetail();
      };this.receipt_preview_save_button_element.onclick = function () {
        _this10.currentTransaction.SaveTransactionData();
      };
    }

    _createClass(t, [{
      key: "ShowReceiptPreview",
      value: function ShowReceiptPreview() {
        var n = this.currentTransaction;this.UpdateReceipt(n);Utilities.Show(this.receipt_preview_controls_element);
      }
    }, {
      key: "ShowReceipt",
      value: function ShowReceipt(n) {
        this.UpdateReceipt(n);Utilities.Hide(this.receipt_preview_controls_element);
      }
    }, {
      key: "UpdateReceipt",
      value: function UpdateReceipt(t) {
        n.ViewPrintableReceipt();Utilities.Set_Text(this.created_on_element, Utilities.Format_Date(t.created_on));Utilities.Set_Text(this.receipt_number_element, t.transaction_number);Utilities.Set_Text(this.created_by_element, t.created_by_display_name);Utilities.Set_Text(this.county_manager_element, t.county_manager_name);this.DisplayDepartmentControls(t);t.transaction_type == "R" ? this.CreatePaymentTypeDisplay(t) : (this.CreateTransactionViewDisplay(t), t.transaction_type === "C");
      }
    }, {
      key: "CreateTransactionViewDisplay",
      value: function CreateTransactionViewDisplay(n) {
        Utilities.Clear_Element(this.receipt_view_contents_element);Utilities.Clear_Element(this.receipt_view_totals_element);var _iteratorNormalCompletion26 = true;
        var _didIteratorError26 = false;
        var _iteratorError26 = undefined;

        try {
          for (var _iterator26 = n.deposit_receipts[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
            var _n36 = _step26.value;
            this.receipt_view_contents_element.appendChild(this.CreateReceiptDetailRow(_n36.transaction_type + " " + _n36.transaction_number, _n36.total_cash_amount, _n36.total_check_amount, _n36.total_check_count));
          }
        } catch (err) {
          _didIteratorError26 = true;
          _iteratorError26 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion26 && _iterator26["return"]) {
              _iterator26["return"]();
            }
          } finally {
            if (_didIteratorError26) {
              throw _iteratorError26;
            }
          }
        }

        this.receipt_view_totals_element.appendChild(this.CreateReceiptDetailRow("Grand Total", n.total_cash_amount, n.total_check_amount, n.total_check_count));
      }
    }, {
      key: "CreatePaymentTypeDisplay",
      value: function CreatePaymentTypeDisplay(n) {
        Utilities.Clear_Element(this.receipt_view_contents_element);Utilities.Clear_Element(this.receipt_view_totals_element);var t = 0,
            i = 0,
            r = 0;var _iteratorNormalCompletion27 = true;
        var _didIteratorError27 = false;
        var _iteratorError27 = undefined;

        try {
          for (var _iterator27 = n.payment_type_data[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
            var _n37 = _step27.value;
            var f = !1,
                e = 0,
                o = 0,
                s = 0,
                u = _n37.control_data,
                h = this.get_address_controls(u, !0);h.length > 0 && (u = this.get_address_controls(u, !1));var c = this.get_date_range_controls(u, !0);c.length > 0 && (u = this.get_date_range_controls(u, !1));var _iteratorNormalCompletion28 = true;
            var _didIteratorError28 = false;
            var _iteratorError28 = undefined;

            try {
              for (var _iterator28 = u[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
                var _n38 = _step28.value;
                var _t20 = _n38.control ? _n38.control : _n38.selected_control;if (_t20.data_type === "bigtext") {
                  var _i18 = document.createElement("div"),
                      _r5 = _n38.value.split("\n");var _iteratorNormalCompletion30 = true;
                  var _didIteratorError30 = false;
                  var _iteratorError30 = undefined;

                  try {
                    for (var _iterator30 = _r5[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
                      var _n39 = _step30.value;
                      var _t21 = document.createElement("p");_t21.appendChild(document.createTextNode(_n39));_i18.appendChild(_t21);
                    }
                  } catch (err) {
                    _didIteratorError30 = true;
                    _iteratorError30 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion30 && _iterator30["return"]) {
                        _iterator30["return"]();
                      }
                    } finally {
                      if (_didIteratorError30) {
                        throw _iteratorError30;
                      }
                    }
                  }

                  this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(_t20.label, _i18));
                } else if (_t20.data_type === "money") {
                  var _i19 = Utilities.Format_Amount(parseFloat(_n38.value));this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(_t20.label, _i19));
                } else this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(_t20.label, _n38.value));
              }
            } catch (err) {
              _didIteratorError28 = true;
              _iteratorError28 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion28 && _iterator28["return"]) {
                  _iterator28["return"]();
                }
              } finally {
                if (_didIteratorError28) {
                  throw _iteratorError28;
                }
              }
            }

            if (h.length > 0) {
              var _n40 = this.get_address(h);this.receipt_view_contents_element.appendChild(this.CreateControlDataRow("Address", _n40));
            }if (c.length > 0) {
              var _n41 = this.get_date_range(c);this.receipt_view_contents_element.appendChild(this.CreateControlDataRow("Date Range", _n41));
            }var _iteratorNormalCompletion29 = true;
            var _didIteratorError29 = false;
            var _iteratorError29 = undefined;

            try {
              for (var _iterator29 = n.payment_method_data[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
                var _n42 = _step29.value;
                _n42.cash_amount > 0 ? (f || (this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeHeaderRow()), f = !0), this.receipt_view_contents_element.appendChild(this.CreateCashDataRow(_n42))) : (_n42.check_amount > 0 || _n42.check_number.length > 0 || _n42.check_from.length > 0) && (f || (this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeHeaderRow()), f = !0), this.receipt_view_contents_element.appendChild(this.CreateCheckDataRow(_n42))), o += _n42.cash_amount, e += _n42.check_amount, s += _n42.check_count;
              }
            } catch (err) {
              _didIteratorError29 = true;
              _iteratorError29 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion29 && _iterator29["return"]) {
                  _iterator29["return"]();
                }
              } finally {
                if (_didIteratorError29) {
                  throw _iteratorError29;
                }
              }
            }

            var l = _n37.selected_payment_type !== undefined ? _n37.selected_payment_type.name : _n37.payment_type.name;this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeRow(l + " Total", o, e, s));t += e;i += o;r += s;
          }
        } catch (err) {
          _didIteratorError27 = true;
          _iteratorError27 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion27 && _iterator27["return"]) {
              _iterator27["return"]();
            }
          } finally {
            if (_didIteratorError27) {
              throw _iteratorError27;
            }
          }
        }

        this.receipt_view_totals_element.appendChild(this.CreatePaymentTypeRow("Grand Total", i, t, r));
      }
    }, {
      key: "CreatePaymentTypeRow",
      value: function CreatePaymentTypeRow(n, t, i, r) {
        return this.CreateReceiptDetailRow(n, t, i, r);
      }
    }, {
      key: "CreateControlDataRow",
      value: function CreateControlDataRow(n, t) {
        var i = document.createElement("tr");if ((i.classList.add("pagebreak"), i.appendChild(Utilities.CreateTableCell("td", n, "has-text-right")), typeof t == "string")) i.appendChild(Utilities.CreateTableCell("td", t, "has-text-left", "", 2));else {
          var _n43 = Utilities.CreateTableCell("td", t, "has-text-left", "", 2);_n43.appendChild(t);i.appendChild(_n43);
        }return i.appendChild(Utilities.CreateTableCell("td", "", "", "", 4)), i;
      }
    }, {
      key: "CreatePaymentTypeHeaderRow",
      value: function CreatePaymentTypeHeaderRow() {
        var n = document.createElement("tr");return n.classList.add("pagebreak"), n.appendChild(Utilities.CreateTableCell("th", "Check Number", "has-text-right")), n.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-right")), n.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered")), n.appendChild(Utilities.CreateTableCell("td", "", "", "", 4)), n;
      }
    }, {
      key: "CreateCheckDataRow",
      value: function CreateCheckDataRow(n) {
        var t = document.createElement("tr");return t.classList.add("pagebreak"), t.appendChild(Utilities.CreateTableCell("td", n.check_number, "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", n.check_from, "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", "Check", "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", n.check_count.toString(), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.check_amount), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", "", "")), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.check_amount), "has-text-right")), t;
      }
    }, {
      key: "CreateCashDataRow",
      value: function CreateCashDataRow(n) {
        var t = document.createElement("tr");return t.classList.add("pagebreak"), t.appendChild(Utilities.CreateTableCell("td", "", "", "", 2)), t.appendChild(Utilities.CreateTableCell("td", "Cash", "has-text-centered")), t.appendChild(Utilities.CreateTableCell("td", "", "", "", 2)), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.cash_amount), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.cash_amount), "has-text-right")), t;
      }
    }, {
      key: "CreateReceiptDetailRow",
      value: function CreateReceiptDetailRow(n, t, i, r) {
        var u = document.createElement("tr");return u.appendChild(Utilities.CreateTableCell("th", n, "has-text-left", "", 3)), u.appendChild(Utilities.CreateTableCell("th", r.toString(), "has-text-right")), u.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(i), "has-text-right")), u.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(t), "has-text-right")), u.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(t + i), "has-text-right")), u.classList.add("payment_type_end"), u;
      }
    }, {
      key: "DisplayDepartmentControls",
      value: function DisplayDepartmentControls(n) {
        var i = document.getElementById("receipt_department_controls");Utilities.Clear_Element(i);var t = document.createDocumentFragment();t.appendChild(this.CreatePrintableControl("is-half", "Received From", n.received_from));t.appendChild(this.CreatePrintableControl("is-half", "Department", n.department_name));var _iteratorNormalCompletion31 = true;
        var _didIteratorError31 = false;
        var _iteratorError31 = undefined;

        try {
          for (var _iterator31 = n.department_control_data[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
            var _n44 = _step31.value;
            t.appendChild(this.CreateDepartmentControl(_n44));
          }
        } catch (err) {
          _didIteratorError31 = true;
          _iteratorError31 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion31 && _iterator31["return"]) {
              _iterator31["return"]();
            }
          } finally {
            if (_didIteratorError31) {
              throw _iteratorError31;
            }
          }
        }

        i.appendChild(t);
      }
    }, {
      key: "CreateDepartmentControl",
      value: function CreateDepartmentControl(n) {
        var i = "";console.log("create departmental control", n);var t = n.control !== null ? n.control : n.selected_control;return t.render_hints.length > 0 && (i = t.render_hints), this.CreatePrintableControl(i, t.label, n.value);
      }
    }, {
      key: "CreatePrintableControl",
      value: function CreatePrintableControl(t, i, r) {
        var u = document.createElement("div");u.classList.add("field", "column", t);var e = document.createElement("label");e.classList.add("label", n.app_input_size);e.appendChild(document.createTextNode(i));u.appendChild(e);var o = document.createElement("p");o.classList.add("control");u.appendChild(o);var f = document.createElement("input");return f.classList.add("input", "is-static", n.app_input_size), f.value = r, f.readOnly = !0, o.appendChild(f), u;
      }
    }, {
      key: "get_address_controls",
      value: function get_address_controls(n, t) {
        return this.get_control_groups([5, 6, 7, 8, 9], n, t);
      }
    }, {
      key: "get_address",
      value: function get_address(n) {
        var t = document.createElement("div"),
            f = "",
            e = "",
            i = "",
            r = "",
            o = "",
            u = "";var _iteratorNormalCompletion32 = true;
        var _didIteratorError32 = false;
        var _iteratorError32 = undefined;

        try {
          for (var _iterator32 = n[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
            var _n45 = _step32.value;
            switch (_n45.control_id) {case 5:
                f = _n45.value.trim();break;case 6:
                e = _n45.value.trim();break;case 7:
                i = _n45.value.trim();break;case 8:
                r = _n45.value.trim();break;case 9:
                o = _n45.value.trim();}
          }
        } catch (err) {
          _didIteratorError32 = true;
          _iteratorError32 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion32 && _iterator32["return"]) {
              _iterator32["return"]();
            }
          } finally {
            if (_didIteratorError32) {
              throw _iteratorError32;
            }
          }
        }

        if (f.length > 0) {
          var _n46 = document.createElement("p");_n46.appendChild(document.createTextNode(f));t.appendChild(_n46);
        }if (e.length > 0) {
          var _n47 = document.createElement("p");_n47.appendChild(document.createTextNode(e));t.appendChild(_n47);
        }if (i.length > 0 || r.length > 0 || o.length > 0) {
          i.length > 0 && (u = i + ", ");r.length > 0 && (u += r + " ");u += o;var _n48 = document.createElement("p");_n48.appendChild(document.createTextNode(u));t.appendChild(_n48);
        }return t;
      }
    }, {
      key: "get_date_range",
      value: function get_date_range(n) {
        var t = "",
            i = "",
            r = document.createElement("e");var _iteratorNormalCompletion33 = true;
        var _didIteratorError33 = false;
        var _iteratorError33 = undefined;

        try {
          for (var _iterator33 = n[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
            var _n49 = _step33.value;
            switch (_n49.control_id) {case 10:case 71:
                t = _n49.value;break;case 11:case 72:
                i = _n49.value;}
          }
        } catch (err) {
          _didIteratorError33 = true;
          _iteratorError33 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion33 && _iterator33["return"]) {
              _iterator33["return"]();
            }
          } finally {
            if (_didIteratorError33) {
              throw _iteratorError33;
            }
          }
        }

        return r.appendChild(document.createTextNode(t + " through " + i)), r;
      }
    }, {
      key: "get_date_range_controls",
      value: function get_date_range_controls(n, t) {
        return this.get_control_groups([10, 11, 71, 72], n, t);
      }
    }, {
      key: "get_control_groups",
      value: function get_control_groups(n, t, i) {
        return i ? t.filter(function (t) {
          return n.includes(t.control_id);
        }) : t.filter(function (t) {
          return !n.includes(t.control_id);
        });
      }
    }]);

    return t;
  })();

  t.receipt_container = "receipt_view";n.Receipt = t;
})(Transaction || (Transaction = {})), (function (n) {
  var t;(function (t) {
    var i = (function () {
      function i(n, t) {
        _classCallCheck(this, i);

        this.transaction_id = -1;this.fiscal_year = -1;this.created_by_employee_id = -1;this.employee_transaction_count = -1;this.transaction_number = "PREVIEW";this.transaction_type = "";this.child_transaction_id = -1;this.department_id = -1;this.department_name = "";this.department_control_data = [];this.payment_type_data = [];this.county_manager_name = "PREVIEW";this.comment = "";this.error_text = "";this.received_from = "";this.total_cash_amount = -1;this.total_check_amount = -1;this.total_check_count = -1;this.created_on = new Date();this.created_by_username = "";this.created_by_ip_address = "";this.created_by_display_name = "PREVIEW";this.deposit_receipts = [];this.can_modify = !1;this.can_accept_deposit = !1;this.child_transaction = null;this.department_element = null;this.department_element_container = null;this.received_from_element = null;this.received_from_element_container = null;this.department_controls_target = "department_controls_container";this.payment_type_target = "payment_type_container";this.transaction_error_element = null;this.selected_department = null;this.next_payment_type_index = 0;this.transaction_type = n;t !== null && (this.transaction_id = t.transaction_id, this.transaction_number = t.transaction_number, this.transaction_type = t.transaction_type);var r = document.getElementById(i.action_container);Utilities.Clear_Element(r);this.CreateReceiptTitle(r, t);switch (this.transaction_type) {case "R":
            console.log("receipt view");this.RenderReceiptView(r, t);break;case "D":case "C":
            console.log("deposit view");this.RenderDepositView(r, t);}this.transaction_error_element = this.CreateTransactionErrorElement();r.appendChild(this.transaction_error_element);
      }

      _createClass(i, [{
        key: "RenderDepositView",
        value: function RenderDepositView(n, t) {
          var r = document.createElement("div");n.appendChild(r);var u = i.CreateTransactionsTableFooter(t);i.RenderTransactionList(t.deposit_receipts, r, u);t.can_accept_deposit && (console.log("can accept deposit"), n.appendChild(i.CreateAcceptDepositMenu(t)));
        }
      }, {
        key: "RenderReceiptView",
        value: function RenderReceiptView(t, i) {
          var r = document.createElement("div");r.id = "transaction_controls";r.classList.add("columns");t.appendChild(r);this.department_element = n.DepartmentControl.cloneNode(!0);this.RenderDepartmentSelection(r, i);this.RenderReceivedFromInput(r, i);
        }
      }, {
        key: "CreateTransactionErrorElement",
        value: function CreateTransactionErrorElement() {
          return document.createElement("div");
        }
      }, {
        key: "CreateReceiptTitle",
        value: function CreateReceiptTitle(t, i) {
          var u = document.createElement("h2");u.classList.add("title", "has-text-centered");var r = "";if (i === null) r = "Create a New Receipt", u.appendChild(document.createTextNode(r));else {
            switch (i.transaction_type) {case "R":
                r = "Viewing Receipt: " + i.transaction_number;break;case "D":
                r = "Viewing Deposit: " + i.transaction_number;break;case "C":
                r = "Viewing Deposit Receipt: " + i.transaction_number;}if ((u.appendChild(document.createTextNode(r)), i.child_transaction !== null)) {
              (function () {
                var t = i.child_transaction,
                    f = document.createElement("a");f.appendChild(document.createTextNode(t.transaction_number));f.onclick = function () {
                  n.ShowReceiptDetail(t.transaction_id);
                };switch (t.transaction_type) {case "D":
                    r = ", Deposited: ";break;case "C":
                    r = ", Deposit Accepted: ";}u.appendChild(document.createTextNode(r));u.appendChild(f);
              })();
            }
          }t.appendChild(u);
        }
      }, {
        key: "RenderDepartmentSelection",
        value: function RenderDepartmentSelection(t, i) {
          var _this11 = this;

          i === null ? this.department_element.onchange = function (t) {
            _this11.department_id = parseInt(t.target.value), _this11.selected_department = n.Department.FindDepartment(_this11.department_id), _this11.RenderDepartmentControls(), _this11.RenderPaymentTypes();
          } : (this.department_id = i.department_id, this.selected_department = n.Department.FindDepartment(this.department_id), this.RenderSavedDepartmentControls(i), this.RenderSavedPaymentTypes(i), this.department_element.value = i.department_id.toString(), this.department_element.disabled = !0);this.department_element_container = n.Department.CreateDepartmentElementField(this.department_element);t.appendChild(this.department_element_container);
        }
      }, {
        key: "RenderDepartmentControls",
        value: function RenderDepartmentControls() {
          this.department_control_data = [];var n = document.getElementById(this.department_controls_target);if ((n === null && (n = document.createElement("div"), n.id = this.department_controls_target, document.getElementById(i.action_container).appendChild(n)), Utilities.Clear_Element(n), this.department_id !== -1 && this.selected_department !== null && this.selected_department.controls.length !== 0)) {
            var _iteratorNormalCompletion34 = true;
            var _didIteratorError34 = false;
            var _iteratorError34 = undefined;

            try {
              for (var _iterator34 = this.selected_department.control_groups[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
                var _department_control_data;

                var _t22 = _step34.value;
                (_department_control_data = this.department_control_data).push.apply(_department_control_data, _toConsumableArray(_t22.CreateControlData(n)));
              }
            } catch (err) {
              _didIteratorError34 = true;
              _iteratorError34 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion34 && _iterator34["return"]) {
                  _iterator34["return"]();
                }
              } finally {
                if (_didIteratorError34) {
                  throw _iteratorError34;
                }
              }
            }
          }
        }
      }, {
        key: "RenderPaymentTypes",
        value: function RenderPaymentTypes() {
          var _this12 = this;

          this.payment_type_data = [];var n = document.getElementById(this.payment_type_target);if ((n === null && (n = document.createElement("div"), n.id = this.payment_type_target, document.getElementById(i.action_container).appendChild(n)), Utilities.Clear_Element(n), this.department_id !== -1 && this.selected_department !== null)) {
            var _t23 = document.createElement("ol");_t23.classList.add("payment_type");var _iteratorNormalCompletion35 = true;
            var _didIteratorError35 = false;
            var _iteratorError35 = undefined;

            try {
              var _loop3 = function () {
                var n = _step35.value;
                var i = document.createElement("li");i.classList.add("light-function", "is-size-4", "has-background-link");i.style.cursor = "pointer";i.setAttribute("payment_type_id", n.payment_type_id.toString());var u = document.createElement("span");u.classList.add("name");u.appendChild(document.createTextNode(n.name));i.appendChild(u);var f = document.createElement("span");f.classList.add("totals");i.appendChild(f);_t23.appendChild(i);var r = document.createElement("ol");r.classList.add("control_container", "hide");_t23.appendChild(r);i.onclick = function () {
                  r.childElementCount === 0 && (_this12.AddPaymentType(n, r), r.classList.remove("hide")), console.log("this transaction", _this12);
                };
              };

              for (var _iterator35 = this.selected_department.payment_types[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
                _loop3();
              }
            } catch (err) {
              _didIteratorError35 = true;
              _iteratorError35 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion35 && _iterator35["return"]) {
                  _iterator35["return"]();
                }
              } finally {
                if (_didIteratorError35) {
                  throw _iteratorError35;
                }
              }
            }

            n.appendChild(_t23);
          }
        }
      }, {
        key: "AddPaymentType",
        value: function AddPaymentType(i, r) {
          var _this13 = this;

          var u = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
          if (i.payment_type_id === 62) {
            var _iteratorNormalCompletion36 = true;
            var _didIteratorError36 = false;
            var _iteratorError36 = undefined;

            try {
              for (var _iterator36 = this.payment_type_data[Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
                var _n50 = _step36.value;
                if (_n50.payment_type_id === 62) {
                  alert("You can only add 1 Security Deposit to receipt.");return;
                }
              }
            } catch (err) {
              _didIteratorError36 = true;
              _iteratorError36 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion36 && _iterator36["return"]) {
                  _iterator36["return"]();
                }
              } finally {
                if (_didIteratorError36) {
                  throw _iteratorError36;
                }
              }
            }
          }var e = this.next_payment_type_index++;if (u) {
            var _n51 = 0;var _iteratorNormalCompletion37 = true;
            var _didIteratorError37 = false;
            var _iteratorError37 = undefined;

            try {
              for (var _iterator37 = this.payment_type_data[Symbol.iterator](), _step37; !(_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done); _iteratorNormalCompletion37 = true) {
                var _t24 = _step37.value;
                _t24.payment_type_index > _n51 && (_n51 = _t24.payment_type_index);
              }
            } catch (err) {
              _didIteratorError37 = true;
              _iteratorError37 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion37 && _iterator37["return"]) {
                  _iterator37["return"]();
                }
              } finally {
                if (_didIteratorError37) {
                  throw _iteratorError37;
                }
              }
            }

            e = _n51 + 1;
          }var f = new t.PaymentTypeData(i, r, e);this.payment_type_data.push(f);f.add_another_payment_type_button.onclick = function () {
            _this13.AddPaymentType(i, r, u);
          };f.cancel_payment_type_button.onclick = function () {
            r.removeChild(f.payment_type_container);var n = _this13.payment_type_data.findIndex(function (n) {
              return n.payment_type_index === f.payment_type_index;
            });n > -1 && _this13.payment_type_data.splice(n, 1);f = null;r.childElementCount === 0 && r.classList.add("hide");
          };u && Utilities.Set_Text(f.save_button, "Save New Payment Types");f.save_button.onclick = function (t) {
            var i = t.target;Utilities.Toggle_Loading_Button(i, !0);u ? (_this13.SaveNewPaymentTypes(), Utilities.Toggle_Loading_Button(i, !1)) : _this13.ValidateTransaction() ? (n.currentReceipt.ShowReceiptPreview(), Utilities.Toggle_Loading_Button(i, !1)) : Utilities.Toggle_Loading_Button(i, !1);
          };
        }
      }, {
        key: "RenderSavedDepartmentControls",
        value: function RenderSavedDepartmentControls(t) {
          this.department_control_data = [];var r = document.getElementById(this.department_controls_target);if ((r === null && (r = document.createElement("div"), r.id = this.department_controls_target, document.getElementById(i.action_container).appendChild(r)), Utilities.Clear_Element(r), this.department_id !== -1 && this.selected_department !== null && this.selected_department.controls.length !== 0)) {
            var u = n.ControlGroup.CreateSavedControlGroups(t.department_control_data);var _iteratorNormalCompletion38 = true;
            var _didIteratorError38 = false;
            var _iteratorError38 = undefined;

            try {
              for (var _iterator38 = u[Symbol.iterator](), _step38; !(_iteratorNormalCompletion38 = (_step38 = _iterator38.next()).done); _iteratorNormalCompletion38 = true) {
                var _department_control_data2;

                var _n52 = _step38.value;
                (_department_control_data2 = this.department_control_data).push.apply(_department_control_data2, _toConsumableArray(_n52.CreateControlData(r, !1)));
              }
            } catch (err) {
              _didIteratorError38 = true;
              _iteratorError38 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion38 && _iterator38["return"]) {
                  _iterator38["return"]();
                }
              } finally {
                if (_didIteratorError38) {
                  throw _iteratorError38;
                }
              }
            }
          }
        }
      }, {
        key: "RenderSavedPaymentTypes",
        value: function RenderSavedPaymentTypes(t) {
          var _this14 = this;

          this.payment_type_data = [];var r = document.getElementById(this.payment_type_target);if ((r === null && (r = document.createElement("div"), r.id = this.payment_type_target, document.getElementById(i.action_container).appendChild(r)), Utilities.Clear_Element(r), this.department_id !== -1 && this.selected_department !== null)) {
            var u = document.createElement("ol");u.classList.add("payment_type");var e = t.payment_type_data.map(function (n) {
              return n.payment_type_id;
            }),
                f = [].concat(_toConsumableArray(new Set(e)));var _iteratorNormalCompletion39 = true;
            var _didIteratorError39 = false;
            var _iteratorError39 = undefined;

            try {
              var _loop4 = function () {
                var i = _step39.value;
                var s = t.payment_type_data.filter(function (n) {
                  return n.payment_type_id === i;
                }),
                    f = n.FindPaymentType(s[0].payment_type_id),
                    r = document.createElement("li");r.classList.add("light-function", "is-size-4", "has-background-link");r.style.cursor = "pointer";r.setAttribute("payment_type_id", f.payment_type_id.toString());var e = document.createElement("span");e.classList.add("name");e.appendChild(document.createTextNode(f.name));r.appendChild(e);var h = document.createElement("span");h.classList.add("totals");r.appendChild(h);u.appendChild(r);var o = document.createElement("ol");o.classList.add("control_container");u.appendChild(o);_iteratorNormalCompletion41 = true;
                _didIteratorError41 = false;
                _iteratorError41 = undefined;

                try {
                  for (_iterator41 = s[Symbol.iterator](); !(_iteratorNormalCompletion41 = (_step41 = _iterator41.next()).done); _iteratorNormalCompletion41 = true) {
                    var _n53 = _step41.value;
                    _this14.AddSavedPaymentType(f, _n53, o);
                  }
                } catch (err) {
                  _didIteratorError41 = true;
                  _iteratorError41 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion41 && _iterator41["return"]) {
                      _iterator41["return"]();
                    }
                  } finally {
                    if (_didIteratorError41) {
                      throw _iteratorError41;
                    }
                  }
                }
              };

              for (var _iterator39 = f[Symbol.iterator](), _step39; !(_iteratorNormalCompletion39 = (_step39 = _iterator39.next()).done); _iteratorNormalCompletion39 = true) {
                var _iteratorNormalCompletion41;

                var _didIteratorError41;

                var _iteratorError41;

                var _iterator41, _step41;

                _loop4();
              }
            } catch (err) {
              _didIteratorError39 = true;
              _iteratorError39 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion39 && _iterator39["return"]) {
                  _iterator39["return"]();
                }
              } finally {
                if (_didIteratorError39) {
                  throw _iteratorError39;
                }
              }
            }

            var _iteratorNormalCompletion40 = true;
            var _didIteratorError40 = false;
            var _iteratorError40 = undefined;

            try {
              var _loop5 = function () {
                var n = _step40.value;
                if (f.indexOf(n.payment_type_id) === -1) {
                  (function () {
                    var t = document.createElement("li");t.classList.add("light-function", "is-size-4", "has-background-link");t.style.cursor = "pointer";t.setAttribute("payment_type_id", n.payment_type_id.toString());var r = document.createElement("span");r.classList.add("name");r.appendChild(document.createTextNode(n.name));t.appendChild(r);var f = document.createElement("span");f.classList.add("totals");t.appendChild(f);u.appendChild(t);var i = document.createElement("ol");i.classList.add("control_container", "hide");u.appendChild(i);t.onclick = function () {
                      i.childElementCount === 0 && (_this14.AddPaymentType(n, i, !0), i.classList.remove("hide")), console.log("this transaction", _this14);
                    };
                  })();
                }
              };

              for (var _iterator40 = this.selected_department.payment_types[Symbol.iterator](), _step40; !(_iteratorNormalCompletion40 = (_step40 = _iterator40.next()).done); _iteratorNormalCompletion40 = true) {
                _loop5();
              }
            } catch (err) {
              _didIteratorError40 = true;
              _iteratorError40 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion40 && _iterator40["return"]) {
                  _iterator40["return"]();
                }
              } finally {
                if (_didIteratorError40) {
                  throw _iteratorError40;
                }
              }
            }

            r.appendChild(u);
          }
        }
      }, {
        key: "AddSavedPaymentType",
        value: function AddSavedPaymentType(n, i, r) {
          var _this15 = this;

          var u = new t.PaymentTypeData(n, r, this.next_payment_type_index++, i);this.payment_type_data.push(u);u.add_another_payment_type_button.onclick = function () {
            _this15.AddPaymentType(n, r, !0);
          };u.cancel_payment_type_button.style.display = "none";u.save_button.style.display = "none";
        }
      }, {
        key: "RenderReceivedFromInput",
        value: function RenderReceivedFromInput(t, i) {
          var _this16 = this;

          var r = i === null ? "" : i.received_from;this.received_from = r;this.received_from_element = n.ControlGroup.CreateInput("text", 500, !0, "Received From", r);i === null ? this.received_from_element.oninput = function (n) {
            var t = n.target;_this16.received_from = t.value.trim();_this16.IsValid();
          } : this.received_from_element.readOnly = !0;this.received_from_element_container = n.ControlGroup.CreateInputFieldContainer(this.received_from_element, "Received From or N/A", !0, "is-one-half");t.appendChild(this.received_from_element_container);
        }
      }, {
        key: "ValidateNewPaymentTypes",
        value: function ValidateNewPaymentTypes(n) {
          var t = !0;var _iteratorNormalCompletion42 = true;
          var _didIteratorError42 = false;
          var _iteratorError42 = undefined;

          try {
            for (var _iterator42 = n[Symbol.iterator](), _step42; !(_iteratorNormalCompletion42 = (_step42 = _iterator42.next()).done); _iteratorNormalCompletion42 = true) {
              var _n54 = _step42.value;
              _n54.Validate() || (t = !1);
            }
          } catch (err) {
            _didIteratorError42 = true;
            _iteratorError42 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion42 && _iterator42["return"]) {
                _iterator42["return"]();
              }
            } finally {
              if (_didIteratorError42) {
                throw _iteratorError42;
              }
            }
          }

          return t;
        }
      }, {
        key: "ValidateTransaction",
        value: function ValidateTransaction() {
          var n = !0;n = this.IsValid();var _iteratorNormalCompletion43 = true;
          var _didIteratorError43 = false;
          var _iteratorError43 = undefined;

          try {
            for (var _iterator43 = this.department_control_data[Symbol.iterator](), _step43; !(_iteratorNormalCompletion43 = (_step43 = _iterator43.next()).done); _iteratorNormalCompletion43 = true) {
              var _t25 = _step43.value;
              var _i20 = _t25.Validate();!_i20 && n && (n = !1);
            }
          } catch (err) {
            _didIteratorError43 = true;
            _iteratorError43 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion43 && _iterator43["return"]) {
                _iterator43["return"]();
              }
            } finally {
              if (_didIteratorError43) {
                throw _iteratorError43;
              }
            }
          }

          var _iteratorNormalCompletion44 = true;
          var _didIteratorError44 = false;
          var _iteratorError44 = undefined;

          try {
            for (var _iterator44 = this.payment_type_data[Symbol.iterator](), _step44; !(_iteratorNormalCompletion44 = (_step44 = _iterator44.next()).done); _iteratorNormalCompletion44 = true) {
              var _t26 = _step44.value;
              var _i21 = _t26.Validate();!_i21 && n && (n = !1);
            }
          } catch (err) {
            _didIteratorError44 = true;
            _iteratorError44 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion44 && _iterator44["return"]) {
                _iterator44["return"]();
              }
            } finally {
              if (_didIteratorError44) {
                throw _iteratorError44;
              }
            }
          }

          return n && (this.ValidateCheckCount() || (Utilities.Error_Show(this.transaction_error_element, "You have entered a check amount but have entered that you have collected no checks."), this.transaction_error_element.parentElement.scrollIntoView(), n = !1)), n;
        }
      }, {
        key: "ValidateCheckCount",
        value: function ValidateCheckCount() {
          var n = 0;var _iteratorNormalCompletion45 = true;
          var _didIteratorError45 = false;
          var _iteratorError45 = undefined;

          try {
            for (var _iterator45 = this.payment_type_data[Symbol.iterator](), _step45; !(_iteratorNormalCompletion45 = (_step45 = _iterator45.next()).done); _iteratorNormalCompletion45 = true) {
              var _t27 = _step45.value;
              var _iteratorNormalCompletion46 = true;
              var _didIteratorError46 = false;
              var _iteratorError46 = undefined;

              try {
                for (var _iterator46 = t.payment_method_data[Symbol.iterator](), _step46; !(_iteratorNormalCompletion46 = (_step46 = _iterator46.next()).done); _iteratorNormalCompletion46 = true) {
                  var _t28 = _step46.value;
                  if (_t28.check_count > 0) return !0;n += _t28.check_amount;
                }
              } catch (err) {
                _didIteratorError46 = true;
                _iteratorError46 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion46 && _iterator46["return"]) {
                    _iterator46["return"]();
                  }
                } finally {
                  if (_didIteratorError46) {
                    throw _iteratorError46;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError45 = true;
            _iteratorError45 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion45 && _iterator45["return"]) {
                _iterator45["return"]();
              }
            } finally {
              if (_didIteratorError45) {
                throw _iteratorError45;
              }
            }
          }

          return n === 0;
        }
      }, {
        key: "IsValid",
        value: function IsValid() {
          n.error_scrolled = !1;this.ResetErrorElements();var t = !0;return this.received_from.length === 0 && (n.ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "This field is required."), t = !1), t;
        }
      }, {
        key: "ResetErrorElements",
        value: function ResetErrorElements() {
          Utilities.Clear_Element(this.transaction_error_element);n.ControlGroup.UpdateSelectError(this.department_element_container, "");n.ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "");
        }
      }, {
        key: "SaveTransactionData",
        value: function SaveTransactionData() {
          var r = this,
              u = n.GetPath();Utilities.Post(u + "API/Transaction/Save", r).then(function (u) {
            if (u.error_text.length === 0) console.log("post probably good", u), n.currentReceipt.ShowReceipt(u), n.ResetReceipt(), n.Data.TransactionData.GetTransactionList().then(function (r) {
              n.transactions = r, i.RenderTransactionList(r), Utilities.Toggle_Loading_Button(t.TransactionData.reload_button, !1);
            });else {
              console.log("transaction error", u.error_text, u);n.ViewReceiptDetail();r.ParseReturnedTransactionForErrors(u);return;
            }
          }, function (n) {
            console.log("post error occurred", n);
          });
        }
      }, {
        key: "ParseReturnedTransactionForErrors",
        value: function ParseReturnedTransactionForErrors(n) {
          var t = n;var _iteratorNormalCompletion47 = true;
          var _didIteratorError47 = false;
          var _iteratorError47 = undefined;

          try {
            for (var _iterator47 = t.department_control_data[Symbol.iterator](), _step47; !(_iteratorNormalCompletion47 = (_step47 = _iterator47.next()).done); _iteratorNormalCompletion47 = true) {
              var _n55 = _step47.value;
              if (_n55.error_text.length > 0) {
                var _t29 = this.FindDepartmentControl(_n55.control_id);_t29 !== undefined && _t29.SetErrorText(_n55.error_text);
              }
            }
          } catch (err) {
            _didIteratorError47 = true;
            _iteratorError47 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion47 && _iterator47["return"]) {
                _iterator47["return"]();
              }
            } finally {
              if (_didIteratorError47) {
                throw _iteratorError47;
              }
            }
          }

          var _iteratorNormalCompletion48 = true;
          var _didIteratorError48 = false;
          var _iteratorError48 = undefined;

          try {
            for (var _iterator48 = t.payment_type_data[Symbol.iterator](), _step48; !(_iteratorNormalCompletion48 = (_step48 = _iterator48.next()).done); _iteratorNormalCompletion48 = true) {
              var _n56 = _step48.value;
              var _t30 = this.FindPaymentType(_n56.payment_type_id, _n56.payment_type_index);if (_t30 !== undefined) {
                var _iteratorNormalCompletion49 = true;
                var _didIteratorError49 = false;
                var _iteratorError49 = undefined;

                try {
                  for (var _iterator49 = n.control_data[Symbol.iterator](), _step49; !(_iteratorNormalCompletion49 = (_step49 = _iterator49.next()).done); _iteratorNormalCompletion49 = true) {
                    var _n57 = _step49.value;
                    if (_n57.error_text.length > 0) {
                      var _i22 = _t30.FindPaymentTypeControl(_n57.control_id);_i22 !== undefined && _i22.SetErrorText(_n57.error_text);
                    }
                  }
                } catch (err) {
                  _didIteratorError49 = true;
                  _iteratorError49 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion49 && _iterator49["return"]) {
                      _iterator49["return"]();
                    }
                  } finally {
                    if (_didIteratorError49) {
                      throw _iteratorError49;
                    }
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError48 = true;
            _iteratorError48 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion48 && _iterator48["return"]) {
                _iterator48["return"]();
              }
            } finally {
              if (_didIteratorError48) {
                throw _iteratorError48;
              }
            }
          }

          Utilities.Error_Show(this.transaction_error_element, n.error_text);this.transaction_error_element.parentElement.scrollIntoView();
        }
      }, {
        key: "FindDepartmentControl",
        value: function FindDepartmentControl(n) {
          return this.department_control_data.find(function (t) {
            return t.control_id === n;
          });
        }
      }, {
        key: "FindPaymentType",
        value: function FindPaymentType(n, t) {
          return this.payment_type_data.find(function (i) {
            return i.payment_type_index === t && i.payment_type_id === n;
          });
        }
      }, {
        key: "SaveNewPaymentTypes",
        value: function SaveNewPaymentTypes() {
          var _this17 = this;

          if ((console.log("save new payment types", this.payment_type_data), this.transaction_id === -1)) {
            alert("There was an error attempting to save this transaction.  The transaction id is unknown.");return;
          }var t = [];var _iteratorNormalCompletion50 = true;
          var _didIteratorError50 = false;
          var _iteratorError50 = undefined;

          try {
            for (var _iterator50 = this.payment_type_data[Symbol.iterator](), _step50; !(_iteratorNormalCompletion50 = (_step50 = _iterator50.next()).done); _iteratorNormalCompletion50 = true) {
              var _n58 = _step50.value;
              _n58.transaction_payment_type_id === -1 && (_n58.transaction_id = this.transaction_id, _n58.added_after_save = !0, t.push(_n58));
            }
          } catch (err) {
            _didIteratorError50 = true;
            _iteratorError50 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion50 && _iterator50["return"]) {
                _iterator50["return"]();
              }
            } finally {
              if (_didIteratorError50) {
                throw _iteratorError50;
              }
            }
          }

          if (!this.ValidateNewPaymentTypes(t)) {
            console.log("failed to validate new payment types");return;
          }var i = n.GetPath();Utilities.Post_Empty(i + "API/Transaction/AddPaymentTypes", t).then(function (t) {
            console.log("response", t), t.ok ? t.text().then(function (t) {
              console.log("response text", t), t.length > 0 ? alert("An error occurred attempting to save this payment type:\r\n" + t) : n.ShowReceiptDetail(_this17.transaction_id);
            }) : alert("An error occurred attempting to save this payment type:\r\n" + t.text);
          });
        }
      }], [{
        key: "GetTransactionList",
        value: function GetTransactionList() {
          var t = n.current_page;Utilities.Toggle_Loading_Button(i.reload_button, !0);var r = n.GetPath(),
              u = i.GetTransactionFilters();return Utilities.Get(r + "API/Transaction/Get?page_number=" + t.toString() + u);
        }
      }, {
        key: "GetTransactionPageCount",
        value: function GetTransactionPageCount() {
          var r = n.GetPath(),
              t = i.GetTransactionFilters();return t.length > 0 && (t = "?" + t.substr(1)), Utilities.Get(r + "API/Transaction/PageCount" + t);
        }
      }, {
        key: "GetTransactionFilters",
        value: function GetTransactionFilters() {
          var t = [];return n.name_filter.length > 0 && t.push("&display_name_filter=" + n.name_filter), n.department_id_filter > 0 && t.push("&department_id_filter=" + n.department_id_filter.toString()), n.transaction_type_filter.length > 0 && t.push("&transaction_type_filter=" + n.transaction_type_filter), n.completed_filter.length > 0 && t.push("&completed_filter=" + n.completed_filter), n.modified_only_filter && t.push("&has_been_modified=true"), n.transaction_number_filter.length > 0 && t.push("&transaction_number_filter=" + n.transaction_number_filter), t.join("");
        }
      }, {
        key: "GetSpecificTransaction",
        value: function GetSpecificTransaction(t) {
          var i = n.GetPath();return Utilities.Get(i + "API/Transaction/GetTransactionData?transaction_id=" + t.toString());
        }
      }, {
        key: "RenderTransactionList",
        value: function RenderTransactionList(t) {
          var r = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var u = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
          var f = r !== null,
              e = r;f || (e = document.getElementById(i.transaction_list_view_container));Utilities.Clear_Element(e);var o = i.CreateTransactionListTable(f);e.appendChild(o);var s = document.createElement("tbody");o.appendChild(s);var h = f ? 9 : 11,
              c = f ? "No transactions were found." : "No transactions were found to match your filters.";if (t.length === 0) s.appendChild(n.CreateMessageRow(h, c));else {
            var _iteratorNormalCompletion51 = true;
            var _didIteratorError51 = false;
            var _iteratorError51 = undefined;

            try {
              for (var _iterator51 = t[Symbol.iterator](), _step51; !(_iteratorNormalCompletion51 = (_step51 = _iterator51.next()).done); _iteratorNormalCompletion51 = true) {
                var _n59 = _step51.value;
                s.appendChild(i.CreateTransactionListRow(_n59, f));
              }
            } catch (err) {
              _didIteratorError51 = true;
              _iteratorError51 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion51 && _iterator51["return"]) {
                  _iterator51["return"]();
                }
              } finally {
                if (_didIteratorError51) {
                  throw _iteratorError51;
                }
              }
            }
          }u !== null && o.appendChild(u);
        }
      }, {
        key: "CreateTransactionsTableFooter",
        value: function CreateTransactionsTableFooter(n) {
          var i = document.createElement("tfoot"),
              t = document.createElement("tr");i.appendChild(t);var r = Utilities.CreateTableCell("td", "Deposit Totals", "has-text-right");return r.colSpan = 6, t.appendChild(r), t.appendChild(Utilities.CreateTableCell("td", n.total_check_count.toString(), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.total_check_amount), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.total_cash_amount), "has-text-right")), t.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(n.total_check_amount + n.total_cash_amount), "has-text-right")), i;
        }
      }, {
        key: "CreateTransactionListTable",
        value: function CreateTransactionListTable() {
          var t = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
          var r = document.createElement("table");r.classList.add("table", "is-fullwidth");var u = document.createElement("thead");u.id = "transaction_list_view_header";r.appendChild(u);var i = document.createElement("tr");u.appendChild(i);i.appendChild(Utilities.CreateTableCell("th", "Created On", "has-text-left", "15%"));i.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered", "5%"));i.appendChild(Utilities.CreateTableCell("th", "Number", "has-text-left", "10%"));i.appendChild(Utilities.CreateTableCell("th", "Status", "has-text-left", "7.5%"));
          //!short_view ? "7.5%" : "12.5%"));
          i.appendChild(Utilities.CreateTableCell("th", "Department", "has-text-left", "15%"));i.appendChild(Utilities.CreateTableCell("th", "Received From", "has-text-left", "12.5%"));i.appendChild(Utilities.CreateTableCell("th", "Checks", "has-text-right", "7.5%"));
          //!short_view ? "7.5%" : "12.5%"));
          if ((i.appendChild(Utilities.CreateTableCell("th", "$ Check", "has-text-right", "7.5%")), i.appendChild(Utilities.CreateTableCell("th", "$ Cash", "has-text-right", "7.5%")), i.appendChild(Utilities.CreateTableCell("th", "$ Total", "has-text-right", "7.5%")), !t)) {
            var _t31 = Utilities.CreateTableCell("th", "Pg: " + n.current_page.toString(), "has-text-centered", "5%");i.appendChild(_t31);
          }return r;
        }
      }, {
        key: "CreateTransactionListRow",
        value: function CreateTransactionListRow(t, r) {
          var o = document.createElement("tr"),
              u = document.createElement("tr");if ((o.append(u), u.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(t.created_on), "has-text-left")), t.transaction_type === "C" && t.comment.length > 0)) {
            var _n60 = document.createElement("tr");_n60.appendChild(Utilities.CreateTableCell("td", t.comment, "has-text-left"));o.appendChild(_n60);
          }u.appendChild(Utilities.CreateTableCell("td", t.transaction_type, "has-text-centered"));var f = document.createElement("a");f.appendChild(document.createTextNode(t.transaction_number));f.onclick = function () {
            n.ShowReceiptDetail(t.transaction_id);
          };var s = Utilities.CreateTableCell("td", "", "has-text-left");s.appendChild(f);u.appendChild(s);var e = "";if ((t.transaction_type === "R" || t.transaction_type === "C" ? e = t.child_transaction_id === null ? "Incomplete" : t.child_transaction_id === t.transaction_id ? "Completed" : "Deposited" : t.transaction_type === "D" && (e = t.child_transaction_id === null ? "Incomplete" : "Accepted"), u.appendChild(Utilities.CreateTableCell("td", e, "has-text-left")), u.appendChild(Utilities.CreateTableCell("td", t.department_name, "has-text-left")), u.appendChild(Utilities.CreateTableCell("td", t.received_from, "has-text-left")), u.appendChild(Utilities.CreateTableCell("td", t.total_check_count.toString(), "has-text-right")), u.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(t.total_check_amount), "has-text-right")), u.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(t.total_cash_amount), "has-text-right")), u.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(t.total_check_amount + t.total_cash_amount), "has-text-right")), !r)) {
            var _r6 = document.createElement("td");_r6.classList.add("has-text-right");var _f3 = i.CreateTableCellIconButton("fa-print", "is-small");_f3.onclick = function () {
              n.ShowReceipt(t.transaction_id);
            };_r6.appendChild(_f3);u.appendChild(_r6);
          }return u;
        }
      }, {
        key: "CreateTableCellIconButton",
        value: function CreateTableCellIconButton(n, t) {
          var i = document.createElement("a");i.classList.add("button", t);var r = document.createElement("span");r.classList.add("icon", t);var u = document.createElement("i");return u.classList.add("fas", n), r.appendChild(u), i.appendChild(r), i;
        }
      }, {
        key: "CreateAcceptDepositMenu",
        value: function CreateAcceptDepositMenu(t) {
          t.transaction_type = "C";var s = document.createDocumentFragment(),
              r = document.createElement("div");r.classList.add("columns", "is-multiline");s.appendChild(r);var f = n.ControlGroup.CreateInput("number", 15, !0, "Cash Amount"),
              h = n.ControlGroup.CreateInputFieldContainer(f, "Cash Amount Collected", !0, "is-one-quarter");r.appendChild(h);f.oninput = function () {
            t.total_cash_amount = 0, n.ControlGroup.ValidateMoney(f, h) && (t.total_cash_amount = f.valueAsNumber);
          };var e = n.ControlGroup.CreateInput("number", 15, !0, "Check Amount"),
              c = n.ControlGroup.CreateInputFieldContainer(e, "Check Amount Collected", !0, "is-one-quarter");r.appendChild(c);e.oninput = function () {
            t.total_check_amount = 0, n.ControlGroup.ValidateMoney(e, c) && (t.total_check_amount = e.valueAsNumber);
          };var o = n.ControlGroup.CreateInput("number", 15, !0, "# of Checks"),
              l = n.ControlGroup.CreateInputFieldContainer(o, "# of Checks", !0, "is-one-quarter");r.appendChild(l);o.oninput = function () {
            t.total_check_count = 0, n.ControlGroup.ValidateNumber(o, l) && (t.total_check_count = o.valueAsNumber);
          };var i = document.createElement("textarea");i.maxLength = 500;i.required = !1;i.classList.add("textarea", "is-normal");i.rows = 4;i.value = "";i.oninput = function () {
            t.comment = i.value;
          };var a = n.ControlGroup.CreateInputFieldContainer(i, "Comments ** optional", !0, "is-half");r.appendChild(a);var u = document.createElement("button");u.classList.add("button", "is-success");u.appendChild(document.createTextNode("Create Receipt For This Deposit"));u.onclick = function () {
            if ((console.log("Create C Transaction", t), Utilities.Toggle_Loading_Button(u, !0), t.total_cash_amount === 0 && t.total_check_amount === 0 && t.comment.length === 0)) {
              alert("In order to create a receipt for this deposit, you must enter this information.");return;
            }var i = n.GetPath();Utilities.Post(i + "API/Transaction/Save", t).then(function (t) {
              n.currentReceipt.ShowReceipt(t);n.ResetReceipt();n.GetTransactionList(n.current_page, !1).then(function () {
                Utilities.Toggle_Loading_Button(u, !1);
              });
            }, function (n) {
              console.log("post error occurred", n);
            });
          };var v = n.ControlGroup.CreateInputFieldContainer(u, "", !0, "is-one-quarter");return r.appendChild(v), s;
        }
      }, {
        key: "SaveDepositReceipt",
        value: function SaveDepositReceipt() {}
      }]);

      return i;
    })();

    i.reload_button = "filterRefreshButton";i.action_container = "action_view";i.transaction_view_container = "transaction_view";i.transaction_list_view_container = "transaction_list_view";i.transaction_view_filters_container = "transaction_view_filters";t.TransactionData = i;
  })(t = n.Data || (n.Data = {}));
})(Transaction || (Transaction = {}));

