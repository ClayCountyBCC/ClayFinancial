namespace Transaction
{
  interface IControlGroup
  {

  }

  export class ControlGroup implements IControlGroup
  {
    public percent_used: number = 0;
    public controls: Array<Control> = [];

    constructor()
    {
    }

    public static CreateControlGroups(controls: Array<Control>): Array<ControlGroup>
    {
      let controlgroups: Array<ControlGroup> = [];

      let controlGroup = new ControlGroup();
      for (let control of controls)
      {
        control.rendered_input_element = Control.CreateControl(control);
        controlGroup.controls.push(control);
      }
      controlgroups.push(controlGroup);
      return controlgroups;
    }

    public static CreateInputFieldContainerByControl(control: Control, input: HTMLElement, add_column: boolean = false, class_to_add: string = ""): HTMLElement
    {
      return this.CreateInputFieldContainer(input, control.label, add_column, control.render_hints);
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
      let control_element = document.createElement("div");
      control_element.classList.add("control");
      control_element.appendChild(input);
      field.appendChild(control_element);
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

    public static CreateButtonlistFieldContainer(inputs: Array<HTMLElement>, field_label: string, add_column: boolean = false, class_to_add: string = ""): HTMLElement
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
      let buttonlist = document.createElement("div");
      buttonlist.classList.add("buttons");
      for (let input of inputs)
      {
        buttonlist.appendChild(input);

      }
      control.appendChild(buttonlist);
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

    public static CreateSelectFieldContainerByControl(control: Control, select: HTMLSelectElement, add_column: boolean = false): HTMLElement
    {
      return this.CreateSelectFieldContainer(select, control.label, add_column, control.render_hints);
    }

    public static CreateSelectFieldContainer(select: HTMLSelectElement, field_label: string, add_column: boolean = false, class_to_add: string = ""): HTMLElement
    {
      let field = document.createElement("div");
      field.classList.add("field");
      if (add_column)
      {
        field.classList.add("column");
        if (class_to_add.length > 0) field.classList.add(class_to_add);
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
      return field;
    }

    public static GetPercent(render_hints: string): number
    {
      if (render_hints.includes("short"))
      {
        return 33;
      }
      if (render_hints.includes("medium"))
      {
        return 50;
      }
      return 100;
      //if (render_hints.includes("long"))
      //{
        
      //}
    }

    public CreateControlData(target_container: HTMLElement): Array<Data.ControlData>
    {
      let control_data: Array<Data.ControlData> = [];

      let group_element: HTMLElement = document.createElement("div");
      group_element.classList.add("columns", "is-multiline");
      target_container.appendChild(group_element);

      for (let control of this.controls)
      {
        let cd = new Data.ControlData(control, -1);
        control_data.push(cd);
        group_element.appendChild(cd.container_element);
      }
      return control_data;
    }

    public static CreateInput(input_type: string, input_length: number, is_required: boolean, placeholder: string): HTMLInputElement
    {
      let input = document.createElement("input");
      input.type = input_type;
      input.maxLength = input_length;
      input.classList.add("input", "is-medium");
      input.placeholder = placeholder;
      input.required = is_required;
      input.value = "";
      return input;
    }

  }


}