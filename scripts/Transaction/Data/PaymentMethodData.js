var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentMethodData {
            constructor(is_cash, show_cancel = false, element_id, payment_method_amount_change) {
                this.payment_method_data_id = -1;
                this.prior_payment_method_data_id = -1;
                this.transaction_payment_type_id = -1;
                this.transaction_id = -1;
                this.cash_amount = 0;
                this.check_amount = 0;
                this.check_number = "";
                this.check_from = "";
                this.paying_for = "";
                this.is_active = true;
                this.added_after_save = false;
                this.modified_by = "";
                this.modified_on = new Date();
                this.reason_for_change = "";
                this.error_text = "";
                //client side specific properties
                this.is_cash = false;
                this.show_cancel = false;
                this.cash_amount_input_element = null;
                this.cash_amount_input_element_container = null;
                this.check_amount_input_element = null;
                this.check_amount_input_element_container = null;
                this.check_number_input_element = null;
                this.check_number_input_element_container = null;
                this.paying_for_input_element = null;
                this.paying_for_input_element_container = null;
                this.check_from_input_element = null;
                this.check_from_input_element_container = null;
                this.add_check_button_element = null;
                this.cancel_check_button_element = null;
                this.payment_method_change = () => { };
                this.validate_money_regex = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";
                this.control_to_render = null;
                this.is_cash = is_cash;
                this.show_cancel = show_cancel;
                this.payment_method_data_id = element_id;
                this.payment_method_change = payment_method_amount_change;
                is_cash ? this.RenderCashControls() : this.RenderCheckControls();
            }
            Validate() {
                if (this.is_cash)
                    return this.ValidateCash();
                return this.ValidateCheck();
            }
            ValidateCash() {
                let input = this.cash_amount_input_element;
                let e = this.ValidateNumericAmount(input);
                Transaction.ControlGroup.UpdateInputError(this.cash_amount_input_element, this.cash_amount_input_element_container, e);
                return e.length === 0;
            }
            ValidateNumericAmount(input) {
                if (input.value.length === 0) {
                    return "You must enter a number. (No commas or $ allowed).";
                }
                if (input.valueAsNumber === NaN) {
                    return "Please enter Numbers and Decimal points only.";
                }
                if (input.valueAsNumber < 0) {
                    return "Negative numbers are not allowed.";
                }
                let i = input.value.split(".");
                if (i.length === 2) {
                    if (i[1].length > 2) {
                        return "Too many digits after the decimal place. Amounts are limited to 2 digits after the decimal place.";
                    }
                }
                return "";
            }
            ValidateCheck() {
                let is_valid = true;
                let v = this.ValidateCheckAmount();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidateCheckNumber();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidateCheckFrom();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidatePayingFor();
                if (!v && is_valid)
                    is_valid = v;
                return is_valid;
            }
            ValidateCheckAmount() {
                let input = this.check_amount_input_element;
                let e = this.ValidateNumericAmount(input);
                Transaction.ControlGroup.UpdateInputError(this.check_amount_input_element, this.check_amount_input_element_container, e);
                return e.length === 0;
            }
            ValidateCheckNumber() {
                let input = this.check_number_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check is entered.";
                }
                if (input.value.length === 0 && this.check_amount > 0) {
                    e = "A check number is required when you enter a check amount.";
                }
                if (input.value.length > 50) {
                    e = "The check number can be at most 50 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.check_number_input_element, this.check_number_input_element_container, e);
                return e.length === 0;
            }
            ValidatePayingFor() {
                let input = this.paying_for_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check is entered.";
                }
                if (input.value.length > 500) {
                    e = "This field can be at most 500 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.paying_for_input_element, this.paying_for_input_element_container, e);
                return e.length === 0;
            }
            ValidateCheckFrom() {
                let input = this.check_from_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check is entered.";
                }
                if (input.value.length === 0 && this.check_amount > 0) {
                    e = "This field is required if you enter a check amount.";
                }
                if (input.value.length > 500) {
                    e = "This field can be at most 500 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.check_from_input_element, this.check_from_input_element_container, e);
                return e.length === 0;
            }
            RenderCashControls() {
                let columns = document.createElement("div");
                columns.classList.add("columns");
                this.cash_amount_input_element = Transaction.ControlGroup.CreateInput("number", 15, true, "0");
                this.cash_amount_input_element.oninput = (event) => {
                    this.cash_amount = 0;
                    if (this.ValidateCash()) {
                        this.cash_amount = this.cash_amount_input_element.valueAsNumber;
                    }
                    this.payment_method_change();
                };
                this.cash_amount_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter");
                columns.appendChild(this.cash_amount_input_element_container);
                this.control_to_render = columns;
            }
            RenderCheckControls() {
                let columns = document.createElement("div");
                columns.classList.add("columns", "is-multiline", "check");
                this.check_amount_input_element = Transaction.ControlGroup.CreateInput("number", 15, true, "0");
                this.check_amount_input_element.oninput = (event) => {
                    this.check_amount = 0;
                    if (this.ValidateCheckAmount()) {
                        this.check_amount = this.check_amount_input_element.valueAsNumber;
                    }
                    this.payment_method_change();
                };
                this.check_number_input_element = Transaction.ControlGroup.CreateInput("text", 50, false, "Check Number");
                this.check_number_input_element.oninput = (event) => {
                    if (this.ValidateCheckNumber()) {
                        this.check_number = event.target.value;
                    }
                };
                this.paying_for_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check Paying For");
                this.paying_for_input_element.oninput = (event) => {
                    if (this.ValidatePayingFor()) {
                        this.paying_for = event.target.value;
                    }
                };
                this.check_from_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check From");
                this.check_from_input_element.oninput = (event) => {
                    if (this.ValidateCheckFrom()) {
                        this.check_from = event.target.value;
                    }
                };
                this.add_check_button_element = document.createElement("button");
                this.add_check_button_element.classList.add("button", "is-info", "is-medium");
                this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));
                this.check_amount_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter");
                columns.appendChild(this.check_amount_input_element_container);
                this.check_number_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter");
                columns.appendChild(this.check_number_input_element_container);
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
                this.paying_for_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half");
                columns.appendChild(this.paying_for_input_element_container);
                this.check_from_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half");
                columns.appendChild(this.check_from_input_element_container);
                this.control_to_render = columns;
            }
        }
        Data.PaymentMethodData = PaymentMethodData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentMethodData.js.map