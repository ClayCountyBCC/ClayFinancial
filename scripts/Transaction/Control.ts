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

    public static CreateControl(control: Control, value: string = null): HTMLElement
    {
      switch (control.data_type)
      {
        case "date":          
        case "text":
          return Control.CreateInput(control, value);

        case "number":
        case "money":
        case "count":
          return Control.CreateNumericInput(control, value);
          
        case "bigtext":
          return Control.CreateTextArea(control, value);
          
        case "dropdown":
          return Control.CreateSelect(control, value);
      }
      return null;
    }

    public static CreateSavedControl(control_data: Data.ControlData): HTMLElement
    {
      let control = Control.CreateControl(control_data.control, control_data.value);
      if (control.tagName.toLowerCase() !== "select")
      {
        (<HTMLInputElement>control).readOnly = true;
      }
      else
      {
        (<HTMLInputElement>control).disabled = true;
      }
      
      control.setAttribute("control_data_id", control_data.control_data_id.toString());
      control.setAttribute("transaction_id", control_data.transaction_id.toString());
      return control;
    }

    private static CreateInput(control: Control, value: string):HTMLInputElement
    {
      let input = document.createElement("input");
      input.type = control.data_type;
      input.maxLength = control.max_length;
      input.classList.add("input", "is-medium");      
      input.placeholder = control.label;
      input.required = control.required;
      if (input.type === "date" && value !== null)
      {
        let tmp = value.split("/");
        if (tmp.length === 3)
        {
          let v = tmp[2] + '-';
          v += tmp[0].length === 1 ? "0" + tmp[0] : tmp[0];
          v += "-";
          v += tmp[1].length === 1 ? "0" + tmp[1] : tmp[1];
          input.value = v;
        }
        else
        {
          input.value = value;// dates need to be in yyyy-mm-dd format
        }
      }
      else
      {
        input.value = value === null ? "" : value;
      }
      
      input.setAttribute("control_id", control.control_id.toString());
      return input;
    }

    private static CreateNumericInput(control: Control, value: string): HTMLInputElement
    {
      let input = document.createElement("input");
      input.type = "number";
      input.maxLength = control.max_length;
      input.classList.add("input", "is-medium");
      input.placeholder = "0";
      input.required = control.required;
      if (control.data_type === "count")
      {
        input.step = "1";
        input.min = "0";
        input.pattern = "[0-9]";
      }
      else
      {
        input.step = "any";
      }
      
      input.value = value === null ? "" : value;
      input.setAttribute("control_id", control.control_id.toString());
      return input;
    }

    private static CreateTextArea(control: Control, value: string)
    {
      let textarea = document.createElement("textarea");      
      textarea.maxLength = control.max_length;
      textarea.classList.add("textarea", "is-medium");
      textarea.placeholder = control.label;
      textarea.required = control.required;
      textarea.rows = 4;      
      textarea.value = value === null ? "" : value;
      textarea.setAttribute("control_id", control.control_id.toString());
      return textarea;
    }

    public static CreateSelect(control: Control, value: string):HTMLSelectElement
    {
      control.valid_values = control.value.split("|");

      let select = document.createElement("select");
      select.required = control.required;
      select.appendChild(Utilities.Create_Option("-1", "Select a " + control.label, false));
      for (let valid_value of control.valid_values)
      {
        let option = Utilities.Create_Option(valid_value, valid_value, false);        
        select.appendChild(option);
      }
      if (value !== null)
      {
        select.value = value;
      }
      else
      {
        select.value = "-1";
      }
      return select;
    }


  }


}