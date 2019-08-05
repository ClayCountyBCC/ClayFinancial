var Transaction;
(function (Transaction) {
    class Department {
        constructor() {
            this.organization = "";
            this.payment_types = [];
            this.controls = [];
            this.payment_type_element = null;
            this.control_elements = [];
        }
        Constructor() { }
        static GetPath() {
            let path = "/";
            let i = window.location.pathname.toLowerCase().indexOf("/clayfinancial");
            if (i == 0) {
                path = "/clayfinancial/";
            }
            return path;
        }
        static GetDepartments() {
            let path = Department.GetPath();
            return Utilities.Get(path + "API/Transaction/Departments");
        }
        static CreateDepartmentElement(departments) {
            let select = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.value = "-1";
            defaultOption.appendChild(document.createTextNode("Select a Department"));
            select.appendChild(defaultOption);
            for (let d of departments) {
                let option = document.createElement("option");
                option.appendChild(document.createTextNode(d.name));
                option.value = d.department_id.toString();
                select.appendChild(option);
            }
            select.selectedIndex = -1;
            return select;
        }
        static CreateDepartmentElementLevel(department) {
            let level = document.createElement("div");
            level.classList.add("level");
            let left = document.createElement("div");
            left.classList.add("level-left");
            let outer = document.createElement("div");
            outer.classList.add("level-item", "has-text-centered");
            let inner = document.createElement("div");
            let heading = document.createElement("p");
            heading.classList.add("heading");
            heading.appendChild(document.createTextNode("Select Department"));
            let selectContainer = document.createElement("div");
            selectContainer.classList.add("select");
            selectContainer.appendChild(department);
            inner.appendChild(heading);
            inner.appendChild(selectContainer);
            outer.appendChild(inner);
            left.appendChild(outer);
            level.appendChild(left);
            return level;
        }
        static CreateDepartmentElementField(department) {
            return Transaction.Control.CreateSelectFieldContainer(department, "Department");
            //let field = document.createElement("div");
            //field.classList.add("field");
            //let label = document.createElement("label");
            //label.classList.add("label", "is-medium");
            //label.appendChild(document.createTextNode("Department"));
            //field.appendChild(label);
            //let control = document.createElement("div");
            //control.classList.add("control");
            //let selectContainer = document.createElement("div");
            //selectContainer.classList.add("select", "is-medium");
            //selectContainer.appendChild(department);
            //control.appendChild(selectContainer);
            //field.appendChild(control);
            //return field;
        }
        static FindDepartment(department_id) {
            let filtered = Transaction.departments.filter((d) => d.department_id === department_id);
            return (filtered.length === 1) ? filtered[0] : null;
        }
    }
    Transaction.Department = Department;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Department.js.map