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
                    this.AddCheckPaymentMethod(target_container, true);
                };
            }
            AddSavedCashPaymentMethod(target_container, payment_method_data) {
                let cash = new Data.PaymentMethodData(true, false, this.next_payment_method_id++, null, payment_method_data);
                target_container.appendChild(cash.control_to_render);
                this.payment_method_data.push(cash);
            }
        }
        Data.PaymentTypeData = PaymentTypeData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentTypeData.js.map