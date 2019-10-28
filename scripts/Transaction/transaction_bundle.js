/// <reference path="MenuItem.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Utilities;
(function (Utilities) {
    function Hide(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("hide");
        e.classList.remove("show");
        e.classList.remove("show-inline");
        e.classList.remove("show-flex");
    }
    Utilities.Hide = Hide;
    function Show(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show");
        e.classList.remove("hide");
        e.classList.remove("show-inline");
        e.classList.remove("show-flex");
    }
    Utilities.Show = Show;
    function Show_Inline(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show-inline");
        e.classList.remove("hide");
        e.classList.remove("show");
        e.classList.remove("show-flex");
    }
    Utilities.Show_Inline = Show_Inline;
    function Show_Inline_Flex(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show-inline-flex");
        e.classList.remove("hide");
        e.classList.remove("show");
        e.classList.remove("show-flex");
    }
    Utilities.Show_Inline_Flex = Show_Inline_Flex;
    function Show_Flex(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show-flex");
        e.classList.remove("hide");
        e.classList.remove("show-inline");
        e.classList.remove("show");
    }
    Utilities.Show_Flex = Show_Flex;
    function Error_Show(e, errorText, timeout) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        if (errorText) {
            //Set_Text(e, errorText);
            Clear_Element(e);
            let notification = document.createElement("div");
            notification.classList.add("notification");
            notification.classList.add("is-danger");
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("delete");
            deleteButton.onclick = () => {
                Hide(e);
            };
            notification.appendChild(deleteButton);
            if (Array.isArray(errorText)) {
                // we're assuming that errorText is an array if we get here.
                let ul = document.createElement("ul");
                errorText.forEach((et) => {
                    let li = document.createElement("li");
                    li.appendChild(document.createTextNode(et));
                    ul.appendChild(li);
                });
                notification.appendChild(ul);
            }
            else {
                notification.appendChild(document.createTextNode(errorText));
            }
            e.appendChild(notification);
        }
        Show(e);
        if (timeout == undefined || timeout === true) {
            window.setTimeout(function (j) {
                Hide(e);
            }, 30000);
        }
    }
    Utilities.Error_Show = Error_Show;
    function Simple_Error_Show(e, errorText) {
        Clear_Element(e);
        e.appendChild(document.createTextNode(errorText));
    }
    Utilities.Simple_Error_Show = Simple_Error_Show;
    function Clear_Element(node) {
        if (node === null || node === undefined)
            return;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    Utilities.Clear_Element = Clear_Element;
    function Create_Option(value, label, selected = false) {
        let o = document.createElement("option");
        o.value = value;
        o.text = label;
        o.selected = selected;
        return o;
    }
    Utilities.Create_Option = Create_Option;
    function Get_Value(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        return e.value;
    }
    Utilities.Get_Value = Get_Value;
    function Set_Value(e, value) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.value = value;
    }
    Utilities.Set_Value = Set_Value;
    function Set_Text(e, value) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        Clear_Element(e);
        e.appendChild(document.createTextNode(value));
    }
    Utilities.Set_Text = Set_Text;
    function Show_Menu(elementId) {
        //let element = e.srcElement;
        // we expect the element's id to be in a "nav-XXX" name format, where 
        // XXX is the element we want to show 
        let id = elementId.replace("nav-", "");
        let menuItems = document.querySelectorAll("#menuTabs > li > a");
        if (menuItems.length > 0) {
            for (let i = 0; i < menuItems.length; i++) {
                let item = menuItems.item(i);
                if (item.id === elementId) {
                    item.parentElement.classList.add("is-active");
                }
                else {
                    item.parentElement.classList.remove("is-active");
                }
            }
        }
        Show_Hide_Selector("#views > section", id);
    }
    Utilities.Show_Menu = Show_Menu;
    function Handle_Tabs(tabSelector, containerSelector, id) {
        Activate_Inactivate_Selector(tabSelector, "nav-" + id);
        Show_Hide_Selector(containerSelector, id);
    }
    Utilities.Handle_Tabs = Handle_Tabs;
    function Activate_Inactivate_Selector(selector, id) {
        let sections = document.querySelectorAll(selector);
        if (sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                let item = sections.item(i);
                if (item.id === id) {
                    item.classList.add("is-active");
                }
                else {
                    item.classList.remove("is-active");
                }
            }
        }
    }
    Utilities.Activate_Inactivate_Selector = Activate_Inactivate_Selector;
    function Show_Hide_Selector(selector, id) {
        let sections = document.querySelectorAll(selector);
        if (sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                let item = sections.item(i);
                if (item.id === id) {
                    Show(item);
                }
                else {
                    Hide(item);
                }
            }
        }
    }
    Utilities.Show_Hide_Selector = Show_Hide_Selector;
    // original Get Function
    //export function Get<T>(url: string): Promise<T>
    //{
    //  return fetch(url,
    //    {
    //      method: "GET",
    //      headers: {
    //        "Content-Type": "application/json"//,"Upgrade-Insecure-Requests": "1"
    //      },
    //      cache: "no-cache",
    //      credentials: "include"
    //    }
    //  )
    //    .then(response =>
    //    {
    //      if (!response.ok)
    //      {
    //        throw new Error(response.statusText)
    //      }
    //      return response.json();
    //    });
    //}
    function Get_Empty(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json" //,"Upgrade-Insecure-Requests": "1"
                },
                cache: "no-cache",
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return yield response.text();
        });
    }
    Utilities.Get_Empty = Get_Empty;
    function Get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json" //,"Upgrade-Insecure-Requests": "1"
                },
                cache: "no-cache",
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return yield response.json();
        });
    }
    Utilities.Get = Get;
    function Post(url, data) {
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }
    Utilities.Post = Post;
    function Post_Empty(url, data) {
        return fetch(url, {
            method: "POST",
            body: data !== null ? JSON.stringify(data) : "",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }).then(response => {
            return response;
            //console.log('Post Response', response);
            //if (!response.ok)
            //{
            //  throw new Error(response.statusText)
            //}
            //return response;
        });
    }
    Utilities.Post_Empty = Post_Empty;
    function Format_Amount(amount) {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    Utilities.Format_Amount = Format_Amount;
    function Format_Date(date) {
        if (date instanceof Date) {
            return date.toLocaleDateString('en-us');
        }
        var d = new Date(date);
        return d.toLocaleDateString('en-US');
    }
    Utilities.Format_Date = Format_Date;
    function Format_DateTime(date) {
        if (date instanceof Date) {
            return date.toLocaleString('en-us');
        }
        return new Date(date).toLocaleString('en-US');
    }
    Utilities.Format_DateTime = Format_DateTime;
    function Validate_Text(e, errorElementId, errorText) {
        // this should only be used for required elements.
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        let ele = e;
        ele.tagName.toLowerCase() === "select" ? ele.parentElement.classList.remove("is-danger") : ele.classList.remove("is-danger");
        let v = Get_Value(ele).trim();
        if (v.length == 0) {
            ele.tagName.toLowerCase() === "select" ? ele.parentElement.classList.add("is-danger") : ele.classList.add("is-danger");
            Error_Show(errorElementId, errorText);
            ele.focus();
            ele.scrollTo();
            return "";
        }
        return v;
    }
    Utilities.Validate_Text = Validate_Text;
    function Toggle_Loading_Button(e, disabled) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        let b = e;
        b.disabled = disabled;
        b.classList.toggle("is-loading", disabled);
    }
    Utilities.Toggle_Loading_Button = Toggle_Loading_Button;
    function Create_Menu_Element(menuItem) {
        let li = document.createElement("li");
        if (menuItem.selected)
            li.classList.add("is-active");
        let a = document.createElement("a");
        a.id = menuItem.id;
        a.onclick = function () {
            Update_Menu(menuItem);
        };
        if (menuItem.icon.length > 0) {
            let span = document.createElement("span");
            span.classList.add("icon");
            span.classList.add(Transaction.app_input_size);
            let i = document.createElement("i");
            let icons = menuItem.icon.split(" ");
            for (let icon of icons) {
                i.classList.add(icon);
            }
            span.appendChild(i);
            a.appendChild(span);
        }
        a.appendChild(document.createTextNode(menuItem.label));
        li.appendChild(a);
        return li;
    }
    Utilities.Create_Menu_Element = Create_Menu_Element;
    function Update_Menu(menuItem) {
        Set_Text("menuTitle", menuItem.title);
        Set_Text("menuSubTitle", menuItem.subTitle);
        Show_Menu(menuItem.id);
        document.getElementById(menuItem.autofocusId).focus();
    }
    Utilities.Update_Menu = Update_Menu;
    function Build_Menu_Elements(target, Menus) {
        let menu = document.getElementById(target);
        for (let menuItem of Menus) {
            menu.appendChild(Utilities.Create_Menu_Element(menuItem));
        }
    }
    Utilities.Build_Menu_Elements = Build_Menu_Elements;
    function CheckBrowser() {
        let browser = "";
        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
            browser = 'Opera';
        }
        else if (navigator.userAgent.indexOf("Chrome") != -1) {
            browser = 'Chrome';
        }
        else if (navigator.userAgent.indexOf("Safari") != -1) {
            browser = 'Safari';
        }
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
            browser = 'Firefox';
        }
        else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.DOCUMENT_NODE == true)) //IF IE > 10
         {
            browser = 'IE';
        }
        else {
            browser = 'unknown';
        }
        return browser;
    }
    Utilities.CheckBrowser = CheckBrowser;
    function Get_Path(appName) {
        let path = "/";
        let i = window.location.pathname.toLowerCase().indexOf(appName);
        if (i == 0) {
            path = appName + "/";
        }
        return path;
    }
    Utilities.Get_Path = Get_Path;
    function Create_Centered_Level(level_items, left = [], right = []) {
        let level = document.createElement("div");
        level.classList.add("level");
        for (let li of level_items) {
            level.appendChild(Create_Level_Item(li));
        }
        if (left.length > 0) {
            let leftcontainer = document.createElement("div");
            leftcontainer.classList.add("level-left");
            level.appendChild(leftcontainer);
            for (let li of left) {
                leftcontainer.appendChild(Create_Level_Item(li));
            }
        }
        if (right.length > 0) {
            let rightcontainer = document.createElement("div");
            rightcontainer.classList.add("level-right");
            level.appendChild(rightcontainer);
            for (let li of right) {
                rightcontainer.appendChild(Create_Level_Item(li));
            }
        }
        return level;
    }
    Utilities.Create_Centered_Level = Create_Centered_Level;
    function Create_Level_Item(level_item) {
        let levelitem = document.createElement("div");
        levelitem.classList.add("level-item", ...level_item.classes);
        let container = document.createElement("div");
        levelitem.appendChild(container);
        if (level_item.heading.length > 0) {
            let heading = document.createElement("p");
            heading.classList.add("heading");
            heading.appendChild(document.createTextNode(level_item.heading));
            container.appendChild(heading);
        }
        if (level_item.title_text.length > 0) {
            let title = document.createElement("p");
            title.classList.add("title");
            title.appendChild(document.createTextNode(level_item.title_text));
            container.appendChild(title);
        }
        else {
            if (level_item.title !== null) {
                container.appendChild(level_item.title);
            }
        }
        return levelitem;
    }
    function CreateTableCell(celltype, value, class_to_add, width = "", col_span = -1) {
        if (celltype !== "td" && celltype !== "th")
            celltype = "td";
        let cell = document.createElement(celltype);
        if (width.length > 0)
            cell.style.width = width;
        if (value.length > 0)
            cell.appendChild(document.createTextNode(value));
        if (class_to_add.length > 0)
            cell.classList.add(class_to_add);
        if (col_span > -1)
            cell.colSpan = col_span;
        return cell;
    }
    Utilities.CreateTableCell = CreateTableCell;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=Utilities.js.map
