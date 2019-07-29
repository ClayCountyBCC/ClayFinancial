var Transaction;
(function (Transaction) {
    var Data;
    (function (Data) {
        class TransactionData {
            constructor() {
                this.transaction_id = -1;
                this.department_id = null;
                this.department_controls = [];
                this.payment_types = [];
                this.base_container = 'root';
                this.department_element = null;
                this.payment_type_target = 'payment_type_container';
                let targetContainer = document.getElementById(this.base_container);
                Utilities.Clear_Element(targetContainer);
                this.CreateReceiptTitle(targetContainer);
                this.department_element = Transaction.DepartmentControl.cloneNode(true);
                this.RenderDepartmentSelection(targetContainer);
                this.department_controls = [];
            }
            CreateReceiptTitle(target) {
                let title = document.createElement("h1");
                title.classList.add("title", "has-text-centered");
                title.appendChild(document.createTextNode("Create a New Receipt"));
                target.appendChild(title);
            }
            RenderDepartmentSelection(target) {
                this.department_element.onchange = (event) => {
                    this.department_id = parseInt(event.target.value);
                    this.RenderDepartmentControls();
                    this.RenderPaymentTypes();
                };
                target.appendChild(Transaction.Department.CreateDepartmentElementField(this.department_element));
            }
            RenderDepartmentControls() {
            }
            RenderPaymentTypes() {
                this.payment_types = [];
                console.log('Render Payment Types this', this);
                let paymentTypeContainer = document.getElementById(this.payment_type_target);
                // if we can't find it, create it.
                if (paymentTypeContainer === null) {
                    paymentTypeContainer = document.createElement("div");
                    paymentTypeContainer.id = this.payment_type_target;
                    document.getElementById(this.base_container).appendChild(paymentTypeContainer);
                }
                Utilities.Clear_Element(paymentTypeContainer);
                if (this.department_id === -1)
                    return;
                let department = Transaction.Department.FindDepartment(this.department_id);
                let ol = document.createElement("ol");
                ol.classList.add("payment_type");
                //ol.style.width = "100%";
                //ol.style.textDecoration = "none";      
                for (let pt of department.payment_types) {
                    let li = document.createElement("li");
                    li.classList.add("light-function", "is-size-3", "has-background-link");
                    li.style.cursor = "pointer";
                    //li.style.marginTop = ".25em";
                    //li.style.marginBottom = ".25em";
                    //li.style.paddingTop = ".25em";
                    //li.style.paddingBottom = ".25em";
                    let name = document.createElement("span");
                    //name.style.paddingLeft = "1em";
                    name.appendChild(document.createTextNode(pt.name));
                    li.appendChild(name);
                    ol.appendChild(li);
                    let controls = document.createElement("ol");
                    controls.classList.add("control", "hide");
                    //let testli = document.createElement("li");
                    //testli.appendChild(document.createTextNode("Donkey Juice!"));
                    //test.appendChild(testli);
                    ol.appendChild(controls);
                    li.onclick = (event) => {
                        controls.classList.toggle("hide");
                        if (!controls.classList.contains("hide")) {
                            let li = document.createElement("li");
                            li.appendChild(document.createTextNode(controls.childElementCount.toString()));
                            controls.appendChild(li);
                        }
                    };
                }
                paymentTypeContainer.appendChild(ol);
            }
        }
        Data.TransactionData = TransactionData;
    })(Data = Transaction.Data || (Transaction.Data = {}));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=TransactionData.js.map