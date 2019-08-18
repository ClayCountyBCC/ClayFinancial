var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class ControlData {
            constructor(control, payment_type_id) {
                this.control_data_id = -1;
                this.prior_control_data_id = -1;
                this.transaction_payment_type_id = -1;
                this.department_id = -1;
                this.transaction_id = -1;
                this.control_id = -1;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.value = "";
                this.is_active = true;
                this.modified_on = new Date();
                this.modified_by = "";
                this.reason_for_change = "";
                this.error_text = "";
                // client side controls
                this.control = null;
                this.input_element = null;
                this.container_element = null;
                this.control = control;
                this.control_id = control.control_id;
                this.input_element = control.rendered_input_element.cloneNode(true);
                this.payment_type_id = payment_type_id;
                this.input_element.oninput = (event) => {
                    let input = event.target;
                    if (control.data_type === "date") {
                        let v = input.valueAsDate;
                        this.value = v !== null ? Utilities.Format_Date(v) : "";
                    }
                    else {
                        this.value = input.value;
                    }
                };
                if (control.data_type === "dropdown") {
                    this.container_element = Transaction.ControlGroup.CreateSelectFieldContainerByControl(control, this.input_element, true);
                }
                else {
                    this.container_element = Transaction.ControlGroup.CreateInputFieldContainerByControl(control, this.input_element, true);
                }
            }
            Validate() {
                switch (this.control.data_type) {
                    case "dropdown":
                        return this.ValidateDropdown();
                    case "date":
                        return this.ValidateDate();
                    case "text":
                    case "bigtext":
                        return this.ValidateText();
                    default:
                        return false;
                }
            }
            ValidateDropdown() {
                Transaction.ControlGroup.UpdateSelectError(this.container_element, "");
                if (this.value === "-1") {
                    Transaction.ControlGroup.UpdateSelectError(this.container_element, "You must choose one of these options.");
                    return false;
                }
                if (this.control.valid_values.indexOf(this.value) === -1) {
                    Transaction.ControlGroup.UpdateSelectError(this.container_element, "Please select a valid value.");
                    return false;
                }
                return true;
            }
            ValidateDate() {
                Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, "");
                let input = this.input_element;
                if (input.valueAsDate === null && this.control.required) {
                    Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, "You must selected a date.");
                    return false;
                }
            }
            ValidateText() {
                Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, "");
                this.value = this.value.trim();
                let c = this.control;
                if (c.required && this.value.length === 0) {
                    Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, "This field is required.");
                    return false;
                }
                if (c.max_length > 0 && this.value.length > c.max_length) {
                    Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, "You entered " + this.value.length.toString() + " characters but " + c.max_length.toString() + " is the maximum number of characters allowed.");
                    return false;
                }
                return true;
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map