var Transaction;
(function (Transaction) {
    class Control {
        constructor() {
            this.rendered_input_element = null;
            this.valid_values = [];
        }
        Constructor() { }
        static CreateControl(control) {
            switch (control.data_type) {
                case "date":
                case "text":
                    return Control.CreateInput(control);
                case "bigtext":
                    return Control.CreateTextArea(control);
                case "dropdown":
                    return Control.CreateSelect(control);
            }
            return null;
        }
        static CreateInput(control) {
            let input = document.createElement("input");
            input.type = control.data_type;
            input.maxLength = control.max_length;
            input.classList.add("input", "is-medium");
            input.placeholder = control.label;
            input.required = control.required;
            input.value = "";
            input.setAttribute("control_id", control.control_id.toString());
            return input;
        }
        static CreateTextArea(control) {
            let textarea = document.createElement("textarea");
            textarea.maxLength = control.max_length;
            textarea.classList.add("textarea", "is-medium");
            textarea.placeholder = control.label;
            textarea.required = control.required;
            textarea.rows = 4;
            textarea.value = "";
            textarea.setAttribute("control_id", control.control_id.toString());
            return textarea;
        }
        static CreateSelect(control) {
            control.valid_values = control.value.split("|");
            let select = document.createElement("select");
            select.required = control.required;
            select.appendChild(Utilities.Create_Option("-1", "Select a " + control.label, true));
            for (let value of control.valid_values) {
                select.appendChild(Utilities.Create_Option(value, value, false));
            }
            return select;
        }
    }
    Transaction.Control = Control;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Control.js.map