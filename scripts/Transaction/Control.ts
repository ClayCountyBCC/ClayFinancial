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
    public rendered_input_element: HTMLElement = null;
    public valid_values: Array<string> = [];

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
          return Control.CreateSelect(control);
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

    public static CreateSelect(control: Control):HTMLSelectElement
    {
      control.valid_values = control.value.split("|");

      let select = document.createElement("select");
      select.required = control.required;
      select.appendChild(Utilities.Create_Option("-1", "Select a " + control.label, true));
      for (let value of control.valid_values)
      {
        select.appendChild(Utilities.Create_Option(value, value, false));
      }      
      return select;
    }


  }


}