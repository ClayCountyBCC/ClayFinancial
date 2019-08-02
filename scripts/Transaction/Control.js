var Transaction;
(function (Transaction) {
    class Control {
        Constructor() { }
        static CreateControl(control) {
            switch (control.data_type) {
                case "date":
                case "text":
                    return Control.CreateInput(control);
                case "bigtext":
                    return Control.CreateTextArea(control);
                case "dropdown":
                    return null;
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
        static CreateInputFieldContainer(input, field_label, add_column = false, class_to_add = "") {
            let field = document.createElement("div");
            field.classList.add("field");
            let label = document.createElement("label");
            label.classList.add("label", "is-medium");
            if (field_label.length > 0) {
                label.appendChild(document.createTextNode(field_label));
            }
            else {
                label.innerHTML = "&nbsp;";
            }
            field.appendChild(label);
            let control = document.createElement("div");
            control.classList.add("control");
            control.appendChild(input);
            field.appendChild(control);
            if (add_column) {
                let column = document.createElement("div");
                column.classList.add("column");
                if (class_to_add.length > 0)
                    column.classList.add(class_to_add);
                column.appendChild(field);
                return column;
            }
            if (class_to_add.length > 0)
                field.classList.add(class_to_add);
            return field;
        }
        static CreateSelectFieldContainer(select, field_label) {
            let field = document.createElement("div");
            field.classList.add("field");
            let label = document.createElement("label");
            label.classList.add("label", "is-medium");
            label.appendChild(document.createTextNode(field_label));
            field.appendChild(label);
            let control = document.createElement("div");
            control.classList.add("control");
            let selectContainer = document.createElement("div");
            selectContainer.classList.add("select", "is-medium");
            selectContainer.appendChild(select);
            control.appendChild(selectContainer);
            field.appendChild(control);
            return field;
        }
        static CreateSelect(controls) {
            let select = document.createElement("select");
            for (let control of controls) {
                let option = document.createElement("option");
                option.appendChild(document.createTextNode(control.label));
                option.value = control.value;
                select.appendChild(option);
            }
            select.selectedIndex = -1;
            return select;
        }
    }
    Transaction.Control = Control;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Control.js.map