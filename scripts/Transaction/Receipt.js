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
                        if (control.data_type === "money") {
                            let v = Utilities.Format_Amount(parseFloat(cd.value));
                            this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(control.label, v));
                        }
                        else {
                            this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(control.label, cd.value));
                        }
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
            tr.classList.add("pagebreak");
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
            tr.classList.add("pagebreak");
            tr.appendChild(Utilities.CreateTableCell("th", "Check Number", "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered"));
            tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 4));
            return tr;
        }
        CreateCheckDataRow(pmd) {
            let tr = document.createElement("tr");
            tr.classList.add("pagebreak");
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
            tr.classList.add("pagebreak");
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
            if (t.transaction_type == "C") {
                df.appendChild(this.CreatePrintableControl("is-one-third", "Received From", t.received_from));
                df.appendChild(this.CreatePrintableControl("is-one-third", "Department", t.department_name));
                df.appendChild(this.CreatePrintableControl("is-one-third", "Workday Receipt Number", t.workday_receipt));
            }
            else {
                df.appendChild(this.CreatePrintableControl("is-half", "Received From", t.received_from));
                df.appendChild(this.CreatePrintableControl("is-half", "Department", t.department_name));
            }
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