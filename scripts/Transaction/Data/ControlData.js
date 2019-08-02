var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class ControlData {
            constructor(control, payment_type_id, hints) {
                this.control_data_id = -1;
                this.prior_control_data_id = -1;
                this.control_id = -1;
                this.department_id = -1;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.value = "";
                this.control = null;
                this.input_element = null;
                this.single_element = null;
                this.group_element = null;
                this.is_active = true;
                this.modified_by = "";
                this.control_id = control.control_id;
                this.input_element = Transaction.Control.CreateControl(control);
                this.payment_type_id = payment_type_id;
                this.input_element.oninput = (event) => {
                    this.value = event.target.value;
                };
                if (hints.indexOf("short") !== -1 || hints.indexOf("medium") !== -1) {
                    this.group_element = Transaction.Control.CreateInputFieldContainer(this.input_element, control.label, true, hints.indexOf("short") !== -1 ? "is-one-third" : "is-half");
                }
                else {
                    this.single_element = Transaction.Control.CreateInputFieldContainer(this.input_element, control.label);
                }
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map