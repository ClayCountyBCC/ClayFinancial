var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentTypeData {
            constructor(target_container, does_tax_exempt_apply, payment_type_id, controls) {
                this.transaction_payment_type_id = -1;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.transaction_id = -1;
                this.does_tax_exempt_apply = false;
                this.tax_exempt = false;
                this.control_data = [];
                this.payment_type_container = null;
                this.payment_type_element = null;
                this.controls = [];
                this.payment_methods = [];
                this.error_text = "";
                this.next_payment_method_id = 0;
                this.payment_type_container = target_container;
                this.payment_type_id = payment_type_id;
                this.controls = controls;
                this.does_tax_exempt_apply = does_tax_exempt_apply;
                let li = document.createElement("li");
                li.style.display = "block";
                this.RenderControls(li);
                this.RenderPaymentMethods(li);
                this.payment_type_container.appendChild(li);
            }
            RenderControls(target_container) {
                let group_element = document.createElement("div");
                group_element.classList.add("columns", "is-multiline");
                for (let i = 0; i < this.controls.length; i++) {
                    let c = this.controls[i];
                    let hints = c.render_hints.split(",");
                    let cd = new Data.ControlData(c, this.payment_type_id, hints);
                    this.control_data.push(cd);
                    if (cd.single_element !== null) {
                        target_container.appendChild(cd.single_element);
                    }
                    else {
                        if (hints.indexOf("short") !== -1 || hints.indexOf("medium") !== -1) {
                            group_element.appendChild(cd.group_element);
                            if (i + 1 === this.controls.length) {
                                target_container.appendChild(group_element);
                            }
                        }
                    }
                }
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
                let check = new Data.PaymentMethodData(false, this.payment_type_id, show_cancel, this.next_payment_method_id++);
                target_container.appendChild(check.control_to_render);
                this.payment_methods.push(check);
                check.add_check_button_element.onclick = (event) => {
                    this.AddCheckPaymentMethod(target_container, true);
                };
                if (show_cancel) {
                    check.cancel_check_button_element.onclick = (event) => {
                        target_container.removeChild(check.control_to_render);
                        let indextoremove = this.payment_methods.findIndex(function (j) { return j.payment_method_data_id === check.payment_method_data_id; });
                        if (indextoremove > -1)
                            this.payment_methods.splice(indextoremove, 1);
                        check = null;
                    };
                }
            }
            AddCashPaymentMethod(target_container) {
                let cash = new Data.PaymentMethodData(true, this.payment_type_id, false, this.next_payment_method_id++);
                target_container.appendChild(cash.control_to_render);
                this.payment_methods.push(cash);
            }
        }
        Data.PaymentTypeData = PaymentTypeData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentTypeData.js.map