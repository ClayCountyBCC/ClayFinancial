﻿namespace Transaction
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

    public static CreateInputFieldContainer(input: HTMLElement, field_label: string, add_column: boolean = false, class_to_add: string = "", guide_message_capable: boolean = false): HTMLElement
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

      if (guide_message_capable)
      {
        let guide_element = document.createElement("p");
        guide_element.classList.add("help", "guide");
        field.appendChild(guide_element);
      }

      let error_element = document.createElement("p");
      error_element.classList.add("help", "is-danger")
      field.appendChild(error_element);

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

      let error_element = document.createElement("p");
      error_element.classList.add("help", "is-danger")
      field.appendChild(error_element);
      return field;
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
      if (input.type === "number")
      {
        input.step = "0.01";
        input.min = "0";
      }
      input.placeholder = placeholder;
      input.required = is_required;
      input.value = "";
      return input;
    }

    public static UpdateSelectError(container: HTMLElement, error_text: string = ""):void
    {
      let error_element = <HTMLElement>container.querySelector("p.help.is-danger");
      let select_element = <HTMLElement>container.querySelector("div.select");
      if (error_text.length === 0)
      {
        Utilities.Clear_Element(error_element);
        select_element.classList.remove("is-danger");
      }
      else
      {
        Utilities.Simple_Error_Show(error_element, error_text);
        select_element.classList.add("is-danger");
        if (!Transaction.error_scrolled)
        {
          Transaction.error_scrolled = true;
          container.scrollIntoView(true);
        }
      }
    }

    public static UpdateInputError(input: HTMLElement, container: HTMLElement, error_text: string = ""):void
    {
      let error_element = <HTMLElement>container.querySelector("p.help.is-danger");      
      if (error_text.length === 0)
      {
        Utilities.Clear_Element(error_element);
        input.classList.remove("is-danger");
      }
      else
      {
        Utilities.Simple_Error_Show(error_element, error_text);
        input.classList.add("is-danger");
        if (!Transaction.error_scrolled)
        {
          Transaction.error_scrolled = true;
          container.scrollIntoView(true);
        }
      }
    }

    public static UpdateInputGuide(container: HTMLElement, guide_text: string = ""): void
    {
      let guide_element = <HTMLElement>container.querySelector("p.help.guide");
      if (guide_element === null)
      {
        console.log('UpdateInputGuide called, no guide elements found', container, guide_text);
        return;
      }
      Utilities.Set_Text(guide_element, guide_text);
    }


    public static ValidateDropdown(input: HTMLSelectElement, container: HTMLElement, valid_values: Array<string>): boolean
    {
      let e: string = "";
      
      if (input.value === "-1")
      {
        e = "You must choose one of these options.";
      }
      if (valid_values.indexOf(input.value) === -1 && e.length === 0)
      {
        e = "Please select a valid value.";
      }
      ControlGroup.UpdateSelectError(container, e);
      return e.length === 0;
    }

    public static ValidateDate(input: HTMLInputElement, container: HTMLElement): boolean
    {
      let e = "";
      //let input = <HTMLInputElement>this.input_element;
      if (input.valueAsDate === null && input.required)
      {
        e = "You must selected a date.";
      }
      ControlGroup.UpdateInputError(input, container, e);
      return e.length === 0;
    }

    public static ValidateText(input: HTMLInputElement, container: HTMLElement): boolean
    {
      let e = "";
      
      if (input.required && input.value.length === 0)
      {
        e = "This field is required.";
      }

      if (input.maxLength > 0 && input.value.length > input.maxLength && e.length === 0)
      {
        e ="You entered " + input.value.length.toString() + " characters but " + input.maxLength.toString() + " is the maximum number of characters allowed.";
      }
      ControlGroup.UpdateInputError(input, container, e);
      return e.length === 0;

    }

    public static ValidateNumber(input: HTMLInputElement, container: HTMLElement): boolean
    {
      let e: string = "";

      if (input.value.length === 0)
      {
        e = "You must enter a number. (No commas or $ allowed).";
      }

      if (input.valueAsNumber === NaN && e.length === 0)
      {
        e = "Please enter Numbers and Decimal points only.";
      }

      ControlGroup.UpdateInputError(input, container, e);

      return e.length === 0;
    }

    public static ValidateCount(input: HTMLInputElement, container: HTMLElement): boolean
    {
      let e: string = "";

      if (input.value.length === 0 && input.required)
      {
        e = "You must enter a number. (No commas, decimal points, or $ allowed).";
      }

      if (input.valueAsNumber === NaN && e.length === 0)
      {
        e = "Please enter Numbers only.";
      }
      if (input.valueAsNumber < 0)
      {
        e = "This value must be 0 or greater.";
      }
      ControlGroup.UpdateInputError(input, container, e);

      return e.length === 0;
    }

    public static ValidateMoney(input: HTMLInputElement, container: HTMLElement): boolean
    {
      let e: string = "";

      if (input.value.length === 0)
      {
        e = "You must enter a number. (No commas or $ allowed).";
      }

      if (input.valueAsNumber === NaN && e.length === 0)
      {
        e = "Please enter Numbers and Decimal points only.";
      }

      if (input.valueAsNumber < 0 && e.length === 0)
      {
        e = "Negative numbers are not allowed.";
      }

      let i = input.value.split(".");
      if (i.length === 2 && e.length === 0)
      {
        if (i[1].length > 2)
        {
          e = "Too many digits after the decimal place. Amounts are limited to 2 digits after the decimal place.";
        }
      }
      ControlGroup.UpdateInputError(input, container, e);

      return e.length === 0;
    }

  }


}