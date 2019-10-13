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
                this.error_text = "";
                this.received_from = "";
                this.total_cash_amount = -1;
                this.total_check_amount = -1;
                this.total_check_count = -1;
                this.created_on = new Date();
                this.created_by_username = "";
                this.created_by_ip_address = "";
                this.created_by_display_name = "PREVIEW";
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
                let targetContainer = document.getElementById(TransactionData.action_container);
                Utilities.Clear_Element(targetContainer);
                this.CreateReceiptTitle(targetContainer, saved_transaction);
                let control_container = document.createElement("div");
                control_container.id = "transaction_controls";
                control_container.classList.add("columns");
                targetContainer.appendChild(control_container);
                this.department_element = Transaction.DepartmentControl.cloneNode(true);
                this.RenderDepartmentSelection(control_container, saved_transaction);
                this.RenderReceivedFromInput(control_container, saved_transaction);
                this.transaction_error_element = this.CreateTransactionErrorElement();
                targetContainer.appendChild(this.transaction_error_element);
            }
            CreateTransactionErrorElement() {
                let e = document.createElement("div");
                return e;
            }
            CreateReceiptTitle(target, saved_transaction) {
                let title = document.createElement("h2");
                title.classList.add("title", "has-text-centered");
                let text = saved_transaction !== null ? "Viewing Transaction: " + saved_transaction.transaction_number : "Create a New Receipt";
                title.appendChild(document.createTextNode(text));
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
                        //controls_container.classList.toggle("hide");
                        //if (!controls_container.classList.contains("hide"))
                        //{
                        //}
                        console.log('this transaction', this);
                    };
                }
                paymentTypeContainer.appendChild(ol);
            }
            AddPaymentType(payment_type, container, saved_payment_type_data = null) {
                let ptd = new Data.PaymentTypeData(payment_type, container, this.next_payment_type_index++);
                this.payment_type_data.push(ptd);
                ptd.add_another_payment_type_button.onclick = (event) => {
                    this.AddPaymentType(payment_type, container);
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
                ptd.save_button.onclick = (event) => {
                    let button = event.target;
                    Utilities.Toggle_Loading_Button(button, true);
                    if (this.ValidateTransaction()) {
                        Transaction.currentReceipt.ShowReceiptPreview();
                        Utilities.Toggle_Loading_Button(button, false);
                    }
                    else {
                        Utilities.Toggle_Loading_Button(button, false);
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
                paymentTypeContainer.appendChild(ol);
            }
            AddSavedPaymentType(payment_type, payment_type_data, container) {
                let ptd = new Data.PaymentTypeData(payment_type, container, this.next_payment_type_index++, payment_type_data);
                this.payment_type_data.push(ptd);
                ptd.add_another_payment_type_button.style.display = "none";
                //ptd.add_another_payment_type_button.onclick = (event: Event) =>
                //{ // if they click this, I need to capture it so that I can save that particular payment type separately.
                //  this.AddPaymentType(payment_type, container, payment_type_data);
                //}
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
            static RenderTransactionList() {
                Transaction.ViewTransactions();
                let container = document.getElementById(TransactionData.transaction_list_view_container);
                Utilities.Clear_Element(container);
                let table = TransactionData.CreateTransactionListTable();
                container.appendChild(table);
                let tbody = document.createElement("tbody");
                table.appendChild(tbody);
                if (Transaction.transactions.length === 0) {
                    tbody.appendChild(Transaction.CreateMessageRow(11, "No transactions were found to match your filters."));
                }
                else {
                    for (let data of Transaction.transactions) {
                        tbody.appendChild(TransactionData.CreateTransactionListRow(data));
                    }
                }
                Utilities.Toggle_Loading_Button(Data.TransactionData.reload_button, false);
            }
            static CreateTransactionListTable() {
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
                tr.appendChild(Utilities.CreateTableCell("th", "Status", "has-text-left", "7.5%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Department", "has-text-left", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Checks", "has-text-right", "7.25%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check Amount", "has-text-right", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Cash Amount", "has-text-right", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Total Amount", "has-text-right", "10%"));
                let page = Utilities.CreateTableCell("th", "Page: " + Transaction.current_page.toString(), "has-text-centered", "10%");
                page.colSpan = 2;
                tr.appendChild(page);
                //tr.appendChild(Utilities.CreateTableCell("th", "Page: " + Transaction.current_page.toString(), "", "5%"));
                return table;
            }
            static CreateTransactionListRow(data) {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.created_on), "has-text-left"));
                //let transaction_display_value = data.transaction_type + " / " + data.transaction_number;
                tr.appendChild(Utilities.CreateTableCell("td", data.transaction_type, "has-text-centered"));
                tr.appendChild(Utilities.CreateTableCell("td", data.transaction_number, "has-text-left"));
                let status = "";
                if (data.transaction_type === "R") {
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
                tr.appendChild(Utilities.CreateTableCell("td", data.total_check_count.toString(), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_cash_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount + data.total_cash_amount), "has-text-right"));
                //tr.appendChild(Utilities.CreateTableCell("td", "", ""));
                let listtd = document.createElement("td");
                listtd.classList.add("has-text-right");
                let detailButton = TransactionData.CreateTableCellIconButton("fa-list", "is-small");
                detailButton.onclick = () => {
                    Transaction.ShowReceiptDetail(data.transaction_id);
                };
                listtd.appendChild(detailButton);
                tr.appendChild(listtd);
                let printtd = document.createElement("td");
                printtd.classList.add("has-text-right");
                let printButton = TransactionData.CreateTableCellIconButton("fa-print", "is-small");
                printButton.onclick = () => {
                    Transaction.ShowReceipt(data.transaction_id);
                };
                printtd.appendChild(printButton);
                tr.appendChild(printtd);
                //tr.appendChild(Utilities.CreateTableCell("td", "", ""));
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