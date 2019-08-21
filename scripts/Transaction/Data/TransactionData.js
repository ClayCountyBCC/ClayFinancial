var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class TransactionData {
            constructor() {
                this.transaction_id = -1;
                this.fiscal_year = -1;
                this.created_by_employee_id = -1;
                this.employee_transaction_count = -1;
                this.transaction_number = "";
                this.parent_transaction_id = -1;
                this.department_id = -1;
                this.department_control_data = [];
                this.payment_type_data = [];
                this.error_text = "";
                this.received_from = "";
                this.created_on = new Date();
                this.created_by_username = "";
                this.created_by_ip_address = "";
                // client side only stuff
                this.base_container = 'root';
                this.department_element = null;
                this.department_element_container = null;
                this.received_from_element = null;
                this.received_from_element_container = null;
                this.department_controls_target = 'department_controls_container';
                this.payment_type_target = 'payment_type_container';
                this.selected_department = null;
                this.next_payment_type_index = 0;
                let targetContainer = document.getElementById(this.base_container);
                Utilities.Clear_Element(targetContainer);
                this.CreateReceiptTitle(targetContainer);
                let control_container = document.createElement("div");
                control_container.id = "transaction_controls";
                control_container.classList.add("columns");
                targetContainer.appendChild(control_container);
                this.department_element = Transaction.DepartmentControl.cloneNode(true);
                this.RenderDepartmentSelection(control_container);
                this.RenderReceivedFromInput(control_container);
            }
            CreateReceiptTitle(target) {
                let title = document.createElement("h2");
                title.classList.add("title", "has-text-centered");
                title.appendChild(document.createTextNode("Create a New Receipt"));
                target.appendChild(title);
            }
            RenderDepartmentSelection(target) {
                this.department_element.onchange = (event) => {
                    this.department_id = parseInt(event.target.value);
                    this.selected_department = Transaction.Department.FindDepartment(this.department_id);
                    this.RenderDepartmentControls();
                    this.RenderPaymentTypes();
                };
                this.department_element_container = Transaction.Department.CreateDepartmentElementField(this.department_element);
                target.appendChild(this.department_element_container);
            }
            RenderDepartmentControls() {
                this.department_control_data = [];
                let departmentControlContainer = document.getElementById(this.department_controls_target);
                if (departmentControlContainer === null) {
                    departmentControlContainer = document.createElement("div");
                    departmentControlContainer.id = this.department_controls_target;
                    document.getElementById(this.base_container).appendChild(departmentControlContainer);
                }
                Utilities.Clear_Element(departmentControlContainer);
                if (this.department_id === -1 ||
                    this.selected_department === null ||
                    this.selected_department.controls.length === 0)
                    return;
                for (let group of this.selected_department.control_groups) {
                    this.department_control_data.push(...group.CreateControlData(departmentControlContainer));
                }
            }
            RenderPaymentTypes() {
                this.payment_type_data = [];
                let paymentTypeContainer = document.getElementById(this.payment_type_target);
                // if we can't find it, create it.
                if (paymentTypeContainer === null) {
                    paymentTypeContainer = document.createElement("div");
                    paymentTypeContainer.id = this.payment_type_target;
                    document.getElementById(this.base_container).appendChild(paymentTypeContainer);
                }
                Utilities.Clear_Element(paymentTypeContainer);
                if (this.department_id === -1 || this.selected_department === null)
                    return;
                let ol = document.createElement("ol");
                ol.classList.add("payment_type");
                for (let pt of this.selected_department.payment_types) {
                    let li = document.createElement("li");
                    li.classList.add("light-function", "is-size-3", "has-background-link");
                    li.style.cursor = "pointer";
                    li.setAttribute("payment_type_id", pt.payment_type_id.toString());
                    let name = document.createElement("span");
                    name.classList.add("name");
                    name.appendChild(document.createTextNode(pt.name));
                    li.appendChild(name);
                    let totals = document.createElement("span");
                    totals.classList.add("totals");
                    li.appendChild(totals);
                    ol.appendChild(li);
                    let controls_container = document.createElement("ol");
                    controls_container.classList.add("control_container", "hide");
                    ol.appendChild(controls_container);
                    li.onclick = (event) => {
                        if (controls_container.childElementCount === 0) // there is no payment type data created yet.
                         {
                            this.AddPaymentType(pt, controls_container);
                            controls_container.classList.remove("hide");
                        }
                        //controls_container.classList.toggle("hide");
                        //if (!controls_container.classList.contains("hide"))
                        //{
                        //}
                        console.log('this transaction', this);
                    };
                }
                paymentTypeContainer.appendChild(ol);
            }
            RenderReceivedFromInput(target_container) {
                this.received_from_element = Transaction.ControlGroup.CreateInput("text", 500, true, "Received From");
                this.received_from_element.oninput = (event) => {
                    let e = event.target;
                    e.value = e.value.trim();
                    this.received_from = e.value;
                    this.IsValid();
                };
                this.received_from_element_container = Transaction.ControlGroup.CreateInputFieldContainer(this.received_from_element, "Received From or N/A", true, "is-one-half");
                target_container.appendChild(this.received_from_element_container);
            }
            AddPaymentType(payment_type, container) {
                let ptd = new Data.PaymentTypeData(payment_type, container, this.next_payment_type_index++);
                this.payment_type_data.push(ptd);
                ptd.add_another_payment_type_button.onclick = (event) => {
                    this.AddPaymentType(payment_type, container);
                };
                ptd.cancel_payment_type_button.onclick = (event) => {
                    container.removeChild(ptd.payment_type_container);
                    let indextoremove = this.payment_type_data.findIndex((j) => { return j.payment_type_index === ptd.payment_type_index; });
                    if (indextoremove > -1)
                        this.payment_type_data.splice(indextoremove, 1);
                    ptd = null;
                    if (container.childElementCount === 0)
                        container.classList.add("hide");
                };
                ptd.save_button.onclick = (event) => {
                    let button = event.target;
                    Utilities.Toggle_Loading_Button(button, true);
                    if (this.ValidateTransaction()) {
                        Transaction.currentReceipt.ShowReceiptPreview();
                    }
                    else {
                        Utilities.Toggle_Loading_Button(button, false);
                    }
                };
            }
            ValidateTransaction() {
                let is_valid = true;
                is_valid = this.IsValid();
                for (let ct of this.department_control_data) {
                    let v = ct.Validate();
                    if (!v && is_valid)
                        is_valid = false;
                }
                for (let pt of this.payment_type_data) {
                    let v = pt.Validate();
                    if (!v && is_valid)
                        is_valid = false;
                }
                return is_valid;
            }
            IsValid() {
                this.ResetErrorElements();
                let is_valid = true;
                if (this.department_id === -1) {
                    Transaction.ControlGroup.UpdateSelectError(this.department_element_container, "Invalid Department Selected");
                    is_valid = false;
                }
                if (this.received_from.length === 0) {
                    Transaction.ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "This field is required.");
                    is_valid = false;
                }
                return is_valid;
            }
            ResetErrorElements() {
                Transaction.ControlGroup.UpdateSelectError(this.department_element_container, "");
                Transaction.ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "");
            }
            SaveTransactionData() {
                // first let's reorder all of the payment_type_index fields
                // by reorder I mean make them representative
                // of the actual index that element is in the array.
                let t = this;
                let path = Transaction.GetPath();
                Utilities.Post(path + "API/Transaction/Save", t)
                    .then(function (response) {
                    console.log("post probably good", response);
                }, function (error) {
                    console.log("post error occurred", error);
                });
            }
        }
        Data.TransactionData = TransactionData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=TransactionData.js.map