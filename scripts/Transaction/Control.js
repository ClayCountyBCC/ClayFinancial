var Transaction;
(function (Transaction) {
    class Control {
        constructor() {
            this.rendered_input_element = null;
            this.valid_values = [];
        }
        Constructor() { }
        static CreateControl(control, value = null) {
            switch (control.data_type) {
                case "date":
                case "text":
                    return Control.CreateInput(control, value);
                case "number":
                case "money":
                case "count":
                    return Control.CreateNumericInput(control, value);
                case "bigtext":
                    return Control.CreateTextArea(control, value);
                case "dropdown":
                    return Control.CreateSelect(control, value);
            }
            return null;
        }
        static CreateSavedControl(control_data) {
            let control = Control.CreateControl(control_data.control, control_data.value);
            control.disabled = true;
            control.setAttribute("control_data_id", control_data.control_data_id.toString());
            control.setAttribute("transaction_id", control_data.transaction_id.toString());
            return control;
        }
        static CreateInput(control, value) {
            let input = document.createElement("input");
            input.type = control.data_type;
            input.maxLength = control.max_length;
            input.classList.add("input", "is-medium");
            input.placeholder = control.label;
            input.required = control.required;
            if (input.type === "date" && value !== null) {
                let tmp = value.split("/");
                if (tmp.length === 3) {
                    let v = tmp[2] + '-';
                    v += tmp[0].length === 1 ? "0" + tmp[0] : tmp[0];
                    v += "-";
                    v += tmp[1].length === 1 ? "0" + tmp[1] : tmp[1];
                    input.value = v;
                }
                else {
                    input.value = value; // dates need to be in yyyy-mm-dd format
                }
            }
            else {
                input.value = value === null ? "" : value;
            }
            input.setAttribute("control_id", control.control_id.toString());
            return input;
        }
        static CreateNumericInput(control, value) {
            let input = document.createElement("input");
            input.type = "number";
            input.maxLength = control.max_length;
            input.classList.add("input", "is-medium");
            input.placeholder = "0";
            input.required = control.required;
            if (control.data_type === "count") {
                input.step = "1";
                input.min = "0";
                input.pattern = "[0-9]";
            }
            else {
                input.step = "any";
            }
            input.value = value === null ? "" : value;
            input.setAttribute("control_id", control.control_id.toString());
            return input;
        }
        static CreateTextArea(control, value) {
            let textarea = document.createElement("textarea");
            textarea.maxLength = control.max_length;
            textarea.classList.add("textarea", "is-medium");
            textarea.placeholder = control.label;
            textarea.required = control.required;
            textarea.rows = 4;
            textarea.value = value === null ? "" : value;
            textarea.setAttribute("control_id", control.control_id.toString());
            return textarea;
        }
        static CreateSelect(control, value) {
            control.valid_values = control.value.split("|");
            let select = document.createElement("select");
            select.required = control.required;
            select.appendChild(Utilities.Create_Option("-1", "Select a " + control.label, false));
            for (let valid_value of control.valid_values) {
                let option = Utilities.Create_Option(valid_value, valid_value, false);
                select.appendChild(option);
            }
            if (value !== null) {
                select.value = value;
            }
            else {
                select.value = "-1";
            }
            return select;
        }
    }
    Transaction.Control = Control;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Control.js.map