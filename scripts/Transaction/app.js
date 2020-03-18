var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
        if (!(Transaction.currentReceipt === null)) {
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