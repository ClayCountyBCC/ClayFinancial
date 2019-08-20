var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentTypeData {
            constructor(payment_type, target_container, payment_type_index) {
                this.transaction_payment_type_id = -1;
                this.transaction_id = -1;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.control_data = [];
                this.added_after_save = false;
                this.error_text = "";
                this.payment_method_data = [];
                //clientside controls
                this.payment_type_parent_container = null;
                this.payment_type_container = null;
                this.selected_payment_type = null;
                this.cancel_payment_type_button = null;
                this.add_another_payment_type_button = null;
                this.save_button = null;
                this.total_cash_element = null;
                this.total_checks_element = null;
                this.total_number_checks_element = null;
                this.next_payment_method_id = 0;
                this.selected_payment_type = payment_type;
                this.payment_type_parent_container = target_container;
                this.payment_type_id = payment_type.payment_type_id;
                this.payment_type_index = payment_type_index;
                let li = document.createElement("li");
                li.style.display = "block";
                this.payment_type_container = li;
                this.RenderPaymentTypeControls(li);
                this.RenderPaymentMethods(li);
                this.RenderPaymentTypeFooter(li);
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
                let pt = this.selected_payment_type.name;
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
                //items.push(new Utilities.LevelItem("", pt, null, "has-text-left"));
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
            AddCheckPaymentMethod(target_container, show_cancel = false) {
                let check = new Data.PaymentMethodData(false, show_cancel, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
                target_container.appendChild(check.control_to_render);
                this.payment_method_data.push(check);
                check.add_check_button_element.onclick = (event) => {
                    this.AddCheckPaymentMethod(target_container, true);
                };
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
                    if (pmt.check_amount > 0) {
                        number_checks += 1;
                    }
                }
                this.total_cash_element.innerHTML = Utilities.Format_Amount(cash);
                this.total_checks_element.innerHTML = Utilities.Format_Amount(checks);
                this.total_number_checks_element.innerHTML = number_checks.toString();
            }
        }
        Data.PaymentTypeData = PaymentTypeData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentTypeData.js.map