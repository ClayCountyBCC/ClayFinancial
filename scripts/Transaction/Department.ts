namespace Transaction
{
  interface IDepartment
  {

    department_id: number;
    name: string;
    is_active: boolean;
    organization: string;
    payment_types: Array<PaymentType>;
    controls: Array<Control>;
    controls_dict: object;
    payment_types_dict: object;
  }

  export class Department implements IDepartment
  {
    public department_id: number;
    public name: string;
    public is_active: boolean;
    public organization: string = "";
    public payment_types: Array<PaymentType> = [];
    public controls: Array<Control> = [];
    public controls_dict: object;
    public payment_types_dict: object;
    public control_groups: Array<ControlGroup> = [];

    Constructor() { }

    public static GetDepartments(): Promise<Array<Department>>
    {
      let path = Transaction.GetPath();
      return Utilities.Get<Array<Department>>(path + "API/Transaction/Departments");
    }

    public static CreateDepartmentElement(departments: Array<Department>): HTMLSelectElement
    {
      let select = document.createElement("select"); 
      let defaultOption = document.createElement("option");
      defaultOption.selected = true;
      defaultOption.value = "-1";
      defaultOption.appendChild(document.createTextNode("Select a Department"));
      select.appendChild(defaultOption);
      for (let d of departments)
      {
        let option = document.createElement("option");
        option.appendChild(document.createTextNode(d.name));
        option.value = d.department_id.toString();
        select.appendChild(option);
      }
      select.selectedIndex = -1;
      return select;

    }

    public static CreateDepartmentElementLevel(department: HTMLSelectElement): HTMLElement
    {
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

    public static CreateDepartmentElementField(department: HTMLSelectElement): HTMLElement
    {
      return ControlGroup.CreateSelectFieldContainer(department, "Department", true, "is-one-half");
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

    public static FindDepartment(department_id: number): Department
    {
      let filtered = Transaction.departments.filter((d) => d.department_id === department_id);
      return (filtered.length === 1) ? filtered[0] : null;
    }

    

  }


}