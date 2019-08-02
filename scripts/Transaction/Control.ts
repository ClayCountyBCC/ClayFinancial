namespace Transaction
{

  interface IControl
  {
    department_id: number;
    department_sort_order: number;
    payment_type_id: number;
    payment_type_sort_order: number;
    control_id: number;
    label: string;
    value: string;
    group_by: string;
    data_type: string;
    is_active: boolean;
    required: boolean;
    max_length: number;
    validation_regex: string;
    render_hints: string;

  }
  export class Control implements IControl
  {
    public department_id: number;
    public department_sort_order: number;
    public payment_type_id: number;
    public payment_type_sort_order: number;
    public control_id: number;
    public label: string;
    public value: string;
    public group_by: string;
    public data_type: string;
    public is_active: boolean;
    public required: boolean;
    public max_length: number;
    public validation_regex: string;
    public render_hints: string;

    Constructor() { }


    public static CreateControl(control: Control): HTMLElement
    {
      switch (control.data_type)
      {
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

    private static CreateInput(control: Control):HTMLInputElement
    {
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

    private static CreateTextArea(control: Control)
    {
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

    public static CreateInputFieldContainer(input: HTMLElement, field_label: string, add_column: boolean = false, class_to_add: string = ""): HTMLElement
    {
      let field = document.createElement("div");
      field.classList.add("field");
      let label = document.createElement("label");
      label.classList.add("label", "is-medium");
      if (field_label.length > 0)
      {
        label.appendChild(document.createTextNode(field_label));
      }
      else
      {
        label.innerHTML = "&nbsp;";
      }

      field.appendChild(label);
      let control = document.createElement("div");
      control.classList.add("control");
      control.appendChild(input);
      field.appendChild(control);
      if (add_column)
      {
        let column = document.createElement("div");
        column.classList.add("column");
        if (class_to_add.length > 0) column.classList.add(class_to_add);
        column.appendChild(field);
        return column;
      }
      if (class_to_add.length > 0) field.classList.add(class_to_add);
      return field;
    }

    public static CreateSelectFieldContainer(select: HTMLSelectElement, field_label: string): HTMLElement
    {    
    
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


    public static CreateSelect(controls: Array<Control>):HTMLSelectElement
    {
      let select = document.createElement("select");
      for (let control of controls)
      {
        let option = document.createElement("option");
        option.appendChild(document.createTextNode(control.label));
        option.value = control.value;
        select.appendChild(option);
      }
      select.selectedIndex = -1;
      return select;
    }


  }


}