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
            this.CreatePaymentTypeDisplay(t);
        }
        CreatePaymentTypeDisplay(t) {
            Utilities.Clear_Element(this.receipt_view_contents_element);
            Utilities.Clear_Element(this.receipt_view_totals_element);
            let check_total = 0;
            let cash_total = 0;
            let check_count = 0;
            for (let ptd of t.payment_type_data) {
                let current_check_total = 0;
                let current_cash_total = 0;
                let current_check_count = 0;
                for (let pmd of ptd.payment_method_data) {
                    current_cash_total += pmd.cash_amount;
                    current_check_total += pmd.check_amount;
                    current_check_count += pmd.check_count;
                }
                this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeRow(ptd.selected_payment_type !== undefined ? ptd.selected_payment_type.name : ptd.payment_type.name, current_cash_total, current_check_total, current_check_count));
                check_total += current_check_total;
                cash_total += current_cash_total;
                check_count += current_check_count;
            }
            this.receipt_view_totals_element.appendChild(this.CreatePaymentTypeRow("Grand Total", cash_total, check_total, check_count));
        }
        CreatePaymentTypeRow(payment_type, cash_amount, check_amount, check_count) {
            let tr = document.createElement("tr");
            tr.appendChild(Utilities.CreateTableCell("td", payment_type, "has-text-left"));
            tr.appendChild(Utilities.CreateTableCell("td", check_count.toString(), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(check_amount), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(cash_amount), "has-text-right"));
            tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(cash_amount + check_amount), "has-text-right"));
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
            l.classList.add("label", "is-medium");
            l.appendChild(document.createTextNode(label));
            e.appendChild(l);
            let control = document.createElement("p");
            control.classList.add("control");
            e.appendChild(control);
            let input = document.createElement("input");
            input.classList.add("input", "is-static", "is-medium");
            input.value = value;
            input.readOnly = true;
            control.appendChild(input);
            return e;
        }
    }
    //clientside controls
    Receipt.receipt_container = "receipt_view";
    Transaction.Receipt = Receipt;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Receipt.js.map