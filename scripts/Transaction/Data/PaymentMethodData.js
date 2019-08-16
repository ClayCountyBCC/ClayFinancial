var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentMethodData {
            constructor(is_cash, payment_type_id, show_cancel = false, element_id, payment_method_amount_change) {
                this.is_cash = false;
                this.payment_method_data_id = -1;
                this.payment_type_id = -1;
                this.prior_payment_method_data_id = -1;
                this.transaction_id = -1;
                this.error_text = "";
                this.show_cancel = false;
                this.cash_amount = 0;
                this.cash_amount_input_element = null;
                this.check_amount = 0;
                this.check_amount_input_element = null;
                this.check_number = "";
                this.check_number_input_element = null;
                this.paying_for = "";
                this.paying_for_input_element = null;
                this.check_from = "";
                this.check_from_input_element = null;
                this.add_check_button_element = null;
                this.cancel_check_button_element = null;
                this.payment_method_change = () => { };
                this.validate_money_regex = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";
                this.control_to_render = null;
                this.is_cash = is_cash;
                this.payment_type_id = payment_type_id;
                this.show_cancel = show_cancel;
                this.payment_method_data_id = element_id;
                this.payment_method_change = payment_method_amount_change;
                is_cash ? this.RenderCashControls() : this.RenderCheckControls();
            }
            Validate() {
                return false;
            }
            RenderCashControls() {
                let columns = document.createElement("div");
                columns.classList.add("columns");
                this.cash_amount_input_element = Transaction.ControlGroup.CreateInput("tel", 15, true, "0");
                this.cash_amount_input_element.oninput = (event) => {
                    this.cash_amount = parseFloat(event.target.value.replace("$", ""));
                    this.payment_method_change();
                };
                columns.appendChild(Transaction.ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter"));
                this.control_to_render = columns;
            }
            RenderCheckControls() {
                let columns = document.createElement("div");
                columns.classList.add("columns", "is-multiline", "check");
                this.check_amount_input_element = Transaction.ControlGroup.CreateInput("tel", 15, true, "0");
                this.check_amount_input_element.oninput = (event) => {
                    this.check_amount = 0;
                    let input = event.target;
                    let value = input.value.trim();
                    if (value.length > 0) {
                        let v = parseFloat(value);
                        if (!isNaN(v))
                            this.check_amount = v;
                    }
                    this.payment_method_change();
                };
                this.check_number_input_element = Transaction.ControlGroup.CreateInput("text", 50, false, "Check Number");
                this.check_number_input_element.oninput = (event) => {
                    this.check_number = event.target.value;
                };
                this.paying_for_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check Paying For");
                this.paying_for_input_element.oninput = (event) => {
                    this.paying_for = event.target.value;
                };
                this.check_from_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check From");
                this.check_from_input_element.oninput = (event) => {
                    this.check_from = event.target.value;
                };
                this.add_check_button_element = document.createElement("button");
                this.add_check_button_element.classList.add("button", "is-info", "is-medium");
                this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));
                columns.appendChild(Transaction.ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter"));
                columns.appendChild(Transaction.ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter"));
                if (this.show_cancel) {
                    let buttons = [];
                    this.cancel_check_button_element = document.createElement("button");
                    this.cancel_check_button_element.classList.add("button", "is-warning", "is-medium");
                    this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));
                    buttons.push(this.add_check_button_element);
                    buttons.push(this.cancel_check_button_element);
                    columns.appendChild(Transaction.ControlGroup.CreateButtonlistFieldContainer(buttons, "", true, "is-one-half"));
                }
                else {
                    columns.appendChild(Transaction.ControlGroup.CreateInputFieldContainer(this.add_check_button_element, "", true, "is-one-half"));
                }
                columns.appendChild(Transaction.ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half"));
                columns.appendChild(Transaction.ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half"));
                this.control_to_render = columns;
            }
        }
        Data.PaymentMethodData = PaymentMethodData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentMethodData.js.map