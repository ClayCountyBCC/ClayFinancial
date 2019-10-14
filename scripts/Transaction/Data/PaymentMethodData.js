var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                this.add_check_button_element.classList.add("button", "is-info", Transaction.app_input_size);
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
                    this.cancel_check_button_element.classList.add("button", "is-warning", Transaction.app_input_size);
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
            static GetHistory(payment_method_data_id, transaction_id) {
                let path = Transaction.GetPath();
                return Utilities.Get(path + "API/Transaction/GetPaymentMethodHistory?payment_method_data_id=" + payment_method_data_id + "&transaction_id=" + transaction_id);
            }
            SaveChanges() {
                let path = Transaction.GetPath();
                Utilities.Post(path + "API/Transaction/EditPaymentMethod", this)
                    .then(response => {
                    if (response.length > 0) {
                        alert("There was a problem saving this change." + '\r\n' + response);
                    }
                    else {
                        Transaction.CloseChangeModal();
                        Transaction.ShowReceiptDetail(this.transaction_id);
                        Transaction.editing_control_data = null;
                        Transaction.editing_payment_method_data = null;
                    }
                    Utilities.Toggle_Loading_Button("change_transaction_save", false);
                });
            }
            static GetAndDisplayHistory(payment_method_data_id, transaction_id, is_cash) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield PaymentMethodData.GetHistory(payment_method_data_id, transaction_id)
                        .then((history) => {
                        PaymentMethodData.MarkDataToEdit(history, is_cash);
                        PaymentMethodData.DisplayHistory(history, is_cash);
                        PaymentMethodData.DisplayEdit();
                    });
                });
            }
            static MarkDataToEdit(payment_method_data, is_cash) {
                Transaction.editing_control_data = null;
                Transaction.editing_payment_method_data = null;
                let filtered = payment_method_data.filter(x => x.is_active);
                if (filtered.length === 1) {
                    let p = filtered[0];
                    let pmd = new Data.PaymentMethodData(is_cash, false, p.payment_method_data_id, () => { });
                    pmd.payment_method_data_id = p.payment_method_data_id;
                    pmd.transaction_id = p.transaction_id;
                    pmd.transaction_payment_type_id = p.transaction_payment_type_id;
                    pmd.prior_payment_method_data_id = p.prior_payment_method_data_id;
                    pmd.is_active = true;
                    if (is_cash) {
                        pmd.cash_amount = p.cash_amount;
                        pmd.cash_amount_input_element.valueAsNumber = p.cash_amount;
                    }
                    else {
                        pmd.check_amount = p.check_amount;
                        pmd.check_amount_input_element.valueAsNumber = p.check_amount;
                        pmd.check_count = p.check_count;
                        pmd.check_count_input_element.valueAsNumber = p.check_count;
                        pmd.check_from = p.check_from;
                        pmd.check_from_input_element.value = p.check_from;
                        pmd.check_number = p.check_number;
                        pmd.check_number_input_element.value = p.check_number;
                        pmd.paying_for = p.paying_for;
                        pmd.paying_for_input_element.value = p.paying_for;
                    }
                    Transaction.editing_payment_method_data = pmd;
                }
                else {
                    alert("Invalid data stored in database for this transaction.");
                }
            }
            static DisplayEdit() {
                if (Transaction.editing_payment_method_data === null)
                    return;
                let container = document.getElementById(Transaction.change_edit_container);
                Utilities.Clear_Element(container);
                container.classList.remove("columns");
                let e = Transaction.editing_payment_method_data;
                Utilities.Clear_Element(e.check_buttons_container_element);
                container.appendChild(e.control_to_render);
                Utilities.Set_Value(Transaction.reason_for_change_input, "");
            }
            static CreateCashHistoryHeader() {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Cash Amount", "has-text-right", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "", "", "35%"));
                return tr;
            }
            static CreateCheckHistoryHeader() {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check Amount", "has-text-right", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check Count", "has-text-centered", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check #", "has-text-left", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-left", "10%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Paying For", "has-text-left", "15%"));
                return tr;
            }
            static DisplayHistory(payment_method_data, is_cash) {
                let header = document.getElementById(Transaction.change_transaction_history_table_header);
                Utilities.Clear_Element(header);
                if (is_cash) {
                    header.appendChild(PaymentMethodData.CreateCashHistoryHeader());
                }
                else {
                    header.appendChild(PaymentMethodData.CreateCheckHistoryHeader());
                }
                let body = document.getElementById(Transaction.change_transaction_history_table_body);
                Utilities.Clear_Element(body);
                for (let pmd of payment_method_data) {
                    if (is_cash) {
                        body.appendChild(PaymentMethodData.CreateCashHistoryRow(pmd));
                    }
                    else {
                        body.appendChild(PaymentMethodData.CreateCheckHistoryRow(pmd));
                    }
                }
            }
            static CreateCashHistoryRow(data) {
                let tr = document.createElement("tr");
                if (new Date(data.modified_on).getFullYear() < 1000) {
                    let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
                    original.colSpan = 3;
                    tr.appendChild(original);
                }
                else {
                    tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.modified_on), "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.modified_by, "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.reason_for_change, "has-text-left"));
                }
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.cash_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", "", "", "35%"));
                return tr;
            }
            static CreateCheckHistoryRow(data) {
                let tr = document.createElement("tr");
                if (new Date(data.modified_on).getFullYear() < 1000) {
                    let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
                    original.colSpan = 3;
                    tr.appendChild(original);
                }
                else {
                    tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.modified_on), "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.modified_by, "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", data.reason_for_change, "has-text-left"));
                }
                tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.check_amount), "has-text-right"));
                tr.appendChild(Utilities.CreateTableCell("td", data.check_count.toString(), "has-text-centered"));
                tr.appendChild(Utilities.CreateTableCell("td", data.check_number, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.check_from, "has-text-left"));
                tr.appendChild(Utilities.CreateTableCell("td", data.paying_for, "has-text-left"));
                return tr;
            }
        }
        Data.PaymentMethodData = PaymentMethodData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=PaymentMethodData.js.map