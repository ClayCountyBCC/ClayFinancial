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
                this.selected_control = control;
                this.control_id = control.control_id;
                if (clone_node) {
                    this.input_element = control.rendered_input_element.cloneNode(true);
                }
                else {
                    this.input_element = control.rendered_input_element;
                }
                this.payment_type_id = payment_type_id;
                if (this.input_element.getAttribute("data_control_id") === null) {
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
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map