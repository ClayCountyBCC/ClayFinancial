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
                this.workday_receipt = "";
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
                if (payment_type.payment_type_id === 62) {
                    for (let ptd of this.payment_type_data) {
                        if (ptd.payment_type_id === 62) {
                            alert("You can only add 1 Security Deposit to receipt.");
                            return;
                        }
                    }
                }
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
                    if (response.error_text.length === 0) {
                        console.log("post probably good", response);
                        Transaction.currentReceipt.ShowReceipt(response);
                        Transaction.ResetReceipt();
                        Transaction.Data.TransactionData.GetTransactionList()
                            .then((tv) => {
                            Transaction.transactions = tv;
                            TransactionData.RenderTransactionList(tv);
                            Utilities.Toggle_Loading_Button(Data.TransactionData.reload_button, false);
                        });
                    }
                    else {
                        console.log('transaction error', response.error_text, response);
                        Transaction.ViewReceiptDetail();
                        t.ParseReturnedTransactionForErrors(response);
                        return;
                    }
                    // need to reset the current transaction
                    // and display the one that I just downloaded.
                }, function (error) {
                    console.log("post error occurred", error);
                });
            }
            ParseReturnedTransactionForErrors(failed_transaction) {
                let f = failed_transaction;
                // now we compare the current transaction to the failed transaction, match payment type ids
                // and payment type indexes, and then match controls (including departmental)
                // we'll apply any errors we find to the best matched control we have in this transaction.
                for (let cd of f.department_control_data) {
                    if (cd.error_text.length > 0) {
                        let this_cd = this.FindDepartmentControl(cd.control_id);
                        if (this_cd !== undefined) {
                            this_cd.SetErrorText(cd.error_text);
                        }
                    }
                }
                for (let pmd of f.payment_type_data) {
                    let this_pmd = this.FindPaymentType(pmd.payment_type_id, pmd.payment_type_index);
                    if (this_pmd !== undefined) {
                        for (let cd of pmd.control_data) {
                            if (cd.error_text.length > 0) {
                                let this_cd = this_pmd.FindPaymentTypeControl(cd.control_id);
                                if (this_cd !== undefined) {
                                    this_cd.SetErrorText(cd.error_text);
                                }
                            }
                        }
                    }
                }
                Utilities.Error_Show(this.transaction_error_element, failed_transaction.error_text);
                this.transaction_error_element.parentElement.scrollIntoView();
            }
            FindDepartmentControl(control_id) {
                return this.department_control_data.find(c => c.control_id === control_id);
            }
            FindPaymentType(payment_type_id, index) {
                return this.payment_type_data.find(pmd => pmd.payment_type_index === index && pmd.payment_type_id === payment_type_id);
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
                let data_row = document.createElement("tr");
                tr.append(data_row);
                data_row.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.created_on), "has-text-left"));
                if (data.transaction_type === "C" && data.comment.length > 0) {
                    let comment_container = document.createElement("tr");
                    comment_container.appendChild(Utilities.CreateTableCell("td", data.comment, "has-text-left"));
                    tr.appendChild(comment_container);
                }
                //let transaction_display_value = data.transaction_type + " / " + data.transaction_number;
                data_row.appendChild(Utilities.CreateTableCell("td", data.transaction_type, "has-text-centered"));
                let link = document.createElement("a");
                link.appendChild(document.createTextNode(data.transaction_number));
                link.onclick = () => {
                    Transaction.ShowReceiptDetail(data.transaction_id);
                };
                let linkCell = Utilities.CreateTableCell("td", "", "has-text-left");
                linkCell.appendChild(link);
                data_row.appendChild(linkCell);
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
                data_row.appendChild(Utilities.CreateTableCell("td", status, "has-text-left"));
                data_row.appendChild(Utilities.CreateTableCell("td", data.department_name, "has-text-left"));
                data_row.appendChild(Utilities.CreateTableCell("td", data.received_from, "has-text-left"));
                data_row.appendChild(Utilities.CreateTableCell("td", data.total_check_count.toString(), "has-text-right"));
                data_row.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount), "has-text-right"));
                data_row.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_cash_amount), "has-text-right"));
                data_row.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount + data.total_cash_amount), "has-text-right"));
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
                    data_row.appendChild(printtd);
                }
                return data_row;
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
                //let workday_receipt_input = document.createElement("input");
                //workday_receipt_input.maxLength = 500;
                //workday_receipt_input.required = false;
                //workday_receipt_input.classList.add("text", "is-normal");
                //workday_receipt_input.value = "";
                //workday_receipt_input.oninput = (event) => {
                //  saved_transaction.workday_receipt = workday_receipt_input.value;
                //}
                //let field_label = "Workday Receipt Number" + (saved_transaction.can_modify ? "(required)" : "");
                //let workday_receipt_input_container = ControlGroup.CreateInputFieldContainer(workday_receipt_input, field_label, saved_transaction.can_modify, "is-one-quarter");
                //container.appendChild(workday_receipt_input_container);
                let workday_receipt_input = Transaction.ControlGroup.CreateInput("input", 30, true, "Cash Amount");
                let workday_receipt_input_container = Transaction.ControlGroup.CreateInputFieldContainer(workday_receipt_input, "Workday Receipt Number" + (saved_transaction.can_modify ? "(required)" : ""), true, "is-one-quarter");
                container.appendChild(workday_receipt_input_container);
                workday_receipt_input.oninput = (event) => {
                    saved_transaction.workday_receipt = "";
                    if (Transaction.ControlGroup.ValidateText(workday_receipt_input, workday_receipt_input_container)) {
                        saved_transaction.workday_receipt = workday_receipt_input.value;
                    }
                };
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