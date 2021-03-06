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
                if (control.is_active) {
                    control.rendered_input_element = Transaction.Control.CreateControl(control);
                    controlGroup.controls.push(control);
                }
            }
            controlgroups.push(controlGroup);
            return controlgroups;
        }
        static CreateSavedControlGroups(controls) {
            let controlgroups = [];
            let controlGroup = new ControlGroup();
            for (let controldata of controls) {
                controldata.control.rendered_input_element = Transaction.Control.CreateSavedControl(controldata);
                controlGroup.controls.push(controldata.control);
            }
            controlgroups.push(controlGroup);
            return controlgroups;
        }
        static CreateInputFieldContainerByControl(control, input, add_column = false, class_to_add = "") {
            return this.CreateInputFieldContainer(input, control.label, add_column, control.render_hints);
        }
        static CreateInputFieldContainer(input, field_label, add_column = false, class_to_add = "", guide_message_capable = false) {
            let editFunction = null;
            if (input.getAttribute("transaction_id") !== null) {
                // payment_method_data_id
                // department id?
                let transaction_id = input.getAttribute("transaction_id");
                let control_data_id = input.getAttribute("control_data_id");
                if (control_data_id !== null) {
                    editFunction = () => {
                        Transaction.LoadControlDataChange(control_data_id, transaction_id, field_label);
                    };
                }
                else {
                    let payment_method_data_id = input.getAttribute("payment_method_data_id");
                    let is_cash = input.getAttribute("is_cash").toLowerCase() === "true";
                    editFunction = () => {
                        Transaction.LoadPaymentTypeDataChange(payment_method_data_id, is_cash, transaction_id, field_label);
                    };
                }
            }
            if (editFunction !== null) {
                input.onclick = () => {
                    editFunction();
                };
            }
            let field = document.createElement("div");
            field.classList.add("field");
            let label = document.createElement("label");
            label.classList.add("label", Transaction.app_input_size);
            if (field_label.length > 0) {
                label.appendChild(document.createTextNode(field_label));
            }
            else {
                label.innerHTML = "&nbsp;";
            }
            field.appendChild(label);
            if (input.getAttribute("transaction_id") !== null) {
                let edit = document.createElement("a");
                edit.style.marginLeft = ".5em";
                edit.style.fontSize = ".75em";
                edit.style.fontWeight = "400";
                edit.onclick = () => { editFunction(); };
                edit.appendChild(document.createTextNode("edit"));
                label.appendChild(edit);
            }
            let control_element = document.createElement("div");
            control_element.classList.add("control");
            control_element.appendChild(input);
            field.appendChild(control_element);
            if (guide_message_capable) {
                let guide_element = document.createElement("p");
                guide_element.classList.add("help", "guide");
                field.appendChild(guide_element);
            }
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
            label.classList.add("label", Transaction.app_input_size);
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
            label.classList.add("label", "is-normal");
            label.appendChild(document.createTextNode(field_label));
            field.appendChild(label);
            if (select.getAttribute("transaction_id") !== null) {
                let edit = document.createElement("a");
                edit.style.marginLeft = ".5em";
                edit.style.fontSize = ".75em";
                edit.style.fontWeight = "400";
                let transaction_id = select.getAttribute("transaction_id");
                let control_data_id = select.getAttribute("control_data_id");
                edit.onclick = () => { Transaction.LoadControlDataChange(control_data_id, transaction_id, field_label); };
                edit.appendChild(document.createTextNode("edit"));
                label.appendChild(edit);
            }
            let control_element = document.createElement("div");
            control_element.classList.add("control");
            let selectContainer = document.createElement("div");
            selectContainer.classList.add("select", "is-normal");
            selectContainer.appendChild(select);
            control_element.appendChild(selectContainer);
            field.appendChild(control_element);
            let error_element = document.createElement("p");
            error_element.classList.add("help", "is-danger");
            field.appendChild(error_element);
            return field;
        }
        CreateControlData(target_container, clone_node = true) {
            let control_data = [];
            let group_element = document.createElement("div");
            group_element.classList.add("columns", "is-multiline");
            target_container.appendChild(group_element);
            for (let control of this.controls) {
                let cd = new Transaction.Data.ControlData(control, -1, clone_node);
                control_data.push(cd);
                group_element.appendChild(cd.container_element);
            }
            return control_data;
        }
        static CreateInput(input_type, input_length, is_required, placeholder, input_value = "") {
            let input = document.createElement("input");
            input.type = input_type;
            input.maxLength = input_length;
            input.classList.add("input", "is-normal");
            if (input.type === "number") {
                input.onwheel = (e) => { e.preventDefault(); };
                input.step = "0.01";
                input.min = "0";
            }
            input.placeholder = placeholder;
            input.required = is_required;
            input.value = input_value;
            return input;
        }
        static UpdateSelectError(container, error_text = "") {
            let error_element = container.querySelector("p.help.is-danger");
            let select_element = container.querySelector("div.select");
            if (error_text.length === 0) {
                Utilities.Clear_Element(error_element);
                select_element.classList.remove("is-danger");
            }
            else {
                Utilities.Simple_Error_Show(error_element, error_text);
                select_element.classList.add("is-danger");
                if (!Transaction.error_scrolled) {
                    Transaction.error_scrolled = true;
                    container.scrollIntoView(true);
                }
            }
        }
        static UpdateInputError(input, container, error_text = "") {
            let error_element = container.querySelector("p.help.is-danger");
            if (error_text.length === 0) {
                Utilities.Clear_Element(error_element);
                input.classList.remove("is-danger");
            }
            else {
                Utilities.Simple_Error_Show(error_element, error_text);
                input.classList.add("is-danger");
                if (!Transaction.error_scrolled) {
                    Transaction.error_scrolled = true;
                    container.scrollIntoView(true);
                }
            }
        }
        static UpdateInputGuide(container, guide_text = "") {
            let guide_element = container.querySelector("p.help.guide");
            if (guide_element === null) {
                console.log('UpdateInputGuide called, no guide elements found', container, guide_text);
                return;
            }
            Utilities.Set_Text(guide_element, guide_text);
        }
        static ValidateDropdown(input, container, valid_values) {
            let e = "";
            if (input.value === "-1") {
                e = "You must choose one of these options.";
            }
            if (valid_values.indexOf(input.value) === -1 && e.length === 0) {
                e = "Please select a valid value.";
            }
            ControlGroup.UpdateSelectError(container, e);
            return e.length === 0;
        }
        static ValidateDate(input, container) {
            let e = "";
            //let input = <HTMLInputElement>this.input_element;
            if (input.valueAsDate === null && input.required) {
                e = "You must selected a date.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateText(input, container) {
            let e = "";
            if (input.required && input.value.length === 0) {
                e = "This field is required.";
            }
            if (input.maxLength > 0 && input.value.length > input.maxLength && e.length === 0) {
                e = "You entered " + input.value.length.toString() + " characters but " + input.maxLength.toString() + " is the maximum number of characters allowed.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateNumber(input, container) {
            let e = "";
            if (input.value.length === 0) {
                e = "You must enter a number. (No commas or $ allowed).";
            }
            if (input.valueAsNumber === NaN && e.length === 0) {
                e = "Please enter Numbers and Decimal points only.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateCount(input, container) {
            let e = "";
            if (input.value.length === 0 && input.required) {
                e = "You must enter a number. (No commas, decimal points, or $ allowed).";
            }
            if (input.valueAsNumber === NaN && e.length === 0) {
                e = "Please enter Numbers only.";
            }
            if (input.valueAsNumber < 0) {
                e = "This value must be 0 or greater.";
            }
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
        static ValidateMoney(input, container) {
            let e = "";
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
            ControlGroup.UpdateInputError(input, container, e);
            return e.length === 0;
        }
    }
    Transaction.ControlGroup = ControlGroup;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=ControlGroup.js.map