var Utilities;
(function (Utilities) {
    "use strict";
    class SimpleValue {
        constructor() {
            this.label = "";
            this.value = "";
        }
    }
    Utilities.SimpleValue = SimpleValue;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=SimpleValue.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Transaction;
(function (Transaction) {
    Transaction.app_input_size = "is-normal";
    Transaction.error_scrolled = false;
    Transaction.departments = [];
    Transaction.payment_types = [];
    Transaction.controls = [];
    Transaction.transactions = [];
    Transaction.currentReceipt = null;
    //export let currentTransactionData: Transaction.Data.TransactionData = null;
    Transaction.DepartmentControl = null;
    Transaction.DepartmentControlContainer = null;
    Transaction.current_page = 1;
    Transaction.page_count = 0;
    Transaction.department_id_filter = -1;
    Transaction.name_filter = "mine";
    Transaction.completed_filter = "i";
    Transaction.transaction_type_filter = "";
    Transaction.modified_only_filter = false;
    Transaction.transaction_number_filter = "";
    Transaction.editing_control_data = null;
    Transaction.editing_payment_method_data = null;
    Transaction.reason_for_change_input = "reason_for_change";
    Transaction.reason_for_change_input_container = "reason_for_change_container";
    Transaction.change_edit_container = "change_edit_container";
    Transaction.change_transaction_history_table_header = "change_transaction_history_header";
    Transaction.change_transaction_history_table_body = "change_transaction_history_table";
    Transaction.deposit_view_container = "deposit_view";
    function Start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Department.GetDepartments()
                .then((d) => {
                Transaction.payment_types = [];
                Transaction.controls = [];
                Transaction.departments = d;
                Transaction.DepartmentControl = Transaction.Department.CreateDepartmentElement(Transaction.departments);
                PopulateFilters();
                for (let department of Transaction.departments) {
                    let payment_type_ids = Transaction.payment_types.map((pt) => { return pt.payment_type_id; });
                    Transaction.payment_types = Transaction.payment_types.concat(department.payment_types.filter((pt) => { return payment_type_ids.indexOf(pt.payment_type_id) === -1; }));
                    let department_control_ids = department.controls.map((c) => { return c.control_id; });
                    Transaction.controls = Transaction.controls.concat(department.controls.filter((c) => { return department_control_ids.indexOf(c.control_id) === -1; }));
                    department.control_groups = Transaction.ControlGroup.CreateControlGroups(department.controls);
                    for (let paymentType of department.payment_types) {
                        paymentType.control_groups = Transaction.ControlGroup.CreateControlGroups(paymentType.controls);
                    }
                }
                for (let payment_type of Transaction.payment_types) {
                    let control_ids = Transaction.controls.map((c) => { return c.control_id; });
                    Transaction.controls = Transaction.controls.concat(payment_type.controls.filter((c) => { return control_ids.indexOf(c.control_id) === -1; }));
                }
            });
            yield Transaction.GetAllNames()
                .then(names => {
                let filterNames = document.getElementById("nameFilter");
                let depositNames = document.getElementById("depositNameFilter");
                for (let name of names) {
                    filterNames.add(Utilities.Create_Option(name, name, false));
                    depositNames.add(Utilities.Create_Option(name, name, false));
                }
            });
            yield Transaction.GetTransactionList(1);
            setInterval(() => {
                var d = new Date();
                var now_hours = d.getHours();
                // putting a limit on when we do the refreshing.  We stop at 7 PM and start again at 6 AM.
                if (now_hours > 5 && now_hours < 19) {
                    Transaction.GetTransactionList(Transaction.current_page, false);
                }
            }, 60 * 5 * 1000);
        });
    }
    Transaction.Start = Start;
    function ShowReceipt(transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Data.TransactionData.GetSpecificTransaction(transaction_id)
                .then((transaction) => {
                console.log('transaction to show', transaction);
                Transaction.currentReceipt = new Transaction.Receipt(transaction);
                Transaction.currentReceipt.ShowReceipt(transaction);
            });
        });
    }
    Transaction.ShowReceipt = ShowReceipt;
    function ShowReceiptDetail(transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Data.TransactionData.GetSpecificTransaction(transaction_id)
                .then((transaction) => {
                console.log('transaction to show', transaction);
                Transaction.currentReceipt = new Transaction.Receipt(transaction);
                Transaction.ViewReceiptDetail();
            });
        });
    }
    Transaction.ShowReceiptDetail = ShowReceiptDetail;
    function GetTransactionList(page, change_view = true) {
        return __awaiter(this, void 0, void 0, function* () {
            Transaction.current_page = page;
            yield Transaction.Data.TransactionData.GetTransactionList()
                .then((tv) => {
                Transaction.transactions = tv;
                Transaction.Data.TransactionData.RenderTransactionList(tv);
                console.log('transactions', Transaction.transactions);
                Utilities.Toggle_Loading_Button(Transaction.Data.TransactionData.reload_button, false);
                if (change_view)
                    Transaction.ViewTransactions();
            });
            yield Transaction.Data.TransactionData.GetTransactionPageCount()
                .then((pagecount) => {
                Transaction.page_count = pagecount;
                HandlePagination();
            });
        });
    }
    Transaction.GetTransactionList = GetTransactionList;
    function NewReceipt() {
        Transaction.currentReceipt = new Transaction.Receipt();
        let current_receipt_link = document.getElementById("linkReceiptInProgress");
        current_receipt_link.classList.remove("has-background-grey-light", "has-text-grey");
        current_receipt_link.style.cursor = "pointer";
        Transaction.ViewReceiptDetail();
    }
    Transaction.NewReceipt = NewReceipt;
    function ResetReceipt() {
        Transaction.currentReceipt = new Transaction.Receipt();
        Transaction.currentReceipt = null;
        let current_receipt_link = document.getElementById("linkReceiptInProgress");
        current_receipt_link.classList.add("has-background-grey-light", "has-text-grey");
        current_receipt_link.style.cursor = "default";
    }
    Transaction.ResetReceipt = ResetReceipt;
    function NewDeposit() {
    }
    Transaction.NewDeposit = NewDeposit;
    function GetPath() {
        let path = "/";
        let i = window.location.pathname.toLowerCase().indexOf("/clayfinancial");
        if (i == 0) {
            path = "/clayfinancial/";
        }
        return path;
    }
    Transaction.GetPath = GetPath;
    function FindPaymentType(payment_type_id) {
        let filtered = Transaction.payment_types.filter((pt) => pt.payment_type_id === payment_type_id);
        return (filtered.length === 1) ? filtered[0] : null;
    }
    Transaction.FindPaymentType = FindPaymentType;
    function FindControl(control_id) {
        let filtered = Transaction.controls.filter((c) => c.control_id === control_id);
        return (filtered.length === 1) ? filtered[0] : null;
    }
    Transaction.FindControl = FindControl;
    function PopulateFilters() {
        let departmentSelect = document.getElementById("departmentFilter");
        departmentSelect.add(Utilities.Create_Option("", "All Departments", true));
        for (let d of Transaction.departments) {
            departmentSelect.add(Utilities.Create_Option(d.department_id.toString(), d.name, false));
        }
        let nameSelect = document.getElementById("nameFilter");
        nameSelect.add(Utilities.Create_Option("mine", "My Transactions", true));
        nameSelect.add(Utilities.Create_Option("", "All Users", false));
        let depositNameSelect = document.getElementById("depositNameFilter");
        depositNameSelect.add(Utilities.Create_Option("", "Select A Name to Deposit", true));
        depositNameSelect.add(Utilities.Create_Option("mine", "My Transactions", false));
        let statusSelect = document.getElementById("statusFilter");
        statusSelect.add(Utilities.Create_Option("", "All Statuses", false));
        statusSelect.add(Utilities.Create_Option("i", "Incomplete", true));
        statusSelect.add(Utilities.Create_Option("c", "Completed", false));
        let typeSelect = document.getElementById("typeFilter");
        typeSelect.add(Utilities.Create_Option("", "All Types", true));
        typeSelect.add(Utilities.Create_Option("R", "Receipts", false));
        typeSelect.add(Utilities.Create_Option("D", "Deposits", false));
    }
    function SearchOnEnter(event) {
        var e = event || window.event;
        if (event.keyCode == 13) {
            console.log('enter');
            Transaction.FilterTransactions();
        }
    }
    Transaction.SearchOnEnter = SearchOnEnter;
    function FilterTransactions() {
        Transaction.department_id_filter = parseInt(Utilities.Get_Value("departmentFilter"));
        Transaction.name_filter = Utilities.Get_Value("nameFilter");
        Transaction.completed_filter = Utilities.Get_Value("statusFilter");
        Transaction.transaction_type_filter = Utilities.Get_Value("typeFilter");
        Transaction.transaction_number_filter = Utilities.Get_Value("transactionNumberFilter");
        Transaction.modified_only_filter = document.getElementById("modifiedFilter").checked;
        Transaction.GetTransactionList(1);
    }
    Transaction.FilterTransactions = FilterTransactions;
    function ViewReceiptInProgress() {
        if (!Transaction.currentReceipt === null) {
            ViewReceiptDetail();
        }
    }
    Transaction.ViewReceiptInProgress = ViewReceiptInProgress;
    function HideAllViews() {
        Utilities.Hide(Transaction.deposit_view_container);
        Utilities.Hide(Transaction.Data.TransactionData.transaction_view_container);
        Utilities.Hide(Transaction.Data.TransactionData.action_container);
        Utilities.Hide(Transaction.Receipt.receipt_container);
    }
    function ViewReceiptDetail() {
        HideAllViews();
        Utilities.Show(Transaction.Data.TransactionData.action_container);
    }
    Transaction.ViewReceiptDetail = ViewReceiptDetail;
    function ViewPrintableReceipt() {
        HideAllViews();
        Utilities.Show(Transaction.Receipt.receipt_container);
    }
    Transaction.ViewPrintableReceipt = ViewPrintableReceipt;
    function ViewTransactions() {
        HideAllViews();
        Utilities.Show(Transaction.Data.TransactionData.transaction_view_container);
    }
    Transaction.ViewTransactions = ViewTransactions;
    function ViewDeposit() {
        HideAllViews();
        Utilities.Show(Transaction.deposit_view_container);
        Utilities.Hide("createDepositButton");
        Utilities.Set_Value("depositNameFilter", "");
    }
    Transaction.ViewDeposit = ViewDeposit;
    function PreviousPage(element) {
        if (element.getAttribute("disabled") === null)
            GetTransactionList(Transaction.current_page - 1);
    }
    Transaction.PreviousPage = PreviousPage;
    function NextPage(element) {
        if (element.getAttribute("disabled") === null)
            GetTransactionList(Transaction.current_page + 1);
    }
    Transaction.NextPage = NextPage;
    function HandlePagination() {
        // Handle next/previous pages
        let previousPage = document.getElementById("resultsPreviousPage");
        let nextPage = document.getElementById("resultsNextPage");
        if (Transaction.current_page === 1) {
            previousPage.setAttribute("disabled", "");
        }
        else {
            previousPage.removeAttribute("disabled");
        }
        if (Transaction.page_count <= Transaction.current_page) {
            nextPage.setAttribute("disabled", "");
        }
        else {
            nextPage.removeAttribute("disabled");
        }
        // now that we've handled the next/previous buttons, let's reset the current page in the hash.
        let pageList = document.getElementById("resultsPaginationList");
        Utilities.Clear_Element(pageList);
        pageList.appendChild(CreatePaginationLinks());
    }
    function CreatePaginationLinks() {
        // Scenarios
        // if the number of pages is 7 or less
        //    create a link for every page
        //    nothing else to worry about
        // if the number of pages is > 7 
        //    if the current page is 2 or less or total pages - 2 or more
        //      show pages 1 through 3 an ellipsis, and then last page - 3 to last page
        //    if the current page is 3 or total pages - 3 
        //      show pages 1 through 4 an ellipsis, and then last page - 2 to last page
        // Otherwise
        //    show page 1 then an ellipsis then currentpage - 1 through current page + 1 then last page
        let currentPage = Transaction.current_page;
        let totalPages = Transaction.page_count;
        let df = document.createDocumentFragment();
        if (currentPage < 1)
            Transaction.current_page = 1;
        if (currentPage > totalPages)
            currentPage = totalPages;
        if (totalPages < 8) {
            // add a link to every page
            for (let i = 1; i <= totalPages; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            return df;
        }
        if (currentPage === 3) {
            for (let i = 1; i <= 4; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            df.appendChild(CreatePaginationEllipsis());
            for (let i = totalPages - 1; i <= totalPages; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            return df;
        }
        if (currentPage === (totalPages - 2)) {
            for (let i = 1; i <= 2; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            df.appendChild(CreatePaginationEllipsis());
            for (let i = totalPages - 3; i <= totalPages; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            return df;
        }
        if (currentPage < 3 || currentPage > totalPages - 3) {
            // add links to the first 3 pages and last 3 pages
            for (let i = 1; i <= 3; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            df.appendChild(CreatePaginationEllipsis());
            for (let i = totalPages - 2; i <= totalPages; i++) {
                df.appendChild(CreatePaginationLink(i, i === currentPage));
            }
            return df;
        }
        // add links to the first page, currentpage -1 through currentpage + 1, and last page
        df.appendChild(CreatePaginationLink(1, false));
        df.appendChild(CreatePaginationEllipsis());
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            df.appendChild(CreatePaginationLink(i, i === currentPage));
        }
        df.appendChild(CreatePaginationEllipsis());
        df.appendChild(CreatePaginationLink(totalPages, false));
        return df;
    }
    function CreatePaginationLink(page, isSelected) {
        // scroll back up to the top when a page is clicked
        //currentHash.page = page.toString();
        //currentHash.permit_display = "";
        //currentHash.permit_print = "";
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.classList.add("pagination-link");
        a.setAttribute("aria-label", "Goto page " + page.toString());
        if (isSelected) {
            a.classList.add("is-current");
            a.setAttribute("aria-current", "page");
            a.style.cursor = "default";
        }
        else {
            a.onclick = () => {
                Transaction.GetTransactionList(page);
                let header = document.getElementById("transaction_list_view_header");
                if (header !== null)
                    header.scrollIntoView(true);
            };
        }
        a.appendChild(document.createTextNode(page.toString()));
        li.appendChild(a);
        return li;
    }
    function CreatePaginationEllipsis() {
        let li = document.createElement("li");
        let span = document.createElement("span");
        span.classList.add("pagination-ellipsis");
        span.innerHTML = "&hellip;";
        li.appendChild(span);
        return li;
    }
    function CreateMessageRow(colspan, message) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = colspan;
        td.appendChild(document.createTextNode(message));
        tr.appendChild(td);
        return tr;
    }
    Transaction.CreateMessageRow = CreateMessageRow;
    function ShowChangeModal() {
        Transaction.editing_control_data = null;
        Transaction.editing_payment_method_data = null;
        document.getElementById("change_transaction").classList.add("is-active");
    }
    Transaction.ShowChangeModal = ShowChangeModal;
    function CloseChangeModal() {
        document.getElementById("change_transaction").classList.remove("is-active");
    }
    Transaction.CloseChangeModal = CloseChangeModal;
    function LoadControlDataChange(control_data_id, transaction_id, field_label) {
        Utilities.Set_Text("change_field_label", field_label);
        Transaction.ShowChangeModal();
        Transaction.Data.ControlData.GetAndDisplayControlHistory(control_data_id, transaction_id)
            .then(() => {
        });
    }
    Transaction.LoadControlDataChange = LoadControlDataChange;
    function LoadPaymentTypeDataChange(payment_method_data_id, is_cash, transaction_id, field_label) {
        Utilities.Set_Text("change_field_label", field_label);
        Transaction.ShowChangeModal();
        Transaction.Data.PaymentMethodData.GetAndDisplayHistory(payment_method_data_id, transaction_id, is_cash)
            .then(() => {
        });
    }
    Transaction.LoadPaymentTypeDataChange = LoadPaymentTypeDataChange;
    function SaveChanges() {
        Utilities.Toggle_Loading_Button("change_transaction_save", true);
        let reason = Utilities.Get_Value(Transaction.reason_for_change_input).trim();
        if (reason.length === 0) {
            let input = document.getElementById(Transaction.reason_for_change_input);
            let container = document.getElementById(Transaction.reason_for_change_input_container);
            Transaction.ControlGroup.UpdateInputError(input, container, "This is required.");
            Utilities.Toggle_Loading_Button("change_transaction_save", false);
            return;
        }
        if (Transaction.editing_control_data !== null) {
            if (!Transaction.editing_control_data.Validate()) {
                Utilities.Toggle_Loading_Button("change_transaction_save", false);
                return;
            }
            Transaction.editing_control_data.reason_for_change = reason;
            Transaction.editing_control_data.SaveControlChanges();
            Transaction.GetTransactionList(Transaction.current_page);
        }
        else {
            if (!Transaction.editing_payment_method_data.Validate()) {
                Utilities.Toggle_Loading_Button("change_transaction_save", false);
                return;
            }
            Transaction.editing_payment_method_data.reason_for_change = reason;
            Transaction.editing_payment_method_data.SaveChanges();
            Transaction.GetTransactionList(Transaction.current_page);
        }
    }
    Transaction.SaveChanges = SaveChanges;
    function GetAllNames() {
        let path = Transaction.GetPath();
        return Utilities.Get(path + "API/Transaction/GetAllNames");
    }
    Transaction.GetAllNames = GetAllNames;
    function GetDepositCount() {
        return __awaiter(this, void 0, void 0, function* () {
            Utilities.Hide("createDepositButton");
            Utilities.Set_Value("depositCount", "0");
            let name = Utilities.Get_Value("depositNameFilter");
            if (name.length === 0)
                return;
            let path = Transaction.GetPath();
            yield Utilities.Get_Empty(path + "API/Transaction/GetDepositCount?name=" + name)
                .then(response_text => {
                let count = parseInt(response_text);
                Utilities.Set_Value("depositCount", response_text);
                if (count > 0) {
                    Utilities.Show("createDepositButton");
                }
            });
        });
    }
    Transaction.GetDepositCount = GetDepositCount;
    function CreateDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            Utilities.Toggle_Loading_Button("createDepositButton", true);
            yield GetDepositCount()
                .then(() => {
                let count = parseInt(Utilities.Get_Value("depositCount"));
                if (!isNaN(count) && count > 0) {
                    let name = Utilities.Get_Value("depositNameFilter");
                    let path = Transaction.GetPath();
                    Utilities.Post(path + "API/Transaction/CreateDeposit?selected_user_display_name=" + name, null)
                        .then(transaction => {
                        let transaction_id = transaction.transaction_id;
                        Transaction.ShowReceiptDetail(transaction_id);
                        Transaction.GetTransactionList(Transaction.current_page, false);
                        Utilities.Toggle_Loading_Button("createDepositButton", false);
                    }, error => {
                        console.log("error!", error);
                        Utilities.Toggle_Loading_Button("createDepositButton", false);
                    });
                }
                else {
                    Utilities.Toggle_Loading_Button("createDepositButton", false);
                    alert("The Receipts ready for deposit was updated, a deposit can not be created at this time.");
                    return;
                }
            });
        });
    }
    Transaction.CreateDeposit = CreateDeposit;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=app.js.map
var Utilities;
(function (Utilities) {
    class LevelItem {
        constructor(Heading, TitleText, Title, ...Classes) {
            this.classes = [];
            this.heading = "";
            this.title = null;
            this.title_text = "";
            this.heading = Heading;
            this.title = Title;
            if (TitleText.length > 0) {
                this.title_text = TitleText;
                this.title = null;
            }
            if (Classes.length > 0)
                this.classes.push(...Classes);
        }
    }
    Utilities.LevelItem = LevelItem;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=LevelItem.js.map
var Transaction;
(function (Transaction) {
    class ControlGroup {
        constructor() {
            this.percent_used = 0;
            this.controls = [];
        }
        static CreateControlGroups(controls) {
            let controlgroups = [];
            let controlGroup = new ControlGroup();
            for (let control of controls) {
                if (control.is_active) {
                    control.rendered_input_element = Transaction.Control.CreateControl(control);
                    controlGroup.controls.push(control);
                }
            }
            controlgroups.push(controlGroup);
            return controlgroups;
        }
        static CreateSavedControlGroups(controls) {
            let controlgroups = [];
            let controlGroup = new ControlGroup();
            for (let controldata of controls) {
                controldata.control.rendered_input_element = Transaction.Control.CreateSavedControl(controldata);
                controlGroup.controls.push(controldata.control);
            }
            controlgroups.push(controlGroup);
            return controlgroups;
        }
        static CreateInputFieldContainerByControl(control, input, add_column = false, class_to_add = "") {
            return this.CreateInputFieldContainer(input, control.label, add_column, control.render_hints);
        }
        static CreateInputFieldContainer(input, field_label, add_column = false, class_to_add = "", guide_message_capable = false) {
            let editFunction = null;
            if (input.getAttribute("transaction_id") !== null) {
                // payment_method_data_id
                // department id?
                let transaction_id = input.getAttribute("transaction_id");
                let control_data_id = input.getAttribute("control_data_id");
                if (control_data_id !== null) {
                    editFunction = () => {
                        Transaction.LoadControlDataChange(control_data_id, transaction_id, field_label);
                    };
                }
                else {
                    let payment_method_data_id = input.getAttribute("payment_method_data_id");
                    let is_cash = input.getAttribute("is_cash").toLowerCase() === "true";
                    editFunction = () => {
                        Transaction.LoadPaymentTypeDataChange(payment_method_data_id, is_cash, transaction_id, field_label);
                    };
                }
            }
            if (editFunction !== null) {
                input.onclick = () => {
                    editFunction();
                };
            }
            let field = document.createElement("div");
            field.classList.add("field");
            let label = document.createElement("label");
            label.classList.add("label", Transaction.app_input_size);
            if (field_label.length > 0) {
                label.appendChild(document.createTextNode(field_label));
            }
            else {
                label.innerHTML = "&nbsp;";
            }
            field.appendChild(label);
            if (input.getAttribute("transaction_id") !== null) {
                let edit = document.createElement("a");
                edit.style.marginLeft = ".5em";
                edit.style.fontSize = ".75em";
                edit.style.fontWeight = "400";
                edit.onclick = () => { editFunction(); };
                edit.appendChild(document.createTextNode("edit"));
                label.appendChild(edit);
            }
            let control_element = document.createElement("div");
            control_element.classList.add("control");
            control_element.appendChild(input);
            field.appendChild(control_element);
            if (guide_message_capable) {
                let guide_element = document.createElement("p");
                guide_element.classList.add("help", "guide");
                field.appendChild(guide_element);
            }
            let error_element = document.createElement("p");
            error_element.classList.add("help", "is-danger");
            field.appendChild(error_element);
            if (add_column) {
                let column = document.createElement("div");
                column.classList.add("column");
                if (class_to_add.length > 0)
                    column.classList.add(class_to_add);
                column.appendChild(field);
                return column;
            }
            if (class_to_add.length > 0)
                field.classList.add(class_to_add);
            return field;
        }
        static CreateButtonlistFieldContainer(inputs, field_label, add_column = false, class_to_add = "") {
            let field = document.createElement("div");
            field.classList.add("field");
            let label = document.createElement("label");
            label.classList.add("label", Transaction.app_input_size);
            if (field_label.length > 0) {
                label.appendChild(document.createTextNode(field_label));
            }
            else {
                label.innerHTML = "&nbsp;";
            }
            field.appendChild(label);
            let control = document.createElement("div");
            control.classList.add("control");
            let buttonlist = document.createElement("div");
            buttonlist.classList.add("buttons");
            for (let input of inputs) {
                buttonlist.appendChild(input);
            }
            control.appendChild(buttonlist);
            field.appendChild(control);
            if (add_column) {
                let column = document.createElement("div");
                column.classList.add("column");
                if (class_to_add.length > 0)
                    column.classList.add(class_to_add);
                column.appendChild(field);
                return column;
            }
            if (class_to_add.length > 0)
                field.classList.add(class_to_add);
            return field;
        }
        static CreateSelectFieldContainerByControl(control, select, add_column = false) {
            return this.CreateSelectFieldContainer(select, control.label, add_column, control.render_hints);
        }
        static CreateSelectFieldContainer(select, field_label, add_column = false, class_to_add = "") {
            let field = document.createElement("div");
            field.classList.add("field");
            if (add_column) {
                field.classList.add("column");
                if (class_to_add.length > 0)
                    field.classList.add(class_to_add);
            }
            let label = document.createElement("label");
            label.classList.add("label", "is-normal");
            label.appendChild(document.createTextNode(field_label));
            field.appendChild(label);
            if (select.getAttribute("transaction_id") !== null) {
                let edit = document.createElement("a");
                edit.style.marginLeft = ".5em";
                edit.style.fontSize = ".75em";
                edit.style.fontWeight = "400";
                let transaction_id = select.getAttribute("transaction_id");
                let control_data_id = select.getAttribute("control_data_id");
                edit.onclick = () => { Transaction.LoadControlDataChange(control_data_id, transaction_id, field_label); };
                edit.appendChild(document.createTextNode("edit"));
                label.appendChild(edit);
            }
            let control_element = document.createElement("div");
            control_element.classList.add("control");
            let selectContainer = document.createElement("div");
            selectContainer.classList.add("select", "is-normal");
            selectContainer.appendChild(select);
            control_element.appendChild(selectContainer);
            field.appendChild(control_element);
            let error_element = document.createElement("p");
            error_element.classList.add("help", "is-danger");
            field.appendChild(error_element);
            return field;
        }
        CreateControlData(target_container, clone_node = true) {
            let control_data = [];
            let group_element = document.createElement("div");
            group_element.classList.add("columns", "is-multiline");
            target_container.appendChild(group_element);
            for (let control of this.controls) {
                let cd = new Transaction.Data.ControlData(control, -1, clone_node);
                control_data.push(cd);
                group_element.appendChild(cd.container_element);
            }
            return control_data;
        }
        static CreateInput(input_type, input_length, is_required, placeholder, input_value = "") {
            let input = document.createElement("input");
            input.type = input_type;
            input.maxLength = input_length;
            input.classList.add("input", "is-normal");
            if (input.type === "number") {
                input.onwheel = (e) => { e.preventDefault(); };
                input.step = "0.01";
                input.min = "0";
            }
            input.placeholder = placeholder;
            input.required = is_required;
            input.value = input_value;
            return input;
        }
        static UpdateSelectError(container, error_text = "") {
            let error_element = container.querySelector("p.help.is-danger");
            let select_element = container.querySelector("div.select");
            if (error_text.length === 0) {
                Utilities.Clear_Element(error_element);
                select_element.classList.remove("is-danger");
            }
            else {
                Utilities.Simple_Error_Show(error_element, error_text);
                select_element.classList.add("is-danger");
                if (!Transaction.error_scrolled) {
                    Transaction.error_scrolled = true;
                    container.scrollIntoView(true);
                }
            }
        }
        static UpdateInputError(input, container, error_text = "") {
            let error_element = container.querySelector("p.help.is-danger");
            if (error_text.length === 0) {
                Utilities.Clear_Element(error_element);
                input.classList.remove("is-danger");
            }
            else {
                Utilities.Simple_Error_Show(error_element, error_text);
                input.classList.add("is-danger");
                if (!Transaction.error_scrolled) {
                    Transaction.error_scrolled = true;
                    container.scrollIntoView(true);
                }
            }
        }
        static UpdateInputGuide(container, guide_text = "") {
            let guide_element = container.querySelector("p.help.guide");
            if (guide_element === null) {
                console.log('UpdateInputGuide called, no guide elements found', container, guide_text);
                return;
            }
            Utilities.Set_Text(guide_element, guide_text);
        }
        static ValidateDropdown(input, container, valid_values) {
            let e = "";
            if (input.value === "-1") {
                e = "You must choose one of these options.";
            }
            if (valid_values.indexOf(input.value) === -1 && e.length === 0) {
                e = "Please select a valid value.";
            }
            ControlGroup.UpdateSelectError(container, e);
            return e.length === 0;
        }
        static ValidateDate(input, container) {
            let e = "";
            //let input = <HTMLInputElement>this.input_element;
            if (input.valueAsDate === null && input.required) {
                e = "You must selected a date.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateText(input, container) {
            let e = "";
            if (input.required && input.value.length === 0) {
                e = "This field is required.";
            }
            if (input.maxLength > 0 && input.value.length > input.maxLength && e.length === 0) {
                e = "You entered " + input.value.length.toString() + " characters but " + input.maxLength.toString() + " is the maximum number of characters allowed.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateNumber(input, container) {
            let e = "";
            if (input.value.length === 0) {
                e = "You must enter a number. (No commas or $ allowed).";
            }
            if (input.valueAsNumber === NaN && e.length === 0) {
                e = "Please enter Numbers and Decimal points only.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateCount(input, container) {
            let e = "";
            if (input.value.length === 0 && input.required) {
                e = "You must enter a number. (No commas, decimal points, or $ allowed).";
            }
            if (input.valueAsNumber === NaN && e.length === 0) {
                e = "Please enter Numbers only.";
            }
            if (input.valueAsNumber < 0) {
                e = "This value must be 0 or greater.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateMoney(input, container) {
            let e = "";
            if (input.value.length === 0) {
                e = "You must enter a number. (No commas or $ allowed).";
            }
            if (input.valueAsNumber === NaN && e.length === 0) {
                e = "Please enter Numbers and Decimal points only.";
            }
            if (input.valueAsNumber < 0 && e.length === 0) {
                e = "Negative numbers are not allowed.";
            }
            let i = input.value.split(".");
            if (i.length === 2 && e.length === 0) {
                if (i[1].length > 2) {
                    e = "Too many digits after the decimal place. Amounts are limited to 2 digits after the decimal place.";
                }
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
    }
    Transaction.ControlGroup = ControlGroup;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlGroup.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentMethodData {
            constructor(is_cash, show_cancel = false, element_id, payment_method_amount_change, saved_payment_method_data = null) {
                this.payment_method_data_id = -1;
                this.prior_payment_method_data_id = -1;
                this.transaction_payment_type_id = -1;
                this.transaction_id = -1;
                this.cash_amount = 0;
                this.check_amount = 0;
                this.check_count = 0;
                this.check_number = "";
                this.check_from = "";
                this.paying_for = "";
                this.is_active = true;
                this.added_after_save = false;
                this.modified_by = "";
                this.modified_on = new Date();
                this.reason_for_change = "";
                this.error_text = "";
                //client side specific properties
                this.is_cash = false;
                this.show_cancel = false;
                this.cash_amount_input_element = null;
                this.cash_amount_input_element_container = null;
                this.check_amount_input_element = null;
                this.check_amount_input_element_container = null;
                this.check_count_input_element = null;
                this.check_count_input_element_container = null;
                this.check_number_input_element = null;
                this.check_number_input_element_container = null;
                this.paying_for_input_element = null;
                this.paying_for_input_element_container = null;
                this.check_from_input_element = null;
                this.check_from_input_element_container = null;
                this.add_check_button_element = null;
                this.cancel_check_button_element = null;
                this.check_buttons_container_element = null;
                this.payment_method_change = () => { };
                this.validate_money_regex = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";
                this.control_to_render = null;
                this.is_cash = is_cash;
                this.show_cancel = show_cancel;
                this.payment_method_data_id = element_id;
                this.payment_method_change = payment_method_amount_change;
                is_cash ? this.RenderCashControls(saved_payment_method_data) : this.RenderCheckControls(saved_payment_method_data);
            }
            Validate() {
                if (this.is_cash)
                    return this.ValidateCash();
                return this.ValidateCheck();
            }
            ValidateCash() {
                let is_valid = true;
                let v = this.ValidateCashAmount();
                if (!v && is_valid)
                    is_valid = v;
                //v = this.ValidatePayingFor();
                //if (!v && is_valid) is_valid = v;
                return is_valid;
            }
            ValidateCashAmount() {
                return Transaction.ControlGroup.ValidateMoney(this.cash_amount_input_element, this.cash_amount_input_element_container);
            }
            ValidateCheck() {
                let is_valid = true;
                let v = this.ValidateCheckAmount();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidateCheckCount();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidateCheckNumber();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidateCheckFrom();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidatePayingFor();
                if (!v && is_valid)
                    is_valid = v;
                return is_valid;
            }
            ValidateCheckAmount() {
                return Transaction.ControlGroup.ValidateMoney(this.check_amount_input_element, this.check_amount_input_element_container);
            }
            ValidateCheckCount() {
                return Transaction.ControlGroup.ValidateCount(this.check_count_input_element, this.check_count_input_element_container);
            }
            ValidateCheckNumber() {
                let input = this.check_number_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check is entered.";
                }
                if (input.value.length === 0 && this.check_amount > 0 && this.check_count === 1) {
                    e = "A check number is required when you enter a check amount and set the check count to 1 check.";
                }
                if (input.value.length > 50) {
                    e = "The check number can be at most 50 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.check_number_input_element, this.check_number_input_element_container, e);
                return e.length === 0;
            }
            ValidatePayingFor() {
                let input = this.paying_for_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check amount is entered.";
                }
                if (input.value.length > 500) {
                    e = "This field can be at most 500 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.paying_for_input_element, this.paying_for_input_element_container, e);
                return e.length === 0;
            }
            ValidateCheckFrom() {
                let input = this.check_from_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check amount is entered.";
                }
                if (input.value.length === 0 && this.check_amount > 0 && this.check_count === 1) {
                    e = "This field is required if you enter a check amount and set the check count to 1 check.";
                }
                if (input.value.length > 500) {
                    e = "This field can be at most 500 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.check_from_input_element, this.check_from_input_element_container, e);
                return e.length === 0;
            }
            RenderCashControls(payment_method_data) {
                let columns = document.createElement("div");
                columns.classList.add("columns");
                this.cash_amount_input_element = Transaction.ControlGroup.CreateInput("number", 15, true, "0");
                if (payment_method_data === null) {
                    this.cash_amount_input_element.oninput = (event) => {
                        this.cash_amount = 0;
                        if (this.ValidateCashAmount()) {
                            this.cash_amount = this.cash_amount_input_element.valueAsNumber;
                        }
                        this.payment_method_change();
                    };
                }
                else {
                    this.cash_amount_input_element.value = payment_method_data.cash_amount.toString();
                    this.cash_amount_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.cash_amount_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.cash_amount_input_element.setAttribute("is_cash", "true");
                }
                this.cash_amount_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter");
                columns.appendChild(this.cash_amount_input_element_container);
                this.control_to_render = columns;
            }
            RenderCheckControls(payment_method_data) {
                let columns = document.createElement("div");
                columns.classList.add("columns", "is-multiline", "check");
                this.check_amount_input_element = Transaction.ControlGroup.CreateInput("number", 15, false, "0");
                if (payment_method_data === null) {
                    this.check_amount_input_element.oninput = (event) => {
                        this.check_amount = 0;
                        if (this.ValidateCheckAmount()) {
                            this.check_amount = this.check_amount_input_element.valueAsNumber;
                            if (this.check_amount > 0) {
                                Utilities.Show_Flex(this.check_buttons_container_element);
                                this.check_count_input_element.required = true;
                            }
                            else {
                                Utilities.Hide(this.check_buttons_container_element);
                                this.check_count_input_element.required = false;
                            }
                        }
                        this.payment_method_change();
                    };
                }
                else {
                    this.check_amount_input_element.readOnly = true;
                    this.check_amount_input_element.value = payment_method_data.check_amount.toString();
                    this.check_amount_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_amount_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_amount_input_element.setAttribute("is_cash", "false");
                }
                this.check_count_input_element = Transaction.ControlGroup.CreateInput("number", 5, false, "# of Checks");
                this.check_count_input_element.step = "1";
                this.check_count_input_element.min = "0";
                if (payment_method_data === null) {
                    this.check_count_input_element.oninput = (event) => {
                        if (this.ValidateCheckCount()) {
                            this.check_count = event.target.valueAsNumber;
                            if (this.check_amount > 0) {
                                switch (this.check_count) {
                                    case 0:
                                        Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Partial Check");
                                        break;
                                    case 1:
                                        Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Single Check");
                                        break;
                                    default:
                                        Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Bulk Check");
                                }
                            }
                            else {
                                Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "");
                            }
                        }
                        else {
                            Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "");
                        }
                        this.payment_method_change();
                    };
                }
                else {
                    this.check_count_input_element.readOnly = true;
                    this.check_count_input_element.value = payment_method_data.check_count.toString();
                    this.check_count_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_count_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_count_input_element.setAttribute("is_cash", "false");
                }
                this.check_number_input_element = Transaction.ControlGroup.CreateInput("text", 50, false, "Check Number");
                if (payment_method_data === null) {
                    this.check_number_input_element.oninput = (event) => {
                        if (this.ValidateCheckNumber()) {
                            this.check_number = event.target.value;
                        }
                    };
                }
                else {
                    this.check_number_input_element.readOnly = true;
                    this.check_number_input_element.value = payment_method_data.check_number;
                    this.check_number_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_number_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_number_input_element.setAttribute("is_cash", "false");
                }
                this.paying_for_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check Paying For");
                if (payment_method_data === null) {
                    this.paying_for_input_element.oninput = (event) => {
                        if (this.ValidatePayingFor()) {
                            this.paying_for = event.target.value;
                        }
                    };
                }
                else {
                    this.paying_for_input_element.readOnly = true;
                    this.paying_for_input_element.value = payment_method_data.paying_for;
                    this.paying_for_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.paying_for_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.paying_for_input_element.setAttribute("is_cash", "false");
                }
                this.check_from_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check From");
                if (payment_method_data === null) {
                    this.check_from_input_element.oninput = (event) => {
                        if (this.ValidateCheckFrom()) {
                            this.check_from = event.target.value;
                        }
                    };
                }
                else {
                    this.check_from_input_element.readOnly = true;
                    this.check_from_input_element.value = payment_method_data.check_from;
                    this.check_from_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_from_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_from_input_element.setAttribute("is_cash", "false");
                }
                this.add_check_button_element = document.createElement("button");
                this.add_check_button_element.classList.add("button", "is-info", Transaction.app_input_size);
                this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));
                this.check_amount_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter");
                columns.appendChild(this.check_amount_input_element_container);
                this.check_count_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_count_input_element, "# of Checks", true, "is-2", true);
                columns.appendChild(this.check_count_input_element_container);
                this.check_number_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter");
                columns.appendChild(this.check_number_input_element_container);
                if (this.show_cancel) {
                    let buttons = [];
                    this.cancel_check_button_element = document.createElement("button");
                    this.cancel_check_button_element.classList.add("button", "is-warning", Transaction.app_input_size);
                    this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));
                    buttons.push(this.add_check_button_element);
                    buttons.push(this.cancel_check_button_element);
                    this.check_buttons_container_element = Transaction.ControlGroup.CreateButtonlistFieldContainer(buttons, "", true, "is-one-quarter");
                }
                else {
                    this.check_buttons_container_element = Transaction.ControlGroup.CreateInputFieldContainer(this.add_check_button_element, "", true, "is-one-quarter");
                    if (payment_method_data === null) {
                        this.check_buttons_container_element.classList.add("hide");
                    }
                }
                columns.appendChild(this.check_buttons_container_element);
                this.paying_for_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half");
                columns.appendChild(this.paying_for_input_element_container);
                this.check_from_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half");
                columns.appendChild(this.check_from_input_element_container);
                this.control_to_render = columns;
            }
            static GetHistory(payment_method_data_id, transaction_id) {
                let path = Transaction.GetPath();
                return Utilities.Get(path + "API/Transaction/GetPaymentMethodHistory?payment_method_data_id=" + payment_method_data_id + "&transaction_id=" + transaction_id);
            }
            SaveChanges() {
                let path = Transaction.GetPath();
                Utilities.Post_Empty(path + "API/Transaction/EditPaymentMethod", this)
                    .then(response => {
                    response.text().then(text => {
                        if (text.length === 0) // success!
                         {
                            Transaction.CloseChangeModal();
                            Transaction.ShowReceiptDetail(this.transaction_id);
                            Transaction.editing_control_data = null;
                            Transaction.editing_payment_method_data = null;
                            Transaction.GetTransactionList(Transaction.current_page, false);
                        }
                        else {
                            alert("There was a problem saving this change." + '\r\n' + response);
                        }
                        Utilities.Toggle_Loading_Button("change_transaction_save", false);
                    });
                });
            }
            static GetAndDisplayHistory(payment_method_data_id, transaction_id, is_cash) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield PaymentMethodData.GetHistory(payment_method_data_id, transaction_id)
                        .then((history) => {
                        PaymentMethodData.MarkDataToEdit(history, is_cash);
                        PaymentMethodData.DisplayHistory(history, is_cash);
                        PaymentMethodData.DisplayEdit();
                    });
                });
            }
            static MarkDataToEdit(payment_method_data, is_cash) {
                Transaction.editing_control_data = null;
                Transaction.editing_payment_method_data = null;
                let filtered = payment_method_data.filter(x => x.is_active);
                if (filtered.length === 1) {
                    let p = filtered[0];
                    let pmd = new Data.PaymentMethodData(is_cash, false, p.payment_method_data_id, () => { });
                    pmd.payment_method_data_id = p.payment_method_data_id;
                    pmd.transaction_id = p.transaction_id;
                    pmd.transaction_payment_type_id = p.transaction_payment_type_id;
                    pmd.prior_payment_method_data_id = p.prior_payment_method_data_id;
                    pmd.is_active = true;
                    if (is_cash) {
                        pmd.cash_amount = p.cash_amount;
                        pmd.cash_amount_input_element.valueAsNumber = p.cash_amount;
                    }
                    else {
                        pmd.check_amount = p.check_amount;
                        pmd.check_amount_input_element.valueAsNumber = p.check_amount;
                        pmd.check_count = p.check_count;
                        pmd.check_count_input_element.valueAsNumber = p.check_count;
                        pmd.check_from = p.check_from;
                        pmd.check_from_input_element.value = p.check_from;
                        pmd.check_number = p.check_number;
                        pmd.check_number_input_element.value = p.check_number;
                        pmd.paying_for = p.paying_for;
                        pmd.paying_for_input_element.value = p.paying_for;
                    }
                    Transaction.editing_payment_method_data = pmd;
                }
                else {
                    alert("Invalid data stored in database for this transaction.");
                }
            }
            static DisplayEdit() {
                if (Transaction.editing_payment_method_data === null)
                    return;
                let container = document.getElementById(Transaction.change_edit_container);
                Utilities.Clear_Element(container);
                container.classList.remove("columns");
                let e = Transaction.editing_payment_method_data;
                Utilities.Clear_Element(e.check_buttons_container_element);
                container.appendChild(e.control_to_render);
                Utilities.Set_Value(Transaction.reason_for_change_input, "");
            }
            static CreateCashHistoryHeader() {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Cash Amount", "has-text-right", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "", "", "35%"));
                return tr;
            }
            static CreateCheckHistoryHeader() {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check Amount", "has-text-right", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check Count", "has-text-centered", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check #", "has-text-left", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-left", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Paying For", "has-text-left", "15%"));
                return tr;
            }
            static DisplayHistory(payment_method_data, is_cash) {
                let header = document.getElementById(Transaction.change_transaction_history_table_header);
                Utilities.Clear_Element(header);
                if (is_cash) {
                    header.appendChild(PaymentMethodData.CreateCashHistoryHeader());
                }
                else {
                    header.appendChild(PaymentMethodData.CreateCheckHistoryHeader());
                }
                let body = document.getElementById(Transaction.change_transaction_history_table_body);
                Utilities.Clear_Element(body);
                for (let pmd of payment_method_data) {
                    if (is_cash) {
                        body.appendChild(PaymentMethodData.CreateCashHistoryRow(pmd));
                    }
                    else {
                        body.appendChild(PaymentMethodData.CreateCheckHistoryRow(pmd));
                    }
                }
            }
            static CreateCashHistoryRow(data) {
                let tr = document.createElement("tr");
                if (new Date(data.modified_on).getFullYear() < 1000) {
                    let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
                    original.colSpan = 3;
                    tr.appendChild(original);
                }
                else {
                    tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.modified_on), "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.modified_by, "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.reason_for_change, "has-text-left"));
                }
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.cash_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", "", "", "35%"));
                return tr;
            }
            static CreateCheckHistoryRow(data) {
                let tr = document.createElement("tr");
                if (new Date(data.modified_on).getFullYear() < 1000) {
                    let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
                    original.colSpan = 3;
                    tr.appendChild(original);
                }
                else {
                    tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.modified_on), "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.modified_by, "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.reason_for_change, "has-text-left"));
                }
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.check_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", data.check_count.toString(), "has-text-centered"));
                tr.appendChild(Utilities.CreateTableCell("td", data.check_number, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.check_from, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.paying_for, "has-text-left"));
                return tr;
            }
        }
        Data.PaymentMethodData = PaymentMethodData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentMethodData.js.map
