var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class TransactionData {
            constructor() {
                this.transaction_id = -1;
                this.department_id = null;
                this.department_control_data = [];
                this.payment_types = [];
                this.base_container = 'root';
                this.department_element = null;
                this.department_controls_target = 'department_controls_container';
                this.payment_type_target = 'payment_type_container';
                this.selected_department = null;
                this.next_payment_type_id = 0;
                this.error_text = "";
                this.received_from = "";
                let targetContainer = document.getElementById(this.base_container);
                Utilities.Clear_Element(targetContainer);
                this.CreateReceiptTitle(targetContainer);
                this.department_element = Transaction.DepartmentControl.cloneNode(true);
                this.RenderDepartmentSelection(targetContainer);
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
                target.appendChild(Transaction.Department.CreateDepartmentElementField(this.department_element));
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
                this.payment_types = [];
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
                        controls_container.classList.toggle("hide");
                        if (!controls_container.classList.contains("hide")) {
                            if (controls_container.childElementCount === 0) // there is no payment type data created yet.
                             {
                                this.AddPaymentType(pt, controls_container);
                            }
                        }
                        console.log('this transaction', this);
                    };
                }
                paymentTypeContainer.appendChild(ol);
            }
            AddPaymentType(payment_type, container) {
                let ptd = new Data.PaymentTypeData(payment_type, container, this.next_payment_type_id++);
                this.payment_types.push(ptd);
                ptd.add_another_payment_type_button.onclick = (event) => {
                    this.AddPaymentType(payment_type, container);
                };
                ptd.cancel_payment_type_button.onclick = (event) => {
                    container.removeChild(ptd.payment_type_container);
                    let indextoremove = this.payment_types.findIndex((j) => { return j.payment_type_index === ptd.payment_type_index; });
                    if (indextoremove > -1)
                        this.payment_types.splice(indextoremove, 1);
                    ptd = null;
                    if (container.childElementCount === 0)
                        container.classList.add("hide");
                };
                ptd.ready_to_save_button.onclick = (event) => {
                    this.ValidateTransaction();
                };
            }
            ValidateTransaction() {
                return false;
            }
        }
        Data.TransactionData = TransactionData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=TransactionData.js.map