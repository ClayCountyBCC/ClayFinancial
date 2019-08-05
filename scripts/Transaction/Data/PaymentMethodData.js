var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentMethodData {
            constructor(is_cash, payment_type_id, show_cancel = false, element_id) {
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
                this.validate_money_regex = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";
                this.control_to_render = null;
                this.is_cash = is_cash;
                this.payment_type_id = payment_type_id;
                this.show_cancel = show_cancel;
                this.payment_method_data_id = element_id;
                is_cash ? this.RenderCashControls() : this.RenderCheckControls();
            }
            RenderCashControls() {
                let columns = document.createElement("div");
                columns.classList.add("columns");
                this.cash_amount_input_element = PaymentMethodData.CreateInput("tel", 15, true, "0");
                this.cash_amount_input_element.oninput = (event) => {
                    this.cash_amount = parseFloat(event.target.value);
                };
                columns.appendChild(Transaction.Control.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-third"));
                this.control_to_render = columns;
            }
            RenderCheckControls() {
                let columns = document.createElement("div");
                columns.classList.add("columns", "is-multiline", "check");
                this.check_amount_input_element = PaymentMethodData.CreateInput("tel", 15, true, "0");
                this.check_amount_input_element.oninput = (event) => {
                    this.check_amount = parseFloat(event.target.value);
                };
                this.check_number_input_element = PaymentMethodData.CreateInput("text", 50, false, "Check Number");
                this.check_number_input_element.oninput = (event) => {
                    this.check_number = event.target.value;
                };
                this.paying_for_input_element = PaymentMethodData.CreateInput("text", 500, false, "Check Paying For");
                this.paying_for_input_element.oninput = (event) => {
                    this.paying_for = event.target.value;
                };
                this.check_from_input_element = PaymentMethodData.CreateInput("text", 500, false, "Check From");
                this.check_from_input_element.oninput = (event) => {
                    this.check_from = event.target.value;
                };
                this.add_check_button_element = document.createElement("button");
                this.add_check_button_element.classList.add("button", "is-info", "is-medium");
                this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));
                columns.appendChild(Transaction.Control.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-third"));
                columns.appendChild(Transaction.Control.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-third"));
                if (this.show_cancel) {
                    let buttons = [];
                    this.cancel_check_button_element = document.createElement("button");
                    this.cancel_check_button_element.classList.add("button", "is-warning", "is-medium");
                    this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));
                    buttons.push(this.add_check_button_element);
                    buttons.push(this.cancel_check_button_element);
                    columns.appendChild(Transaction.Control.CreateButtonlistFieldContainer(buttons, "", true, "is-one-third"));
                }
                else {
                    columns.appendChild(Transaction.Control.CreateInputFieldContainer(this.add_check_button_element, "", true, "is-one-third"));
                }
                columns.appendChild(Transaction.Control.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half"));
                columns.appendChild(Transaction.Control.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half"));
                this.control_to_render = columns;
            }
            static CreateInput(input_type, input_length, is_required, placeholder) {
                let input = document.createElement("input");
                input.type = input_type;
                input.maxLength = input_length;
                input.classList.add("input", "is-medium");
                input.placeholder = placeholder;
                input.required = is_required;
                input.value = "";
                return input;
            }
        }
        Data.PaymentMethodData = PaymentMethodData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentMethodData.js.map