var Transaction;
(function (Transaction) {
    class PaymentType {
        constructor() {
            this.control_groups = [];
        }
        Constructor() { }
    }
    Transaction.PaymentType = PaymentType;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentType.js.map
var Transaction;
(function (Transaction) {
    class Control {
        constructor() {
            this.rendered_input_element = null;
            this.valid_values = [];
            this.is_printed = false;
        }
        Constructor() { }
        static CreateControl(control, value = null) {
            switch (control.data_type) {
                case "date":
                case "text":
                    return Control.CreateInput(control, value);
                case "number":
                case "money":
                case "count":
                    return Control.CreateNumericInput(control, value);
                case "bigtext":
                    return Control.CreateTextArea(control, value);
                case "dropdown":
                    return Control.CreateSelect(control, value);
            }
            return null;
        }
        static CreateSavedControl(control_data) {
            let control = Control.CreateControl(control_data.control, control_data.value);
            if (control.tagName.toLowerCase() !== "select") {
                control.readOnly = true;
            }
            else {
                control.disabled = true;
            }
            control.setAttribute("control_data_id", control_data.control_data_id.toString());
            control.setAttribute("transaction_id", control_data.transaction_id.toString());
            return control;
        }
        static CreateInput(control, value) {
            let input = document.createElement("input");
            input.type = control.data_type;
            input.maxLength = control.max_length;
            input.classList.add("input", Transaction.app_input_size);
            input.placeholder = control.label;
            input.required = control.required;
            if (input.type === "date" && value !== null) {
                let tmp = value.split("/");
                if (tmp.length === 3) {
                    let v = tmp[2] + '-';
                    v += tmp[0].length === 1 ? "0" + tmp[0] : tmp[0];
                    v += "-";
                    v += tmp[1].length === 1 ? "0" + tmp[1] : tmp[1];
                    input.value = v;
                }
                else {
                    input.value = value; // dates need to be in yyyy-mm-dd format
                }
            }
            else {
                input.value = value === null ? "" : value;
            }
            input.setAttribute("control_id", control.control_id.toString());
            return input;
        }
        static CreateNumericInput(control, value) {
            let input = document.createElement("input");
            input.type = "number";
            input.maxLength = control.max_length;
            input.classList.add("input", Transaction.app_input_size);
            input.placeholder = "0";
            input.required = control.required;
            if (control.data_type === "count") {
                input.step = "1";
                input.min = "0";
                input.pattern = "[0-9]";
            }
            else {
                input.step = "any";
            }
            input.value = value === null ? "" : value;
            input.setAttribute("control_id", control.control_id.toString());
            return input;
        }
        static CreateTextArea(control, value) {
            let textarea = document.createElement("textarea");
            textarea.maxLength = control.max_length;
            textarea.classList.add("textarea", Transaction.app_input_size);
            textarea.placeholder = control.label;
            textarea.required = control.required;
            textarea.rows = 4;
            textarea.value = value === null ? "" : value;
            textarea.setAttribute("control_id", control.control_id.toString());
            return textarea;
        }
        static CreateSelect(control, value) {
            control.valid_values = control.value.split("|");
            let select = document.createElement("select");
            select.required = control.required;
            select.appendChild(Utilities.Create_Option("-1", "Select a " + control.label, false));
            for (let valid_value of control.valid_values) {
                let option = Utilities.Create_Option(valid_value, valid_value, false);
                select.appendChild(option);
            }
            if (value !== null) {
                select.value = value;
            }
            else {
                select.value = "-1";
            }
            return select;
        }
    }
    Transaction.Control = Control;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Control.js.map
var Transaction;
(function (Transaction) {
    class Department {
        constructor() {
            this.organization = "";
            this.payment_types = [];
            this.controls = [];
            this.control_groups = [];
        }
        Constructor() { }
        static GetDepartments() {
            let path = Transaction.GetPath();
            return Utilities.Get(path + "API/Transaction/Departments");
        }
        static CreateDepartmentElement(departments) {
            let select = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.value = "-1";
            defaultOption.appendChild(document.createTextNode("Select a Department"));
            select.appendChild(defaultOption);
            for (let d of departments) {
                if (d.is_active) {
                    let option = document.createElement("option");
                    option.appendChild(document.createTextNode(d.name));
                    option.value = d.department_id.toString();
                    select.appendChild(option);
                }
            }
            select.selectedIndex = -1;
            return select;
        }
        static CreateDepartmentElementLevel(department) {
            let level = document.createElement("div");
            level.classList.add("level");
            let left = document.createElement("div");
            left.classList.add("level-left");
            let outer = document.createElement("div");
            outer.classList.add("level-item", "has-text-centered");
            let inner = document.createElement("div");
            let heading = document.createElement("p");
            heading.classList.add("heading");
            heading.appendChild(document.createTextNode("Select Department"));
            let selectContainer = document.createElement("div");
            selectContainer.classList.add("select");
            selectContainer.appendChild(department);
            inner.appendChild(heading);
            inner.appendChild(selectContainer);
            outer.appendChild(inner);
            left.appendChild(outer);
            level.appendChild(left);
            return level;
        }
        static CreateDepartmentElementField(department) {
            return Transaction.ControlGroup.CreateSelectFieldContainer(department, "Department", true, "is-one-half");
            //let field = document.createElement("div");
            //field.classList.add("field");
            //let label = document.createElement("label");
            //label.classList.add("label", Transaction.app_input_size);
            //label.appendChild(document.createTextNode("Department"));
            //field.appendChild(label);
            //let control = document.createElement("div");
            //control.classList.add("control");
            //let selectContainer = document.createElement("div");
            //selectContainer.classList.add("select", Transaction.app_input_size);
            //selectContainer.appendChild(department);
            //control.appendChild(selectContainer);
            //field.appendChild(control);
            //return field;
        }
        static FindDepartment(department_id) {
            let filtered = Transaction.departments.filter((d) => d.department_id === department_id);
            return (filtered.length === 1) ? filtered[0] : null;
        }
    }
    Transaction.Department = Department;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Department.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class ControlData {
            constructor(control, payment_type_id, clone_node) {
                this.control_data_id = -1;
                this.prior_control_data_id = -1;
                this.transaction_payment_type_id = -1;
                this.department_id = -1;
                this.transaction_id = -1;
                this.control_id = -1;
                this.control = null;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.value = "";
                this.is_active = true;
                this.modified_on = new Date();
                this.modified_by = "";
                this.reason_for_change = "";
                this.error_text = "";
                // client side controls
                this.selected_control = null;
                this.input_element = null;
                this.container_element = null;
                let saved_control_data_id = control.rendered_input_element ? control.rendered_input_element.getAttribute("control_data_id") : null;
                this.selected_control = control;
                this.control_id = control.control_id;
                if (clone_node) {
                    this.input_element = control.rendered_input_element.cloneNode(true);
                }
                else {
                    this.input_element = control.rendered_input_element ? control.rendered_input_element : Transaction.Control.CreateControl(control);
                }
                this.payment_type_id = payment_type_id;
                if (saved_control_data_id === null) {
                    let input = this.input_element;
                    if (input.type === "number") {
                        input.onwheel = (e) => { e.preventDefault(); };
                    }
                    this.input_element.oninput = (event) => {
                        let input = event.target;
                        if (this.Validate()) {
                            switch (control.data_type) {
                                case "date":
                                    let d = input.valueAsDate;
                                    d.setMinutes(d.getTimezoneOffset());
                                    this.value = Utilities.Format_Date(d);
                                    break;
                                case "number":
                                    this.value = input.valueAsNumber.toString();
                                    break;
                                case "count":
                                    this.value = input.valueAsNumber.toString();
                                    input.value = input.valueAsNumber.toString();
                                    break;
                                case "money":
                                    this.value = input.valueAsNumber.toString();
                                    break;
                                default: // "bigtext", "text", "dropdown"
                                    this.value = input.value;
                                    break;
                            }
                        }
                    };
                }
                if (control.data_type === "dropdown") {
                    this.container_element = Transaction.ControlGroup.CreateSelectFieldContainerByControl(control, this.input_element, true);
                }
                else {
                    this.container_element = Transaction.ControlGroup.CreateInputFieldContainerByControl(control, this.input_element, true);
                }
            }
            Validate() {
                switch (this.selected_control.data_type) {
                    case "dropdown":
                        return this.ValidateDropdown();
                    case "count":
                        return this.ValidateCount();
                    case "date":
                        return this.ValidateDate();
                    case "number":
                        return this.ValidateNumber();
                    case "money":
                        return this.ValidateMoney();
                    case "text":
                    case "bigtext":
                        return this.ValidateText();
                    default:
                        return false;
                }
            }
            ValidateDropdown() {
                return Transaction.ControlGroup.ValidateDropdown(this.input_element, this.container_element, this.selected_control.valid_values);
            }
            ValidateDate() {
                return Transaction.ControlGroup.ValidateDate(this.input_element, this.container_element);
            }
            ValidateText() {
                return Transaction.ControlGroup.ValidateText(this.input_element, this.container_element);
            }
            ValidateNumber() {
                return Transaction.ControlGroup.ValidateNumber(this.input_element, this.container_element);
            }
            ValidateCount() {
                return Transaction.ControlGroup.ValidateCount(this.input_element, this.container_element);
            }
            ValidateMoney() {
                return Transaction.ControlGroup.ValidateMoney(this.input_element, this.container_element);
            }
            static GetControlHistory(control_data_id, transaction_id) {
                let path = Transaction.GetPath();
                return Utilities.Get(path + "API/Transaction/GetControlDataHistory?control_data_id=" + control_data_id + "&transaction_id=" + transaction_id);
            }
            SaveControlChanges() {
                let path = Transaction.GetPath();
                console.log('saving this control data', this);
                Utilities.Post(path + "API/Transaction/EditControls", this)
                    .then(response => {
                    if (response.length > 0) {
                        alert("There was a problem saving this change." + '\r\n' + response);
                    }
                    else {
                        Transaction.CloseChangeModal();
                        Transaction.ShowReceiptDetail(this.transaction_id);
                        Transaction.editing_control_data = null;
                    }
                    Utilities.Toggle_Loading_Button("change_transaction_save", false);
                });
            }
            static GetAndDisplayControlHistory(control_data_id, transaction_id) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield ControlData.GetControlHistory(control_data_id, transaction_id)
                        .then((control_data_history) => {
                        ControlData.MarkDataToEdit(control_data_history);
                        ControlData.DisplayControlHistory(control_data_history);
                        ControlData.DisplayControlToEdit();
                    });
                });
            }
            static MarkDataToEdit(control_data) {
                Transaction.editing_control_data = null;
                Transaction.editing_payment_method_data = null;
                let filtered = control_data.filter(x => x.is_active);
                if (filtered.length === 1) {
                    let c = filtered[0];
                    let cd = new Data.ControlData(c.control, c.payment_type_id, false);
                    cd.transaction_payment_type_id = c.transaction_payment_type_id;
                    cd.department_id = c.department_id;
                    cd.is_active = c.is_active;
                    cd.control_data_id = c.control_data_id;
                    cd.transaction_id = c.transaction_id;
                    cd.value = c.value;
                    switch (c.control.data_type) {
                        case "date":
                            if (c.value !== "" && c.value !== null) {
                                let tmp = c.value.split("/");
                                if (tmp.length === 3) {
                                    let v = tmp[2] + '-';
                                    v += tmp[0].length === 1 ? "0" + tmp[0] : tmp[0];
                                    v += "-";
                                    v += tmp[1].length === 1 ? "0" + tmp[1] : tmp[1];
                                    cd.input_element.value = v;
                                }
                            }
                            break;
                        default:
                            cd.input_element.value = c.value;
                    }
                    cd.control = cd.selected_control;
                    Transaction.editing_control_data = cd;
                }
                else {
                    alert("Invalid data stored in database for this transaction.");
                }
            }
            static DisplayControlToEdit() {
                if (Transaction.editing_control_data === null)
                    return;
                let container = document.getElementById(Transaction.change_edit_container);
                Utilities.Clear_Element(container);
                container.classList.add("columns");
                let e = Transaction.editing_control_data;
                container.appendChild(e.container_element);
                Utilities.Set_Value(Transaction.reason_for_change_input, "");
            }
            static CreateControlDataHistoryHeader() {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Value", "has-text-left", "50%"));
                return tr;
            }
            static DisplayControlHistory(control_data) {
                let header = document.getElementById(Transaction.change_transaction_history_table_header);
                Utilities.Clear_Element(header);
                header.appendChild(ControlData.CreateControlDataHistoryHeader());
                let body = document.getElementById(Transaction.change_transaction_history_table_body);
                Utilities.Clear_Element(body);
                for (let cd of control_data) {
                    body.appendChild(ControlData.CreateControlDataHistoryRow(cd));
                }
            }
            static CreateControlDataHistoryRow(control_data) {
                let tr = document.createElement("tr");
                if (new Date(control_data.modified_on).getFullYear() < 1000) {
                    let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
                    original.colSpan = 3;
                    tr.appendChild(original);
                }
                else {
                    tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(control_data.modified_on), "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", control_data.modified_by, "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", control_data.reason_for_change, "has-text-left"));
                }
                tr.appendChild(Utilities.CreateTableCell("td", control_data.value, "has-text-left"));
                return tr;
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map
var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentTypeData {
            constructor(payment_type, target_container, payment_type_index, saved_payment_type_data = null) {
                this.transaction_payment_type_id = -1;
                this.transaction_id = -1;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.payment_type = null;
                this.control_data = [];
                this.added_after_save = false;
                this.error_text = "";
                this.payment_method_data = [];
                //clientside controls
                this.payment_type_parent_container = null;
                this.payment_type_container = null;
                this.selected_payment_type = null; // this is used by the new receipt process.  payment_type is used when you view an existing transaction.
                this.cancel_payment_type_button = null;
                this.add_another_payment_type_button = null;
                this.save_button = null;
                this.control_groups = [];
                this.total_cash_element = null;
                this.total_checks_element = null;
                this.total_number_checks_element = null;
                this.next_payment_method_id = 0;
                this.selected_payment_type = payment_type;
                this.payment_type_parent_container = target_container;
                this.payment_type_id = payment_type.payment_type_id;
                this.payment_type_index = saved_payment_type_data !== null ? saved_payment_type_data.payment_type_index : payment_type_index;
                let li = document.createElement("li");
                li.style.display = "block";
                this.payment_type_container = li;
                if (saved_payment_type_data !== null) {
                    this.transaction_payment_type_id = saved_payment_type_data.transaction_payment_type_id;
                    this.transaction_id = saved_payment_type_data.transaction_id;
                    this.RenderSavedPaymentTypeControls(li, saved_payment_type_data);
                    this.RenderSavedPaymentMethods(li, saved_payment_type_data);
                }
                else {
                    this.RenderPaymentTypeControls(li);
                    this.RenderPaymentMethods(li);
                }
                this.RenderPaymentTypeFooter(li);
                if (saved_payment_type_data !== null)
                    this.SavedPaymentMethodDataCalculateTotals(saved_payment_type_data.payment_method_data);
                this.payment_type_parent_container.appendChild(li);
            }
            Validate() {
                let is_valid = true;
                for (let ct of this.control_data) {
                    let v = ct.Validate();
                    if (!v && is_valid)
                        is_valid = false;
                }
                for (let pmt of this.payment_method_data) {
                    let v = pmt.Validate();
                    if (!v && is_valid)
                        is_valid = false;
                }
                return is_valid;
            }
            RenderPaymentTypeControls(target_container) {
                for (let group of this.selected_payment_type.control_groups) {
                    this.control_data.push(...group.CreateControlData(target_container));
                }
            }
            CreateHeaderButton(label, ...classes) {
                let button = document.createElement("button");
                button.appendChild(document.createTextNode(label));
                button.classList.add("button", ...classes);
                return button;
            }
            RenderPaymentTypeFooter(target_container) {
                let items = [];
                this.total_cash_element = document.createElement("span");
                this.total_cash_element.classList.add("title");
                this.total_cash_element.appendChild(document.createTextNode("$0.00"));
                this.total_checks_element = document.createElement("span");
                this.total_checks_element.classList.add("title");
                this.total_checks_element.appendChild(document.createTextNode("$0.00"));
                this.total_number_checks_element = document.createElement("span");
                this.total_number_checks_element.classList.add("title");
                this.total_number_checks_element.appendChild(document.createTextNode("0"));
                items.push(new Utilities.LevelItem("Total Cash", "", this.total_cash_element, "has-text-centered"));
                items.push(new Utilities.LevelItem("Total Checks", "", this.total_checks_element, "has-text-centered"));
                items.push(new Utilities.LevelItem("# Checks", "", this.total_number_checks_element, "has-text-centered"));
                this.add_another_payment_type_button = this.CreateHeaderButton("Add", "is-info");
                this.cancel_payment_type_button = this.CreateHeaderButton("Cancel", "is-warning");
                this.save_button = this.CreateHeaderButton("Preview & Save", "is-success");
                let buttons = document.createElement("div");
                buttons.classList.add("buttons");
                buttons.appendChild(this.add_another_payment_type_button);
                buttons.appendChild(this.cancel_payment_type_button);
                buttons.appendChild(this.save_button);
                let right = [];
                right.push(new Utilities.LevelItem("", "", buttons, "has-text-centered"));
                let heading = Utilities.Create_Centered_Level(items, [], right);
                heading.classList.add("has-background-grey-lighter");
                target_container.appendChild(heading);
            }
            RenderPaymentMethods(target_container) {
                let fieldset = document.createElement("fieldset");
                let legend = document.createElement("legend");
                legend.classList.add("label");
                legend.appendChild(document.createTextNode("Payment Methods"));
                fieldset.appendChild(legend);
                this.AddCashPaymentMethod(fieldset);
                this.AddCheckPaymentMethod(fieldset);
                target_container.appendChild(fieldset);
            }
            AddCheckPaymentMethod(target_container, show_cancel = false, show_save = false) {
                let check = new Data.PaymentMethodData(false, show_cancel, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
                target_container.appendChild(check.control_to_render);
                this.payment_method_data.push(check);
                if (show_save) {
                    Utilities.Set_Text(check.add_check_button_element, "Save this Check");
                    check.add_check_button_element.classList.remove("is-info");
                    check.add_check_button_element.classList.add("is-success");
                    check.add_check_button_element.onclick = (event) => {
                        this.SavePaymentMethodData(check, check.add_check_button_element);
                    };
                }
                else {
                    check.add_check_button_element.onclick = (event) => {
                        this.AddCheckPaymentMethod(target_container, true, show_save);
                    };
                }
                if (show_cancel) {
                    check.cancel_check_button_element.onclick = (event) => {
                        target_container.removeChild(check.control_to_render);
                        let indextoremove = this.payment_method_data.findIndex(function (j) { return j.payment_method_data_id === check.payment_method_data_id; });
                        if (indextoremove > -1)
                            this.payment_method_data.splice(indextoremove, 1);
                        check = null;
                        this.PaymentMethodDataChanged();
                    };
                }
            }
            AddCashPaymentMethod(target_container) {
                let cash = new Data.PaymentMethodData(true, false, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
                target_container.appendChild(cash.control_to_render);
                this.payment_method_data.push(cash);
            }
            PaymentMethodDataChanged() {
                let cash = 0;
                let checks = 0;
                let number_checks = 0;
                for (let pmt of this.payment_method_data) {
                    cash += pmt.cash_amount;
                    checks += pmt.check_amount;
                    number_checks += pmt.check_count;
                }
                this.total_cash_element.innerHTML = Utilities.Format_Amount(cash);
                this.total_checks_element.innerHTML = Utilities.Format_Amount(checks);
                this.total_number_checks_element.innerHTML = number_checks.toString();
            }
            SavedPaymentMethodDataCalculateTotals(payment_method_data) {
                let cash = 0;
                let checks = 0;
                let number_checks = 0;
                for (let pmt of payment_method_data) {
                    cash += pmt.cash_amount;
                    checks += pmt.check_amount;
                    number_checks += pmt.check_count;
                }
                this.total_cash_element.innerHTML = Utilities.Format_Amount(cash);
                this.total_checks_element.innerHTML = Utilities.Format_Amount(checks);
                this.total_number_checks_element.innerHTML = number_checks.toString();
            }
            /*
             * Render functions that are for Saved Transactions
             *
             */
            RenderSavedPaymentTypeControls(target_container, saved_payment_type_data) {
                this.control_groups = Transaction.ControlGroup.CreateSavedControlGroups(saved_payment_type_data.control_data);
                for (let group of this.control_groups) {
                    this.control_data.push(...group.CreateControlData(target_container, false));
                }
            }
            RenderSavedPaymentMethods(target_container, saved_payment_type_data) {
                let fieldset = document.createElement("fieldset");
                let legend = document.createElement("legend");
                legend.classList.add("label");
                legend.appendChild(document.createTextNode("Payment Methods"));
                fieldset.appendChild(legend);
                let cash_payment_method_data = null;
                let check_payment_method_data = [];
                let payment_method_data_copy = [...saved_payment_type_data.payment_method_data];
                // we have to sort this because we expect the first 0 amount to be cash.
                // so we sort this as cash amount descending.
                payment_method_data_copy.sort((a, b) => b.cash_amount - a.cash_amount);
                do {
                    let pmd = payment_method_data_copy.shift();
                    if (pmd.check_amount > 0 ||
                        pmd.check_number.length > 0 ||
                        pmd.check_count > 0 ||
                        pmd.check_from.length > 0 ||
                        pmd.paying_for.length > 0) {
                        check_payment_method_data.push(pmd);
                    }
                    else {
                        if (pmd.cash_amount > 0 || cash_payment_method_data === null) {
                            cash_payment_method_data = pmd;
                        }
                        else {
                            check_payment_method_data.push(pmd);
                        }
                    }
                } while (payment_method_data_copy.length > 0);
                this.AddSavedCashPaymentMethod(fieldset, cash_payment_method_data);
                for (let cpmd of check_payment_method_data) {
                    this.AddSavedCheckPaymentMethod(fieldset, cpmd);
                }
                target_container.appendChild(fieldset);
            }
            AddSavedCheckPaymentMethod(target_container, payment_method_data) {
                let check = new Data.PaymentMethodData(false, false, this.next_payment_method_id++, null, payment_method_data);
                target_container.appendChild(check.control_to_render);
                this.payment_method_data.push(check);
                check.add_check_button_element.onclick = (event) => {
                    this.AddCheckPaymentMethod(target_container, true, true);
                };
            }
            AddSavedCashPaymentMethod(target_container, payment_method_data) {
                let cash = new Data.PaymentMethodData(true, false, this.next_payment_method_id++, null, payment_method_data);
                target_container.appendChild(cash.control_to_render);
                this.payment_method_data.push(cash);
            }
            SavePaymentMethodData(check, button) {
                Utilities.Toggle_Loading_Button(button, true);
                if (!check.Validate()) {
                    return;
                }
                check.transaction_id = this.transaction_id;
                check.payment_method_data_id = -1;
                check.transaction_payment_type_id = this.transaction_payment_type_id;
                let path = Transaction.GetPath();
                Utilities.Post_Empty(path + "API/Transaction/AddPaymentMethod", check)
                    .then((response) => {
                    response.text().then((text) => {
                        console.log('response text', text, text.length);
                        Utilities.Toggle_Loading_Button(button, false);
                        if (text.length > 0) {
                            alert("there was an error attempting to add this check, please refresh this web page and try again.");
                            return;
                        }
                        else {
                            Transaction.ShowReceiptDetail(this.transaction_id);
                        }
                    });
                });
            }
        }
        Data.PaymentTypeData = PaymentTypeData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentTypeData.js.map
var Transaction;
(function (Transaction) {
    class Receipt {
        //receipt_view_contents
        constructor(saved_transaction = null) {
            this.currentTransaction = null;
            this.savedTransaction = null;
            this.view_container = null;
            this.receipt_number_element = null;
            this.county_manager_element = null;
            this.created_by_element = null;
            this.created_on_element = null;
            this.receipt_view_contents_element = null;
            this.receipt_view_totals_element = null;
            this.receipt_preview_controls_element = null;
            this.receipt_preview_cancel_button_element = null;
            this.receipt_preview_save_button_element = null;
            this.view_container = document.getElementById(Receipt.receipt_container);
            this.receipt_number_element = document.getElementById("receipt_view_number");
            this.created_by_element = document.getElementById("receipt_created_by");
            this.county_manager_element = document.getElementById("receipt_view_county_manager");
            this.created_on_element = document.getElementById("receipt_view_date");
            this.receipt_view_contents_element = document.getElementById("receipt_view_contents");
            this.receipt_view_totals_element = document.getElementById("receipt_view_totals");
            this.currentTransaction = new Transaction.Data.TransactionData("R", saved_transaction);
            this.receipt_preview_controls_element = document.getElementById("receipt_preview_controls");
            this.receipt_preview_cancel_button_element = document.getElementById("receipt_view_cancel");
            this.receipt_preview_save_button_element = document.getElementById("receipt_view_save");
            this.receipt_preview_cancel_button_element.onclick = (event) => {
                Transaction.ViewReceiptDetail();
            };
            this.receipt_preview_save_button_element.onclick = (event) => {
                this.currentTransaction.SaveTransactionData();
            };
        }
        ShowReceiptPreview() {
            let t = this.currentTransaction;
            this.UpdateReceipt(t);
            Utilities.Show(this.receipt_preview_controls_element);
        }
        ShowReceipt(t) {
            this.UpdateReceipt(t);
            Utilities.Hide(this.receipt_preview_controls_element);
        }
        UpdateReceipt(t) {
            Transaction.ViewPrintableReceipt();
            Utilities.Set_Text(this.created_on_element, Utilities.Format_Date(t.created_on));
            Utilities.Set_Text(this.receipt_number_element, t.transaction_number);
            Utilities.Set_Text(this.created_by_element, t.created_by_display_name);
            Utilities.Set_Text(this.county_manager_element, t.county_manager_name);
            this.DisplayDepartmentControls(t);
            if (t.transaction_type == "R") {
                this.CreatePaymentTypeDisplay(t);
            }
            else {
                this.CreateTransactionViewDisplay(t);
                if (t.transaction_type === "C") {
                }
            }
        }
        CreateTransactionViewDisplay(t) {
            Utilities.Clear_Element(this.receipt_view_contents_element);
            Utilities.Clear_Element(this.receipt_view_totals_element);
            for (let td of t.deposit_receipts) {
                this.receipt_view_contents_element.appendChild(this.CreateReceiptDetailRow(td.transaction_type + " " + td.transaction_number, td.total_cash_amount, td.total_check_amount, td.total_check_count));
            }
            this.receipt_view_totals_element.appendChild(this.CreateReceiptDetailRow("Grand Total", t.total_cash_amount, t.total_check_amount, t.total_check_count));
        }
        CreatePaymentTypeDisplay(t) {
            Utilities.Clear_Element(this.receipt_view_contents_element);
            Utilities.Clear_Element(this.receipt_view_totals_element);
            let check_total = 0;
            let cash_total = 0;
            let check_count = 0;
            for (let ptd of t.payment_type_data) {
                let payment_method_header_row_shown = false;
                let current_check_total = 0;
                let current_cash_total = 0;
                let current_check_count = 0;
                let controls = ptd.control_data;
                let address_controls = this.get_address_controls(controls, true);
                if (address_controls.length > 0) {
                    controls = this.get_address_controls(controls, false);
                }
                let date_range_controls = this.get_date_range_controls(controls, true);
                if (date_range_controls.length > 0) {
                    controls = this.get_date_range_controls(controls, false);
                }
                for (let cd of controls) {
                    let control = cd.control ? cd.control : cd.selected_control;
                    if (control.data_type === "bigtext") {
                        let div = document.createElement("div");
                        let text = cd.value.split("\n");
                        for (let t of text) {
                            let p = document.createElement("p");
                            p.appendChild(document.createTextNode(t));
                            div.appendChild(p);
                        }
                        this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(control.label, div));
                    }
                    else {
                        this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(control.label, cd.value));
                    }
                }
                if (address_controls.length > 0) {
                    let address = this.get_address(address_controls);
                    this.receipt_view_contents_element.appendChild(this.CreateControlDataRow("Address", address));
                }
                if (date_range_controls.length > 0) {
                    let date_range = this.get_date_range(date_range_controls);
                    this.receipt_view_contents_element.appendChild(this.CreateControlDataRow("Date Range", date_range));
                }
                for (let pmd of ptd.payment_method_data) {
                    if (pmd.cash_amount > 0) {
                        if (!payment_method_header_row_shown) {
                            this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeHeaderRow());
                            payment_method_header_row_shown = true;
                        }
                        this.receipt_view_contents_element.appendChild(this.CreateCashDataRow(pmd));
                    }
                    else {
                        if (pmd.check_amount > 0 || pmd.check_number.length > 0 || pmd.check_from.length > 0) {
                            if (!payment_method_header_row_shown) {
                                this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeHeaderRow());
                                payment_method_header_row_shown = true;
                            }
                            this.receipt_view_contents_element.appendChild(this.CreateCheckDataRow(pmd));
                        }
                    }
                    current_cash_total += pmd.cash_amount;
                    current_check_total += pmd.check_amount;
                    current_check_count += pmd.check_count;
                }
                let payment_type_name = ptd.selected_payment_type !== undefined ? ptd.selected_payment_type.name : ptd.payment_type.name;
                this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeRow(payment_type_name + " Total", current_cash_total, current_check_total, current_check_count));
                check_total += current_check_total;
                cash_total += current_cash_total;
                check_count += current_check_count;
            }
            this.receipt_view_totals_element.appendChild(this.CreatePaymentTypeRow("Grand Total", cash_total, check_total, check_count));
        }
        CreatePaymentTypeRow(payment_type, cash_amount, check_amount, check_count) {
            return this.CreateReceiptDetailRow(payment_type, cash_amount, check_amount, check_count);
        }
        CreateControlDataRow(label, value) {
            let tr = document.createElement("tr");
            tr.appendChild(Utilities.CreateTableCell("td", label, "has-text-right"));
            if (typeof value == "string") {
                tr.appendChild(Utilities.CreateTableCell("td", value, "has-text-left", "", 2));
            }
            else {
                let cell = Utilities.CreateTableCell("td", value, "has-text-left", "", 2);
                cell.appendChild(value);
                tr.appendChild(cell);
            }
            tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 4));
            return tr;
        }
        CreatePaymentTypeHeaderRow() {
            let tr = document.createElement("tr");
            tr.appendChild(Utilities.CreateTableCell("th", "Check Number", "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered"));
            tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 4));
            return tr;
        }
        CreateCheckDataRow(pmd) {
            let tr = document.createElement("tr");
            tr.appendChild(Utilities.CreateTableCell("td", pmd.check_number, "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", pmd.check_from, "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", "Check", "has-text-centered"));
            tr.appendChild(Utilities.CreateTableCell("td", pmd.check_count.toString(), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.check_amount), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", "", ""));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.check_amount), "has-text-right"));
            return tr;
        }
        CreateCashDataRow(pmd) {
            let tr = document.createElement("tr");
            tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 2));
            //tr.appendChild(Utilities.CreateTableCell("td", pmd.check_from, "has-text-left"));
            tr.appendChild(Utilities.CreateTableCell("td", "Cash", "has-text-centered"));
            tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 2));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.cash_amount), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.cash_amount), "has-text-right"));
            return tr;
        }
        CreateReceiptDetailRow(label, cash_amount, check_amount, check_count) {
            let tr = document.createElement("tr");
            tr.appendChild(Utilities.CreateTableCell("th", label, "has-text-left", "", 3));
            tr.appendChild(Utilities.CreateTableCell("th", check_count.toString(), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(check_amount), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(cash_amount), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(cash_amount + check_amount), "has-text-right"));
            tr.classList.add("payment_type_end");
            return tr;
        }
        DisplayDepartmentControls(t) {
            let container = document.getElementById("receipt_department_controls");
            Utilities.Clear_Element(container);
            let df = document.createDocumentFragment();
            df.appendChild(this.CreatePrintableControl("is-half", "Received From", t.received_from));
            df.appendChild(this.CreatePrintableControl("is-half", "Department", t.department_name));
            for (let cd of t.department_control_data) {
                df.appendChild(this.CreateDepartmentControl(cd));
            }
            container.appendChild(df);
        }
        CreateDepartmentControl(control_data) {
            let size = "";
            console.log("create departmental control", control_data);
            let c = control_data.control !== null ? control_data.control : control_data.selected_control;
            if (c.render_hints.length > 0)
                size = c.render_hints;
            return this.CreatePrintableControl(size, c.label, control_data.value);
        }
        CreatePrintableControl(size, label, value) {
            let e = document.createElement("div");
            e.classList.add("field", "column", size);
            let l = document.createElement("label");
            l.classList.add("label", Transaction.app_input_size);
            l.appendChild(document.createTextNode(label));
            e.appendChild(l);
            let control = document.createElement("p");
            control.classList.add("control");
            e.appendChild(control);
            let input = document.createElement("input");
            input.classList.add("input", "is-static", Transaction.app_input_size);
            input.value = value;
            input.readOnly = true;
            control.appendChild(input);
            return e;
        }
        get_address_controls(cd, match) {
            let address_control_ids = [5, 6, 7, 8, 9];
            return this.get_control_groups(address_control_ids, cd, match);
        }
        get_address(cd) {
            let e = document.createElement("div");
            let line1 = "";
            let line2 = "";
            let city = "";
            let state = "";
            let zip = "";
            let line3 = "";
            for (let c of cd) {
                switch (c.control_id) {
                    case 5: // address line 1
                        line1 = c.value.trim();
                        break;
                    case 6:
                        line2 = c.value.trim();
                        break;
                    case 7: // City
                        city = c.value.trim();
                        break;
                    case 8: // State
                        state = c.value.trim();
                        break;
                    case 9: //Zip
                        zip = c.value.trim();
                }
            }
            if (line1.length > 0) {
                let line1_p = document.createElement("p");
                line1_p.appendChild(document.createTextNode(line1));
                e.appendChild(line1_p);
            }
            if (line2.length > 0) {
                let line2_p = document.createElement("p");
                line2_p.appendChild(document.createTextNode(line2));
                e.appendChild(line2_p);
            }
            if (city.length > 0 || state.length > 0 || zip.length > 0) {
                if (city.length > 0)
                    line3 = city + ", ";
                if (state.length > 0)
                    line3 += state + " ";
                line3 += zip;
                let line3_p = document.createElement("p");
                line3_p.appendChild(document.createTextNode(line3));
                e.appendChild(line3_p);
            }
            return e;
        }
        get_date_range(cd) {
            let start = "";
            let end = "";
            let e = document.createElement("e");
            for (let c of cd) {
                switch (c.control_id) {
                    case 10:
                    case 71:
                        start = c.value;
                        break;
                    case 11:
                    case 72:
                        end = c.value;
                        break;
                }
            }
            e.appendChild(document.createTextNode(start + " through " + end));
            return e;
        }
        get_date_range_controls(cd, match) {
            let date_range_control_ids = [10, 11, 71, 72];
            return this.get_control_groups(date_range_control_ids, cd, match);
        }
        get_control_groups(control_ids, cd, match) {
            if (match) {
                return cd.filter(j => control_ids.includes(j.control_id));
            }
            else {
                return cd.filter(j => !control_ids.includes(j.control_id));
            }
        }
    }
    //clientside controls
    Receipt.receipt_container = "receipt_view";
    Transaction.Receipt = Receipt;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Receipt.js.map
