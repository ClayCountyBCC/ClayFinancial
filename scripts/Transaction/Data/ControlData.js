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
                    switch (control.data_type) {
                        case "date":
                            if (this.ValidateDate()) {
                                this.value = Utilities.Format_Date(input.valueAsDate);
                            }
                            break;
                        case "number":
                            if (this.ValidateNumber()) {
                                this.value = input.valueAsNumber.toString();
                            }
                            break;
                        case "count":
                            if (this.ValidateCount()) {
                                this.value = input.valueAsNumber.toString();
                                input.value = input.valueAsNumber.toString();
                            }
                            break;
                        case "money":
                            if (this.ValidateMoney()) {
                                this.value = input.valueAsNumber.toString();
                            }
                            break;
                        default:
                            this.value = input.value;
                            break;
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
                let e = "";
                let input = this.input_element;
                if (input.valueAsDate === null && this.control.required) {
                    e = "You must selected a date.";
                }
                Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, e);
                return e.length === 0;
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
            ValidateNumber() {
                let e = "";
                let input = this.input_element;
                if (input.value.length === 0) {
                    e = "You must enter a number. (No commas or $ allowed).";
                }
                if (input.valueAsNumber === NaN && e.length === 0) {
                    e = "Please enter Numbers and Decimal points only.";
                }
                Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, e);
                return e.length === 0;
            }
            ValidateCount() {
                let e = "";
                let input = this.input_element;
                if (input.value.length === 0) {
                    e = "You must enter a number. (No commas, decimal points, or $ allowed).";
                }
                if (input.valueAsNumber === NaN && e.length === 0) {
                    e = "Please enter Numbers only.";
                }
                if (input.valueAsNumber < 0) {
                    e = "This value must be 0 or greater.";
                }
                Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, e);
                return e.length === 0;
            }
            ValidateMoney() {
                let e = "";
                let input = this.input_element;
                if (input.value.length === 0) {
                    e = "You must enter a number. (No commas or $ allowed).";
                }
                if (input.valueAsNumber === NaN && e.length === 0) {
                    e = "Please enter Numbers and Decimal points only.";
                }
                if (input.valueAsNumber < 0 && e.length === 0) {
                    e = "Negative numbers are not allowed.";
                }
                let i = input.value.split(".");
                if (i.length === 2 && e.length === 0) {
                    if (i[1].length > 2) {
                        e = "Too many digits after the decimal place. Amounts are limited to 2 digits after the decimal place.";
                    }
                }
                Transaction.ControlGroup.UpdateInputError(this.input_element, this.container_element, e);
                return e.length === 0;
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map