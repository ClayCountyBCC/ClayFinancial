var Transaction;
(function (Transaction) {
    class ControlGroup {
        constructor() {
            this.percent_used = 0;
            this.controls = [];
        }
        static CreateControlGroups(controls) {
            let controlgroups = [];
            let controlGroup = new ControlGroup();
            for (let control of controls) {
                control.rendered_input_element = Transaction.Control.CreateControl(control);
                controlGroup.controls.push(control);
            }
            controlgroups.push(controlGroup);
            return controlgroups;
        }
        static CreateInputFieldContainerByControl(control, input, add_column = false, class_to_add = "") {
            return this.CreateInputFieldContainer(input, control.label, add_column, control.render_hints);
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
            let control_element = document.createElement("div");
            control_element.classList.add("control");
            control_element.appendChild(input);
            field.appendChild(control_element);
            let error_element = document.createElement("p");
            error_element.classList.add("help", "is-danger");
            field.appendChild(error_element);
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
        static CreateButtonlistFieldContainer(inputs, field_label, add_column = false, class_to_add = "") {
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
            let buttonlist = document.createElement("div");
            buttonlist.classList.add("buttons");
            for (let input of inputs) {
                buttonlist.appendChild(input);
            }
            control.appendChild(buttonlist);
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
        static CreateSelectFieldContainerByControl(control, select, add_column = false) {
            return this.CreateSelectFieldContainer(select, control.label, add_column, control.render_hints);
        }
        static CreateSelectFieldContainer(select, field_label, add_column = false, class_to_add = "") {
            let field = document.createElement("div");
            field.classList.add("field");
            if (add_column) {
                field.classList.add("column");
                if (class_to_add.length > 0)
                    field.classList.add(class_to_add);
            }
            let label = document.createElement("label");
            label.classList.add("label", "is-medium");
            label.appendChild(document.createTextNode(field_label));
            field.appendChild(label);
            let control_element = document.createElement("div");
            control_element.classList.add("control");
            let selectContainer = document.createElement("div");
            selectContainer.classList.add("select", "is-medium");
            selectContainer.appendChild(select);
            control_element.appendChild(selectContainer);
            field.appendChild(control_element);
            let error_element = document.createElement("p");
            error_element.classList.add("help", "is-danger");
            field.appendChild(error_element);
            return field;
        }
        static GetPercent(render_hints) {
            if (render_hints.includes("short")) {
                return 33;
            }
            if (render_hints.includes("medium")) {
                return 50;
            }
            return 100;
            //if (render_hints.includes("long"))
            //{
            //}
        }
        CreateControlData(target_container) {
            let control_data = [];
            let group_element = document.createElement("div");
            group_element.classList.add("columns", "is-multiline");
            target_container.appendChild(group_element);
            for (let control of this.controls) {
                let cd = new Transaction.Data.ControlData(control, -1);
                control_data.push(cd);
                group_element.appendChild(cd.container_element);
            }
            return control_data;
        }
        static CreateInput(input_type, input_length, is_required, placeholder) {
            let input = document.createElement("input");
            input.type = input_type;
            input.maxLength = input_length;
            input.classList.add("input", "is-medium");
            if (input.type === "number") {
                input.step = "0.01";
                input.min = "0";
            }
            input.placeholder = placeholder;
            input.required = is_required;
            input.value = "";
            return input;
        }
        static UpdateSelectError(container, error_text = "") {
            let error_element = container.querySelector("p.help");
            let select_element = container.querySelector("div.select");
            if (error_text.length === 0) {
                Utilities.Clear_Element(error_element);
                select_element.classList.remove("is-danger");
            }
            else {
                Utilities.Simple_Error_Show(error_element, error_text);
                select_element.classList.add("is-danger");
            }
        }
        static UpdateInputError(input, container, error_text = "") {
            let error_element = container.querySelector("p.help");
            if (error_text.length === 0) {
                Utilities.Clear_Element(error_element);
                input.classList.remove("is-danger");
            }
            else {
                Utilities.Simple_Error_Show(error_element, error_text);
                input.classList.add("is-danger");
            }
        }
    }
    Transaction.ControlGroup = ControlGroup;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlGroup.js.map