var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class TransactionData {
            constructor(transaction_type, saved_transaction) {
                this.transaction_id = -1;
                this.fiscal_year = -1;
                this.created_by_employee_id = -1;
                this.employee_transaction_count = -1;
                this.transaction_number = "PREVIEW";
                this.transaction_type = "";
                this.child_transaction_id = -1;
                this.department_id = -1;
                this.department_name = "";
                this.department_control_data = [];
                this.payment_type_data = [];
                this.county_manager_name = "PREVIEW";
                this.comment = "";
                this.error_text = "";
                this.received_from = "";
                this.total_cash_amount = -1;
                this.total_check_amount = -1;
                this.total_check_count = -1;
                this.created_on = new Date();
                this.created_by_username = "";
                this.created_by_ip_address = "";
                this.created_by_display_name = "PREVIEW";
                this.deposit_receipts = [];
                this.can_modify = false;
                this.can_accept_deposit = false;
                this.child_transaction = null;
                //public base_container: string = 'root';
                this.department_element = null;
                this.department_element_container = null;
                this.received_from_element = null;
                this.received_from_element_container = null;
                this.department_controls_target = 'department_controls_container';
                this.payment_type_target = 'payment_type_container';
                this.transaction_error_element = null;
                this.selected_department = null;
                this.next_payment_type_index = 0;
                this.transaction_type = transaction_type;
                if (saved_transaction !== null) {
                    this.transaction_id = saved_transaction.transaction_id;
                    this.transaction_number = saved_transaction.transaction_number;
                    this.transaction_type = saved_transaction.transaction_type;
                }
                let targetContainer = document.getElementById(TransactionData.action_container);
                Utilities.Clear_Element(targetContainer);
                this.CreateReceiptTitle(targetContainer, saved_transaction);
                switch (this.transaction_type) {
                    case "R":
                        console.log("receipt view");
                        this.RenderReceiptView(targetContainer, saved_transaction);
                        break;
                    case "D":
                    case "C":
                        console.log("deposit view");
                        this.RenderDepositView(targetContainer, saved_transaction);
                        break;
                    default:
                        break;
                }
                this.transaction_error_element = this.CreateTransactionErrorElement();
                targetContainer.appendChild(this.transaction_error_element);
            }
            RenderDepositView(container, saved_transaction) {
                let transactions_container = document.createElement("div");
                container.appendChild(transactions_container);
                let footer = TransactionData.CreateTransactionsTableFooter(saved_transaction);
                TransactionData.RenderTransactionList(saved_transaction.deposit_receipts, transactions_container, footer);
                if (saved_transaction.can_accept_deposit) {
                    // we'll show a menu that will allow the deposit viewer to indicate
                    // how many checks / how much cash/checks they've collected
                    // and provide a spot for comments.
                    // last will be a Create Receipt button.
                    console.log('can accept deposit');
                    container.appendChild(TransactionData.CreateAcceptDepositMenu(saved_transaction));
                }
            }
            RenderReceiptView(container, saved_transaction) {
                let control_container = document.createElement("div");
                control_container.id = "transaction_controls";
                control_container.classList.add("columns");
                container.appendChild(control_container);
                this.department_element = Transaction.DepartmentControl.cloneNode(true);
                this.RenderDepartmentSelection(control_container, saved_transaction);
                this.RenderReceivedFromInput(control_container, saved_transaction);
            }
            CreateTransactionErrorElement() {
                let e = document.createElement("div");
                return e;
            }
            CreateReceiptTitle(target, saved_transaction) {
                let title = document.createElement("h2");
                title.classList.add("title", "has-text-centered");
                let text = "";
                if (saved_transaction === null) {
                    text = "Create a New Receipt";
                    title.appendChild(document.createTextNode(text));
                }
                else {
                    switch (saved_transaction.transaction_type) {
                        case "R":
                            text = "Viewing Receipt: " + saved_transaction.transaction_number;
                            break;
                        case "D":
                            text = "Viewing Deposit: " + saved_transaction.transaction_number;
                            break;
                        case "C":
                            text = "Viewing Deposit Receipt: " + saved_transaction.transaction_number;
                            break;
                    }
                    title.appendChild(document.createTextNode(text));
                    if (saved_transaction.child_transaction !== null) {
                        let c = saved_transaction.child_transaction;
                        let link = document.createElement("a");
                        link.appendChild(document.createTextNode(c.transaction_number));
                        link.onclick = () => {
                            Transaction.ShowReceiptDetail(c.transaction_id);
                        };
                        switch (c.transaction_type) {
                            case "D":
                                text = ", Deposited: ";
                                break;
                            case "C":
                                text = ", Deposit Accepted: ";
                                break;
                        }
                        title.appendChild(document.createTextNode(text));
                        title.appendChild(link);
                    }
                }
                target.appendChild(title);
            }
            RenderDepartmentSelection(target, saved_transaction) {
                if (saved_transaction === null) {
                    this.department_element.onchange = (event) => {
                        this.department_id = parseInt(event.target.value);
                        this.selected_department = Transaction.Department.FindDepartment(this.department_id);
                        this.RenderDepartmentControls();
                        this.RenderPaymentTypes();
                    };
                }
                else {
                    this.department_id = saved_transaction.department_id;
                    this.selected_department = Transaction.Department.FindDepartment(this.department_id);
                    this.RenderSavedDepartmentControls(saved_transaction);
                    this.RenderSavedPaymentTypes(saved_transaction);
                    this.department_element.value = saved_transaction.department_id.toString();
                    this.department_element.disabled = true;
                }
                this.department_element_container = Transaction.Department.CreateDepartmentElementField(this.department_element);
                target.appendChild(this.department_element_container);
            }
            RenderDepartmentControls() {
                this.department_control_data = [];
                let departmentControlContainer = document.getElementById(this.department_controls_target);
                if (departmentControlContainer === null) {
                    departmentControlContainer = document.createElement("div");
                    departmentControlContainer.id = this.department_controls_target;
                    document.getElementById(TransactionData.action_container).appendChild(departmentControlContainer);
                }
                Utilities.Clear_Element(departmentControlContainer);
                if (this.department_id === -1 ||
                    this.selected_department === null ||
                    this.selected_department.controls.length === 0)
                    return;
                for (let group of this.selected_department.control_groups) {
                    this.department_control_data.push(...group.CreateControlData(departmentControlContainer));
                }
            }
            RenderPaymentTypes() {
                this.payment_type_data = [];
                let paymentTypeContainer = document.getElementById(this.payment_type_target);
                // if we can't find it, create it.
                if (paymentTypeContainer === null) {
                    paymentTypeContainer = document.createElement("div");
                    paymentTypeContainer.id = this.payment_type_target;
                    document.getElementById(TransactionData.action_container).appendChild(paymentTypeContainer);
                }
                Utilities.Clear_Element(paymentTypeContainer);
                if (this.department_id === -1 || this.selected_department === null)
                    return;
                let ol = document.createElement("ol");
                ol.classList.add("payment_type");
                for (let pt of this.selected_department.payment_types) {
                    let li = document.createElement("li");
                    li.classList.add("light-function", "is-size-4", "has-background-link");
                    li.style.cursor = "pointer";
                    li.setAttribute("payment_type_id", pt.payment_type_id.toString());
                    let name = document.createElement("span");
                    name.classList.add("name");
                    name.appendChild(document.createTextNode(pt.name));
                    li.appendChild(name);
                    let totals = document.createElement("span");
                    totals.classList.add("totals");
                    li.appendChild(totals);
                    ol.appendChild(li);
                    let controls_container = document.createElement("ol");
                    controls_container.classList.add("control_container", "hide");
                    ol.appendChild(controls_container);
                    li.onclick = (event) => {
                        if (controls_container.childElementCount === 0) // there is no payment type data created yet.
                         {
                            this.AddPaymentType(pt, controls_container);
                            controls_container.classList.remove("hide");
                        }
                        console.log('this transaction', this);
                    };
                }
                paymentTypeContainer.appendChild(ol);
            }
            AddPaymentType(payment_type, container, transaction_already_saved = false) {
                let default_payment_type_index = this.next_payment_type_index++;
                if (transaction_already_saved) {
                    let max_index = 0;
                    for (let pt of this.payment_type_data) {
                        if (pt.payment_type_index > max_index)
                            max_index = pt.payment_type_index;
                    }
                    default_payment_type_index = max_index + 1;
                }
                let ptd = new Data.PaymentTypeData(payment_type, container, default_payment_type_index);
                this.payment_type_data.push(ptd);
                ptd.add_another_payment_type_button.onclick = (event) => {
                    this.AddPaymentType(payment_type, container, transaction_already_saved);
                };
                ptd.cancel_payment_type_button.onclick = (event) => {
                    container.removeChild(ptd.payment_type_container);
                    let indextoremove = this.payment_type_data.findIndex((j) => { return j.payment_type_index === ptd.payment_type_index; });
                    if (indextoremove > -1)
                        this.payment_type_data.splice(indextoremove, 1);
                    ptd = null;
                    if (container.childElementCount === 0)
                        container.classList.add("hide");
                };
                if (transaction_already_saved) {
                    Utilities.Set_Text(ptd.save_button, "Save New Payment Types");
                }
                ptd.save_button.onclick = (event) => {
                    let button = event.target;
                    Utilities.Toggle_Loading_Button(button, true);
                    if (transaction_already_saved) {
                        this.SaveNewPaymentTypes();
                        Utilities.Toggle_Loading_Button(button, false);
                    }
                    else {
                        if (this.ValidateTransaction()) {
                            Transaction.currentReceipt.ShowReceiptPreview();
                            Utilities.Toggle_Loading_Button(button, false);
                        }
                        else {
                            Utilities.Toggle_Loading_Button(button, false);
                        }
                    }
                };
            }
            /*
             * Saved Transaction Rendering functions
             *
             */
            RenderSavedDepartmentControls(saved_transaction) {
                this.department_control_data = [];
                let departmentControlContainer = document.getElementById(this.department_controls_target);
                if (departmentControlContainer === null) {
                    departmentControlContainer = document.createElement("div");
                    departmentControlContainer.id = this.department_controls_target;
                    document.getElementById(TransactionData.action_container).appendChild(departmentControlContainer);
                }
                Utilities.Clear_Element(departmentControlContainer);
                if (this.department_id === -1 ||
                    this.selected_department === null ||
                    this.selected_department.controls.length === 0)
                    return;
                let control_groups = Transaction.ControlGroup.CreateSavedControlGroups(saved_transaction.department_control_data);
                for (let group of control_groups) {
                    this.department_control_data.push(...group.CreateControlData(departmentControlContainer, false));
                }
            }
            RenderSavedPaymentTypes(saved_transaction) {
                // The primary difference between the RenderSavedPaymentTypes and RenderPaymentTypes functions
                // is that the RenderPaymentTypes function renders the payment type based on what information
                // the system is currently set up to expect for that paymenttype.
                // The RenderSavedPaymentTypes function renders the payment type based on the information
                // that was saved.  This information may not be vaild for the payment types going forward.
                this.payment_type_data = [];
                let paymentTypeContainer = document.getElementById(this.payment_type_target);
                // if we can't find it, create it.
                if (paymentTypeContainer === null) {
                    paymentTypeContainer = document.createElement("div");
                    paymentTypeContainer.id = this.payment_type_target;
                    document.getElementById(TransactionData.action_container).appendChild(paymentTypeContainer);
                }
                Utilities.Clear_Element(paymentTypeContainer);
                if (this.department_id === -1 || this.selected_department === null)
                    return;
                let ol = document.createElement("ol");
                ol.classList.add("payment_type");
                let ids = saved_transaction.payment_type_data.map(ptd => ptd.payment_type_id);
                let distinct_payment_type_ids = [...new Set(ids)];
                for (let payment_type_id of distinct_payment_type_ids) {
                    let filtered = saved_transaction.payment_type_data.filter(x => x.payment_type_id === payment_type_id);
                    let pt = Transaction.FindPaymentType(filtered[0].payment_type_id); //filtered[0].payment_type;
                    //let pt = Transaction.FindPaymentType(payment_type_id);
                    let li = document.createElement("li");
                    li.classList.add("light-function", "is-size-4", "has-background-link");
                    li.style.cursor = "pointer";
                    li.setAttribute("payment_type_id", pt.payment_type_id.toString());
                    let name = document.createElement("span");
                    name.classList.add("name");
                    name.appendChild(document.createTextNode(pt.name));
                    li.appendChild(name);
                    let totals = document.createElement("span"); // will need to calculate totals now
                    totals.classList.add("totals");
                    li.appendChild(totals);
                    ol.appendChild(li);
                    let controls_container = document.createElement("ol");
                    controls_container.classList.add("control_container");
                    ol.appendChild(controls_container);
                    for (let ptd of filtered) {
                        this.AddSavedPaymentType(pt, ptd, controls_container);
                    }
                }
                for (let pt of this.selected_department.payment_types) {
                    if (distinct_payment_type_ids.indexOf(pt.payment_type_id) === -1) {
                        let li = document.createElement("li");
                        li.classList.add("light-function", "is-size-4", "has-background-link");
                        li.style.cursor = "pointer";
                        li.setAttribute("payment_type_id", pt.payment_type_id.toString());
                        let name = document.createElement("span");
                        name.classList.add("name");
                        name.appendChild(document.createTextNode(pt.name));
                        li.appendChild(name);
                        let totals = document.createElement("span");
                        totals.classList.add("totals");
                        li.appendChild(totals);
                        ol.appendChild(li);
                        let controls_container = document.createElement("ol");
                        controls_container.classList.add("control_container", "hide");
                        ol.appendChild(controls_container);
                        li.onclick = (event) => {
                            if (controls_container.childElementCount === 0) // there is no payment type data created yet.
                             {
                                this.AddPaymentType(pt, controls_container, true);
                                controls_container.classList.remove("hide");
                            }
                            console.log('this transaction', this);
                        };
                    }
                }
                paymentTypeContainer.appendChild(ol);
            }
            AddSavedPaymentType(payment_type, payment_type_data, container) {
                let ptd = new Data.PaymentTypeData(payment_type, container, this.next_payment_type_index++, payment_type_data);
                this.payment_type_data.push(ptd);
                //ptd.add_another_payment_type_button.style.display = "none";
                ptd.add_another_payment_type_button.onclick = (event) => {
                    this.AddPaymentType(payment_type, container, true);
                };
                ptd.cancel_payment_type_button.style.display = "none";
                ptd.save_button.style.display = "none";
            }
            RenderReceivedFromInput(target_container, saved_transaction) {
                let input_value = saved_transaction === null ? "" : saved_transaction.received_from;
                this.received_from = input_value;
                this.received_from_element = Transaction.ControlGroup.CreateInput("text", 500, true, "Received From", input_value);
                if (saved_transaction === null) {
                    this.received_from_element.oninput = (event) => {
                        let e = event.target;
                        this.received_from = e.value.trim();
                        this.IsValid();
                    };
                }
                else {
                    this.received_from_element.readOnly = true;
                }
                this.received_from_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.received_from_element, "Received From or N/A", true, "is-one-half");
                target_container.appendChild(this.received_from_element_container);
            }
            ValidateNewPaymentTypes(payment_types) {
                let is_valid = true;
                for (let pt of payment_types) {
                    if (!pt.Validate())
                        is_valid = false;
                }
                return is_valid;
            }
            ValidateTransaction() {
                let is_valid = true;
                is_valid = this.IsValid();
                for (let ct of this.department_control_data) {
                    let v = ct.Validate();
                    if (!v && is_valid)
                        is_valid = false;
                }
                for (let pt of this.payment_type_data) {
                    let v = pt.Validate();
                    if (!v && is_valid)
                        is_valid = false;
                }
                if (is_valid) {
                    if (!this.ValidateCheckCount()) {
                        Utilities.Error_Show(this.transaction_error_element, "You have entered a check amount but have entered that you have collected no checks.");
                        this.transaction_error_element.parentElement.scrollIntoView();
                        is_valid = false;
                    }
                }
                return is_valid;
            }
            ValidateCheckCount() {
                let check_amount = 0;
                for (let pt of this.payment_type_data) {
                    for (let pmd of pt.payment_method_data) {
                        if (pmd.check_count > 0)
                            return true;
                        check_amount += pmd.check_amount;
                    }
                }
                return check_amount === 0;
            }
            IsValid() {
                Transaction.error_scrolled = false;
                this.ResetErrorElements();
                let is_valid = true;
                //if (this.department_id === -1)
                //{
                //  //ControlGroup.UpdateSelectError(this.department_element_container, "Invalid Department Selected");
                //  is_valid = false;
                //}
                if (this.received_from.length === 0) {
                    Transaction.ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "This field is required.");
                    is_valid = false;
                }
                return is_valid;
            }
            ResetErrorElements() {
                Utilities.Clear_Element(this.transaction_error_element);
                Transaction.ControlGroup.UpdateSelectError(this.department_element_container, "");
                Transaction.ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "");
            }
            SaveTransactionData() {
                // first let's reorder all of the payment_type_index fields
                // by reorder I mean make them representative
                // of the actual index that element is in the array.
                let t = this;
                let path = Transaction.GetPath();
                Utilities.Post(path + "API/Transaction/Save", t)
                    .then(function (response) {
                    console.log("post probably good", response);
                    Transaction.currentReceipt.ShowReceipt(response);
                    Transaction.ResetReceipt();
                    Transaction.Data.TransactionData.GetTransactionList()
                        .then((tv) => {
                        Transaction.transactions = tv;
                        TransactionData.RenderTransactionList(tv);
                        Utilities.Toggle_Loading_Button(Data.TransactionData.reload_button, false);
                    });
                    // need to reset the current transaction
                    // and display the one that I just downloaded.
                }, function (error) {
                    console.log("post error occurred", error);
                });
            }
            /*
             * Transaction View Code
             */
            static GetTransactionList() {
                let page = Transaction.current_page;
                Utilities.Toggle_Loading_Button(TransactionData.reload_button, true);
                let path = Transaction.GetPath();
                let filters = TransactionData.GetTransactionFilters();
                return Utilities.Get(path + "API/Transaction/Get?page_number=" + page.toString() + filters);
            }
            static GetTransactionPageCount() {
                let path = Transaction.GetPath();
                let props = [];
                let filters = TransactionData.GetTransactionFilters();
                if (filters.length > 0)
                    filters = "?" + filters.substr(1);
                return Utilities.Get(path + "API/Transaction/PageCount" + filters);
            }
            static GetTransactionFilters() {
                let props = [];
                if (Transaction.name_filter.length > 0)
                    props.push("&display_name_filter=" + Transaction.name_filter);
                if (Transaction.department_id_filter > 0)
                    props.push("&department_id_filter=" + Transaction.department_id_filter.toString());
                if (Transaction.transaction_type_filter.length > 0)
                    props.push("&transaction_type_filter=" + Transaction.transaction_type_filter);
                if (Transaction.completed_filter.length > 0)
                    props.push("&completed_filter=" + Transaction.completed_filter);
                if (Transaction.modified_only_filter)
                    props.push("&has_been_modified=true");
                if (Transaction.transaction_number_filter.length > 0)
                    props.push("&transaction_number_filter=" + Transaction.transaction_number_filter);
                return props.join("");
            }
            static GetSpecificTransaction(transaction_id) {
                let path = Transaction.GetPath();
                return Utilities.Get(path + "API/Transaction/GetTransactionData?transaction_id=" + transaction_id.toString());
            }
            static RenderTransactionList(transactions, target_container = null, footer = null) {
                let deposit_view = target_container !== null;
                //Transaction.ViewTransactions();
                let container = target_container;
                if (!deposit_view) {
                    container = document.getElementById(TransactionData.transaction_list_view_container);
                }
                Utilities.Clear_Element(container);
                let table = TransactionData.CreateTransactionListTable(deposit_view);
                container.appendChild(table);
                let tbody = document.createElement("tbody");
                table.appendChild(tbody);
                let colspan = !deposit_view ? 11 : 9;
                let errorMessage = !deposit_view ? "No transactions were found to match your filters." : "No transactions were found.";
                if (transactions.length === 0) {
                    tbody.appendChild(Transaction.CreateMessageRow(colspan, errorMessage));
                }
                else {
                    for (let data of transactions) {
                        tbody.appendChild(TransactionData.CreateTransactionListRow(data, deposit_view));
                    }
                }
                if (footer !== null)
                    table.appendChild(footer);
            }
            static CreateTransactionsTableFooter(saved_transaction) {
                let tfoot = document.createElement("tfoot");
                let tr = document.createElement("tr");
                tfoot.appendChild(tr);
                let spacer = Utilities.CreateTableCell("td", "Deposit Totals", "has-text-right");
                spacer.colSpan = 6;
                tr.appendChild(spacer);
                tr.appendChild(Utilities.CreateTableCell("td", saved_transaction.total_check_count.toString(), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(saved_transaction.total_check_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(saved_transaction.total_cash_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(saved_transaction.total_check_amount + saved_transaction.total_cash_amount), "has-text-right"));
                return tfoot;
            }
            static CreateTransactionListTable(short_view = false) {
                let table = document.createElement("table");
                table.classList.add("table", "is-fullwidth");
                let thead = document.createElement("thead");
                thead.id = "transaction_list_view_header";
                table.appendChild(thead);
                let tr = document.createElement("tr");
                thead.appendChild(tr);
                tr.appendChild(Utilities.CreateTableCell("th", "Created On", "has-text-left", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered", "5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Number", "has-text-left", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Status", "has-text-left", "7.5%")); //!short_view ? "7.5%" : "12.5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Department", "has-text-left", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Received From", "has-text-left", "12.5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Checks", "has-text-right", "7.5%")); //!short_view ? "7.5%" : "12.5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "$ Check", "has-text-right", "7.5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "$ Cash", "has-text-right", "7.5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "$ Total", "has-text-right", "7.5%"));
                if (!short_view) {
                    let page = Utilities.CreateTableCell("th", "Pg: " + Transaction.current_page.toString(), "has-text-centered", "5%");
                    //page.colSpan = 2;
                    tr.appendChild(page);
                }
                //tr.appendChild(Utilities.CreateTableCell("th", "Page: " + Transaction.current_page.toString(), "", "5%"));
                return table;
            }
            static CreateTransactionListRow(data, short_view) {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.created_on), "has-text-left"));
                //let transaction_display_value = data.transaction_type + " / " + data.transaction_number;
                tr.appendChild(Utilities.CreateTableCell("td", data.transaction_type, "has-text-centered"));
                let link = document.createElement("a");
                link.appendChild(document.createTextNode(data.transaction_number));
                link.onclick = () => {
                    Transaction.ShowReceiptDetail(data.transaction_id);
                };
                let linkCell = Utilities.CreateTableCell("td", "", "has-text-left");
                linkCell.appendChild(link);
                tr.appendChild(linkCell);
                let status = "";
                if (data.transaction_type === "R" || data.transaction_type === "C") {
                    if (data.child_transaction_id === null) {
                        status = "Incomplete";
                    }
                    else {
                        if (data.child_transaction_id === data.transaction_id) {
                            status = "Completed";
                        }
                        else {
                            status = "Deposited"; // maybe turn this into a link to the deposit?
                        }
                    }
                }
                else {
                    if (data.transaction_type === "D") {
                        if (data.child_transaction_id === null) {
                            status = "Incomplete";
                        }
                        else {
                            status = "Accepted";
                        }
                    }
                }
                tr.appendChild(Utilities.CreateTableCell("td", status, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.department_name, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.received_from, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.total_check_count.toString(), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_cash_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount + data.total_cash_amount), "has-text-right"));
                if (!short_view) {
                    //let listtd = document.createElement("td");
                    //listtd.classList.add("has-text-right");
                    //let detailButton = TransactionData.CreateTableCellIconButton("fa-list", "is-small");
                    //detailButton.onclick = () =>
                    //{
                    //  Transaction.ShowReceiptDetail(data.transaction_id);
                    //}
                    //listtd.appendChild(detailButton);
                    //tr.appendChild(listtd);
                    let printtd = document.createElement("td");
                    printtd.classList.add("has-text-right");
                    let printButton = TransactionData.CreateTableCellIconButton("fa-print", "is-small");
                    printButton.onclick = () => {
                        Transaction.ShowReceipt(data.transaction_id);
                    };
                    printtd.appendChild(printButton);
                    tr.appendChild(printtd);
                }
                return tr;
            }
            static CreateTableCellIconButton(icon, size) {
                let button = document.createElement("a");
                button.classList.add("button", size);
                let span = document.createElement("span");
                span.classList.add("icon", size);
                let i = document.createElement("i");
                i.classList.add("fas", icon);
                span.appendChild(i);
                button.appendChild(span);
                return button;
            }
            /*
             * Add New Payment Type to Saved Transaction
             *
             */
            SaveNewPaymentTypes() {
                console.log("save new payment types", this.payment_type_data);
                if (this.transaction_id === -1) {
                    alert("There was an error attempting to save this transaction.  The transaction id is unknown.");
                    return;
                }
                let PaymentTypesToSave = [];
                for (let pt of this.payment_type_data) {
                    if (pt.transaction_payment_type_id === -1) {
                        pt.transaction_id = this.transaction_id;
                        pt.added_after_save = true;
                        PaymentTypesToSave.push(pt);
                    }
                }
                if (!this.ValidateNewPaymentTypes(PaymentTypesToSave)) {
                    console.log("failed to validate new payment types");
                    return;
                }
                let path = Transaction.GetPath();
                Utilities.Post_Empty(path + "API/Transaction/AddPaymentTypes", PaymentTypesToSave)
                    .then((response) => {
                    console.log("response", response);
                    if (response.ok) {
                        response.text().then(text => {
                            console.log('response text', text);
                            if (text.length > 0) {
                                alert("An error occurred attempting to save this payment type:\r\n" + text);
                            }
                            else {
                                Transaction.ShowReceiptDetail(this.transaction_id);
                            }
                        });
                    }
                    else {
                        alert("An error occurred attempting to save this payment type:\r\n" + response.text);
                    }
                });
            }
            static CreateAcceptDepositMenu(saved_transaction) {
                saved_transaction.transaction_type = "C";
                //saved_transaction.total_check_amount = 0;
                //saved_transaction.total_check_count = 0;
                //saved_transaction.total_cash_amount = 0;
                let df = document.createDocumentFragment();
                let container = document.createElement("div");
                container.classList.add("columns", "is-multiline");
                df.appendChild(container);
                let cash_input = Transaction.ControlGroup.CreateInput("number", 15, true, "Cash Amount");
                let cash_input_container = Transaction.ControlGroup.CreateInputFieldContainer(cash_input, "Cash Amount Collected", true, "is-one-quarter");
                container.appendChild(cash_input_container);
                cash_input.oninput = (event) => {
                    saved_transaction.total_cash_amount = 0;
                    if (Transaction.ControlGroup.ValidateMoney(cash_input, cash_input_container)) {
                        saved_transaction.total_cash_amount = cash_input.valueAsNumber;
                    }
                };
                let check_input = Transaction.ControlGroup.CreateInput("number", 15, true, "Check Amount");
                let check_input_container = Transaction.ControlGroup.CreateInputFieldContainer(check_input, "Check Amount Collected", true, "is-one-quarter");
                container.appendChild(check_input_container);
                check_input.oninput = (event) => {
                    saved_transaction.total_check_amount = 0;
                    if (Transaction.ControlGroup.ValidateMoney(check_input, check_input_container)) {
                        saved_transaction.total_check_amount = check_input.valueAsNumber;
                    }
                };
                let check_count_input = Transaction.ControlGroup.CreateInput("number", 15, true, "# of Checks");
                let check_count_input_container = Transaction.ControlGroup.CreateInputFieldContainer(check_count_input, "# of Checks", true, "is-one-quarter");
                container.appendChild(check_count_input_container);
                check_count_input.oninput = (event) => {
                    saved_transaction.total_check_count = 0;
                    if (Transaction.ControlGroup.ValidateNumber(check_count_input, check_count_input_container)) {
                        saved_transaction.total_check_count = check_count_input.valueAsNumber;
                    }
                };
                let comment_input = document.createElement("textarea");
                comment_input.maxLength = 500;
                comment_input.required = false;
                comment_input.classList.add("textarea", "is-normal");
                comment_input.rows = 4;
                comment_input.value = "";
                comment_input.oninput = (event) => {
                    saved_transaction.comment = comment_input.value;
                };
                let comment_input_container = Transaction.ControlGroup.CreateInputFieldContainer(comment_input, "Comments ** optional", true, "is-half");
                container.appendChild(comment_input_container);
                let save_button = document.createElement("button");
                save_button.classList.add("button", "is-success");
                save_button.appendChild(document.createTextNode("Create Receipt For This Deposit"));
                save_button.onclick = () => {
                    console.log("Create C Transaction", saved_transaction);
                    // validate
                    Utilities.Toggle_Loading_Button(save_button, true);
                    if (saved_transaction.total_cash_amount === 0 && saved_transaction.total_check_amount === 0 && saved_transaction.comment.length === 0) {
                        alert("In order to create a receipt for this deposit, you must enter this information.");
                        return;
                    }
                    let path = Transaction.GetPath();
                    Utilities.Post(path + "API/Transaction/Save", saved_transaction)
                        .then(function (response) {
                        Transaction.currentReceipt.ShowReceipt(response);
                        Transaction.ResetReceipt();
                        Transaction.GetTransactionList(Transaction.current_page, false)
                            .then(() => {
                            Utilities.Toggle_Loading_Button(save_button, false);
                        });
                        // need to reset the current transaction
                        // and display the one that I just downloaded.
                    }, function (error) {
                        console.log("post error occurred", error);
                    });
                };
                let save_button_container = Transaction.ControlGroup.CreateInputFieldContainer(save_button, "", true, "is-one-quarter");
                container.appendChild(save_button_container);
                return df;
            }
            static SaveDepositReceipt() {
            }
        }
        // client side only stuff
        TransactionData.reload_button = 'filterRefreshButton';
        TransactionData.action_container = 'action_view';
        TransactionData.transaction_view_container = "transaction_view";
        TransactionData.transaction_list_view_container = 'transaction_list_view';
        TransactionData.transaction_view_filters_container = "transaction_view_filters";
        Data.TransactionData = TransactionData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=TransactionData.js.map