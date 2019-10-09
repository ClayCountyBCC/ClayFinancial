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
                                    this.value = Utilities.Format_Date(input.valueAsDate);
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
            static GetAndDisplayControlHistory(control_data_id, transaction_id) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('GetAndDisplayControlHistory', 'control_data_id', control_data_id, 'transaction_id', transaction_id);
                    yield ControlData.GetControlHistory(control_data_id, transaction_id)
                        .then((control_data_history) => {
                        console.log('control data history', control_data_history);
                        this.MarkControlDataToEdit(control_data_history);
                        ControlData.DisplayControlHistory(control_data_history);
                    });
                });
            }
            static MarkControlDataToEdit(control_data) {
                let filtered = control_data.filter(x => x.is_active);
                if (filtered.length === 1) {
                    let c = filtered[0];
                    let cd = new Data.ControlData(c.control, c.payment_type_id, false);
                    cd.transaction_payment_type_id = c.transaction_payment_type_id;
                    cd.department_id = c.department_id;
                    cd.is_active = c.is_active;
                    cd.control_data_id = c.control_data_id;
                    cd.value = c.value;
                    Transaction.editing_control_data = c;
                }
                else {
                    alert("Invalid data stored in database for this transaction.");
                }
            }
            static DisplayControlHistory(control_data) {
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map