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
        class ControlData {
            constructor(control, payment_type_id, clone_node) {
                this.control_data_id = -1;
                this.prior_control_data_id = -1;
                this.transaction_payment_type_id = -1;
                this.department_id = -1;
                this.transaction_id = -1;
                this.control_id = -1;
                this.control = null;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.value = "";
                this.is_active = true;
                this.modified_on = new Date();
                this.modified_by = "";
                this.reason_for_change = "";
                this.error_text = "";
                // client side controls
                this.selected_control = null;
                this.input_element = null;
                this.container_element = null;
                let saved_control_data_id = control.rendered_input_element ? control.rendered_input_element.getAttribute("control_data_id") : null;
                this.selected_control = control;
                this.control_id = control.control_id;
                if (clone_node) {
                    this.input_element = control.rendered_input_element.cloneNode(true);
                }
                else {
                    this.input_element = control.rendered_input_element ? control.rendered_input_element : Transaction.Control.CreateControl(control);
                }
                this.payment_type_id = payment_type_id;
                if (saved_control_data_id === null) {
                    let input = this.input_element;
                    if (input.type === "number") {
                        input.onwheel = (e) => { e.preventDefault(); };
                    }
                    this.input_element.oninput = (event) => {
                        let input = event.target;
                        if (this.Validate()) {
                            switch (control.data_type) {
                                case "date":
                                    let d = input.valueAsDate;
                                    d.setMinutes(d.getTimezoneOffset());
                                    this.value = Utilities.Format_Date(d);
                                    break;
                                case "number":
                                    this.value = input.valueAsNumber.toString();
                                    break;
                                case "count":
                                    this.value = input.valueAsNumber.toString();
                                    input.value = input.valueAsNumber.toString();
                                    break;
                                case "money":
                                    this.value = input.valueAsNumber.toString();
                                    break;
                                default: // "bigtext", "text", "dropdown"
                                    this.value = input.value;
                                    break;
                            }
                        }
                    };
                }
                if (control.data_type === "dropdown") {
                    this.container_element = Transaction.ControlGroup.CreateSelectFieldContainerByControl(control, this.input_element, true);
                }
                else {
                    this.container_element = Transaction.ControlGroup.CreateInputFieldContainerByControl(control, this.input_element, true);
                }
            }
            Validate() {
                switch (this.selected_control.data_type) {
                    case "dropdown":
                        return this.ValidateDropdown();
                    case "count":
                        return this.ValidateCount();
                    case "date":
                        return this.ValidateDate();
                    case "number":
                        return this.ValidateNumber();
                    case "money":
                        return this.ValidateMoney();
                    case "text":
                    case "bigtext":
                        return this.ValidateText();
                    default:
                        return false;
                }
            }
            ValidateDropdown() {
                return Transaction.ControlGroup.ValidateDropdown(this.input_element, this.container_element, this.selected_control.valid_values);
            }
            ValidateDate() {
                return Transaction.ControlGroup.ValidateDate(this.input_element, this.container_element);
            }
            ValidateText() {
                return Transaction.ControlGroup.ValidateText(this.input_element, this.container_element);
            }
            ValidateNumber() {
                return Transaction.ControlGroup.ValidateNumber(this.input_element, this.container_element);
            }
            ValidateCount() {
                return Transaction.ControlGroup.ValidateCount(this.input_element, this.container_element);
            }
            ValidateMoney() {
                return Transaction.ControlGroup.ValidateMoney(this.input_element, this.container_element);
            }
            static GetControlHistory(control_data_id, transaction_id) {
                let path = Transaction.GetPath();
                return Utilities.Get(path + "API/Transaction/GetControlDataHistory?control_data_id=" + control_data_id + "&transaction_id=" + transaction_id);
            }
            SaveControlChanges() {
                let path = Transaction.GetPath();
                console.log('saving this control data', this);
                Utilities.Post(path + "API/Transaction/EditControls", this)
                    .then(response => {
                    if (response.length > 0) {
                        alert("There was a problem saving this change." + '\r\n' + response);
                    }
                    else {
                        Transaction.CloseChangeModal();
                        Transaction.ShowReceiptDetail(this.transaction_id);
                        Transaction.editing_control_data = null;
                    }
                    Utilities.Toggle_Loading_Button("change_transaction_save", false);
                });
            }
            static GetAndDisplayControlHistory(control_data_id, transaction_id) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield ControlData.GetControlHistory(control_data_id, transaction_id)
                        .then((control_data_history) => {
                        ControlData.MarkDataToEdit(control_data_history);
                        ControlData.DisplayControlHistory(control_data_history);
                        ControlData.DisplayControlToEdit();
                    });
                });
            }
            static MarkDataToEdit(control_data) {
                Transaction.editing_control_data = null;
                Transaction.editing_payment_method_data = null;
                let filtered = control_data.filter(x => x.is_active);
                if (filtered.length === 1) {
                    let c = filtered[0];
                    let cd = new Data.ControlData(c.control, c.payment_type_id, false);
                    cd.transaction_payment_type_id = c.transaction_payment_type_id;
                    cd.department_id = c.department_id;
                    cd.is_active = c.is_active;
                    cd.control_data_id = c.control_data_id;
                    cd.transaction_id = c.transaction_id;
                    cd.value = c.value;
                    switch (c.control.data_type) {
                        case "date":
                            if (c.value !== "" && c.value !== null) {
                                let tmp = c.value.split("/");
                                if (tmp.length === 3) {
                                    let v = tmp[2] + '-';
                                    v += tmp[0].length === 1 ? "0" + tmp[0] : tmp[0];
                                    v += "-";
                                    v += tmp[1].length === 1 ? "0" + tmp[1] : tmp[1];
                                    cd.input_element.value = v;
                                }
                            }
                            break;
                        default:
                            cd.input_element.value = c.value;
                    }
                    cd.control = cd.selected_control;
                    Transaction.editing_control_data = cd;
                }
                else {
                    alert("Invalid data stored in database for this transaction.");
                }
            }
            static DisplayControlToEdit() {
                if (Transaction.editing_control_data === null)
                    return;
                let container = document.getElementById(Transaction.change_edit_container);
                Utilities.Clear_Element(container);
                container.classList.add("columns");
                let e = Transaction.editing_control_data;
                container.appendChild(e.container_element);
                Utilities.Set_Value(Transaction.reason_for_change_input, "");
            }
            static CreateControlDataHistoryHeader() {
                let tr = document.createElement("tr");
                tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%"));
                tr.appendChild(Utilities.CreateTableCell("th", "Value", "has-text-left", "50%"));
                return tr;
            }
            static DisplayControlHistory(control_data) {
                let header = document.getElementById(Transaction.change_transaction_history_table_header);
                Utilities.Clear_Element(header);
                header.appendChild(ControlData.CreateControlDataHistoryHeader());
                let body = document.getElementById(Transaction.change_transaction_history_table_body);
                Utilities.Clear_Element(body);
                for (let cd of control_data) {
                    body.appendChild(ControlData.CreateControlDataHistoryRow(cd));
                }
            }
            static CreateControlDataHistoryRow(control_data) {
                let tr = document.createElement("tr");
                if (new Date(control_data.modified_on).getFullYear() < 1000) {
                    let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
                    original.colSpan = 3;
                    tr.appendChild(original);
                }
                else {
                    tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(control_data.modified_on), "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", control_data.modified_by, "has-text-centered"));
                    tr.appendChild(Utilities.CreateTableCell("td", control_data.reason_for_change, "has-text-left"));
                }
                tr.appendChild(Utilities.CreateTableCell("td", control_data.value, "has-text-left"));
                return tr;
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map