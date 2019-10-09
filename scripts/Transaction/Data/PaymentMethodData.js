var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class PaymentMethodData {
            constructor(is_cash, show_cancel = false, element_id, payment_method_amount_change, saved_payment_method_data = null) {
                this.payment_method_data_id = -1;
                this.prior_payment_method_data_id = -1;
                this.transaction_payment_type_id = -1;
                this.transaction_id = -1;
                this.cash_amount = 0;
                this.check_amount = 0;
                this.check_count = 0;
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
                this.check_count_input_element = null;
                this.check_count_input_element_container = null;
                this.check_number_input_element = null;
                this.check_number_input_element_container = null;
                this.paying_for_input_element = null;
                this.paying_for_input_element_container = null;
                this.check_from_input_element = null;
                this.check_from_input_element_container = null;
                this.add_check_button_element = null;
                this.cancel_check_button_element = null;
                this.check_buttons_container_element = null;
                this.payment_method_change = () => { };
                this.validate_money_regex = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";
                this.control_to_render = null;
                this.is_cash = is_cash;
                this.show_cancel = show_cancel;
                this.payment_method_data_id = element_id;
                this.payment_method_change = payment_method_amount_change;
                is_cash ? this.RenderCashControls(saved_payment_method_data) : this.RenderCheckControls(saved_payment_method_data);
            }
            Validate() {
                if (this.is_cash)
                    return this.ValidateCash();
                return this.ValidateCheck();
            }
            ValidateCash() {
                return Transaction.ControlGroup.ValidateMoney(this.cash_amount_input_element, this.cash_amount_input_element_container);
            }
            ValidateCheck() {
                let is_valid = true;
                let v = this.ValidateCheckAmount();
                if (!v && is_valid)
                    is_valid = v;
                v = this.ValidateCheckCount();
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
                return Transaction.ControlGroup.ValidateMoney(this.check_amount_input_element, this.check_amount_input_element_container);
            }
            ValidateCheckCount() {
                return Transaction.ControlGroup.ValidateCount(this.check_count_input_element, this.check_count_input_element_container);
            }
            ValidateCheckNumber() {
                let input = this.check_number_input_element;
                let e = "";
                if (input.value.length > 0 && this.check_amount === 0) {
                    e = "This field should only be used if a check is entered.";
                }
                if (input.value.length === 0 && this.check_amount > 0 && this.check_count === 1) {
                    e = "A check number is required when you enter a check amount and set the check count to 1 check.";
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
                    e = "This field should only be used if a check amount is entered.";
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
                    e = "This field should only be used if a check amount is entered.";
                }
                if (input.value.length === 0 && this.check_amount > 0 && this.check_count === 1) {
                    e = "This field is required if you enter a check amount and set the check count to 1 check.";
                }
                if (input.value.length > 500) {
                    e = "This field can be at most 500 characters long.";
                }
                Transaction.ControlGroup.UpdateInputError(this.check_from_input_element, this.check_from_input_element_container, e);
                return e.length === 0;
            }
            RenderCashControls(payment_method_data) {
                let columns = document.createElement("div");
                columns.classList.add("columns");
                this.cash_amount_input_element = Transaction.ControlGroup.CreateInput("number", 15, true, "0");
                if (payment_method_data === null) {
                    this.cash_amount_input_element.oninput = (event) => {
                        this.cash_amount = 0;
                        if (this.ValidateCash()) {
                            this.cash_amount = this.cash_amount_input_element.valueAsNumber;
                        }
                        this.payment_method_change();
                    };
                }
                else {
                    this.cash_amount_input_element.value = payment_method_data.cash_amount.toString();
                    this.cash_amount_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.cash_amount_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.cash_amount_input_element.setAttribute("is_cash", "true");
                }
                this.cash_amount_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter");
                columns.appendChild(this.cash_amount_input_element_container);
                this.control_to_render = columns;
            }
            RenderCheckControls(payment_method_data) {
                let columns = document.createElement("div");
                columns.classList.add("columns", "is-multiline", "check");
                this.check_amount_input_element = Transaction.ControlGroup.CreateInput("number", 15, false, "0");
                if (payment_method_data === null) {
                    this.check_amount_input_element.oninput = (event) => {
                        this.check_amount = 0;
                        if (this.ValidateCheckAmount()) {
                            this.check_amount = this.check_amount_input_element.valueAsNumber;
                            if (this.check_amount > 0) {
                                Utilities.Show_Flex(this.check_buttons_container_element);
                                this.check_count_input_element.required = true;
                            }
                            else {
                                Utilities.Hide(this.check_buttons_container_element);
                                this.check_count_input_element.required = false;
                            }
                        }
                        this.payment_method_change();
                    };
                }
                else {
                    this.check_amount_input_element.readOnly = true;
                    this.check_amount_input_element.value = payment_method_data.check_amount.toString();
                    this.check_amount_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_amount_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_amount_input_element.setAttribute("is_cash", "false");
                }
                this.check_count_input_element = Transaction.ControlGroup.CreateInput("number", 5, false, "# of Checks");
                this.check_count_input_element.step = "1";
                this.check_count_input_element.min = "0";
                if (payment_method_data === null) {
                    this.check_count_input_element.oninput = (event) => {
                        if (this.ValidateCheckCount()) {
                            this.check_count = event.target.valueAsNumber;
                            if (this.check_amount > 0) {
                                switch (this.check_count) {
                                    case 0:
                                        Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Partial Check");
                                        break;
                                    case 1:
                                        Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Single Check");
                                        break;
                                    default:
                                        Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Bulk Check");
                                }
                            }
                            else {
                                Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "");
                            }
                        }
                        else {
                            Transaction.ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "");
                        }
                        this.payment_method_change();
                    };
                }
                else {
                    this.check_count_input_element.readOnly = true;
                    this.check_count_input_element.value = payment_method_data.check_count.toString();
                    this.check_count_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_count_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_count_input_element.setAttribute("is_cash", "false");
                }
                this.check_number_input_element = Transaction.ControlGroup.CreateInput("text", 50, false, "Check Number");
                if (payment_method_data === null) {
                    this.check_number_input_element.oninput = (event) => {
                        if (this.ValidateCheckNumber()) {
                            this.check_number = event.target.value;
                        }
                    };
                }
                else {
                    this.check_number_input_element.readOnly = true;
                    this.check_number_input_element.value = payment_method_data.check_number;
                    this.check_number_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_number_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_number_input_element.setAttribute("is_cash", "false");
                }
                this.paying_for_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check Paying For");
                if (payment_method_data === null) {
                    this.paying_for_input_element.oninput = (event) => {
                        if (this.ValidatePayingFor()) {
                            this.paying_for = event.target.value;
                        }
                    };
                }
                else {
                    this.paying_for_input_element.readOnly = true;
                    this.paying_for_input_element.value = payment_method_data.paying_for;
                    this.paying_for_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.paying_for_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.paying_for_input_element.setAttribute("is_cash", "false");
                }
                this.check_from_input_element = Transaction.ControlGroup.CreateInput("text", 500, false, "Check From");
                if (payment_method_data === null) {
                    this.check_from_input_element.oninput = (event) => {
                        if (this.ValidateCheckFrom()) {
                            this.check_from = event.target.value;
                        }
                    };
                }
                else {
                    this.check_from_input_element.readOnly = true;
                    this.check_from_input_element.value = payment_method_data.check_from;
                    this.check_from_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
                    this.check_from_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
                    this.check_from_input_element.setAttribute("is_cash", "false");
                }
                this.add_check_button_element = document.createElement("button");
                this.add_check_button_element.classList.add("button", "is-info", "is-medium");
                this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));
                this.check_amount_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter");
                columns.appendChild(this.check_amount_input_element_container);
                this.check_count_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_count_input_element, "# of Checks", true, "is-2", true);
                columns.appendChild(this.check_count_input_element_container);
                this.check_number_input_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter");
                columns.appendChild(this.check_number_input_element_container);
                if (this.show_cancel) {
                    let buttons = [];
                    this.cancel_check_button_element = document.createElement("button");
                    this.cancel_check_button_element.classList.add("button", "is-warning", "is-medium");
                    this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));
                    buttons.push(this.add_check_button_element);
                    buttons.push(this.cancel_check_button_element);
                    this.check_buttons_container_element = Transaction.ControlGroup.CreateButtonlistFieldContainer(buttons, "", true, "is-one-half");
                }
                else {
                    this.check_buttons_container_element = Transaction.ControlGroup.CreateInputFieldContainer(this.add_check_button_element, "", true, "is-one-half");
                    this.check_buttons_container_element.classList.add("hide");
                }
                columns.appendChild(this.check_buttons_container_element);
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