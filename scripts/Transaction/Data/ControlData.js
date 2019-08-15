var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class ControlData {
            constructor(control, payment_type_id) {
                this.control_data_id = -1;
                this.prior_control_data_id = -1;
                this.control_id = -1;
                this.department_id = -1;
                this.payment_type_id = -1;
                this.payment_type_index = -1;
                this.value = "";
                this.control = null;
                this.input_element = null;
                this.container_element = null;
                this.is_active = true;
                this.modified_by = "";
                this.error_text = "";
                this.control = control;
                this.control_id = control.control_id;
                this.input_element = control.rendered_input_element.cloneNode(true);
                this.payment_type_id = payment_type_id;
                this.input_element.oninput = (event) => {
                    this.value = event.target.value;
                };
                if (control.data_type === "dropdown") {
                    this.container_element = Transaction.ControlGroup.CreateSelectFieldContainerByControl(control, this.input_element, true);
                }
                else {
                    this.container_element = Transaction.ControlGroup.CreateInputFieldContainerByControl(control, this.input_element, true);
                }
            }
        }
        Data.ControlData = ControlData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlData.js.map