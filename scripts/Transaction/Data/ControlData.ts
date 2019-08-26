namespace Transaction.Data
{
  interface IControlData
  {
    control_data_id: number;
    prior_control_data_id: number;
    transaction_payment_type_id: number;
    transaction_id: number;
    control_id: number;
    department_id: number;
    payment_type_id: number;
    payment_type_index: number;
    value: string;
    is_active: boolean;
    modified_by: string;
    modified_on: Date;
    error_text: string;
    reason_for_change: string;
  }

  export class ControlData implements IControlData
  {
    public control_data_id: number = -1;
    public prior_control_data_id: number = -1;
    public transaction_payment_type_id: number = -1;
    public department_id: number = -1;
    public transaction_id: number = -1;
    public control_id: number = -1;
    public payment_type_id: number = -1;
    public payment_type_index: number = -1;
    public value: string = "";
    public is_active: boolean = true;
    public modified_on: Date = new Date();
    public modified_by: string = "";
    public reason_for_change: string = "";
    public error_text: string = "";

    // client side controls
    private control: Control = null;
    public input_element: HTMLElement = null;
    public container_element: HTMLElement = null;

    constructor(control: Control, payment_type_id: number)
    {
      this.control = control;
      this.control_id = control.control_id;
      this.input_element = <HTMLElement>control.rendered_input_element.cloneNode(true);
      this.payment_type_id = payment_type_id;
      this.input_element.oninput = (event: Event) =>
      {
        let input = (<HTMLInputElement>event.target);
        switch (control.data_type)
        {
          case "date":
            if (this.ValidateDate())
            {
              this.value = Utilities.Format_Date(input.valueAsDate);
            }

            break;

          case "number":
            if (this.ValidateNumber())
            {
              this.value = input.valueAsNumber.toString();
            }
            break;

          case "count":
            if (this.ValidateCount())
            {
              this.value = input.valueAsNumber.toString();
              input.value = input.valueAsNumber.toString();
              
            }
            break;

          case "money":
            if (this.ValidateMoney())
            {
              this.value = input.valueAsNumber.toString();
            }
            break;

          default:
            this.value = input.value;
            break;

        }

      }
      if (control.data_type === "dropdown")
      {
        this.container_element = ControlGroup.CreateSelectFieldContainerByControl(control, <HTMLSelectElement>this.input_element, true);
      }
      else
      {
        this.container_element = ControlGroup.CreateInputFieldContainerByControl(control, this.input_element, true);
      }
    }

    public Validate():boolean
    {
      
      switch (this.control.data_type)
      {
        case "dropdown":
          return this.ValidateDropdown();

        case "count":
          return this.ValidateCount();

        case "date":
          return this.ValidateDate();

        case "number":
          return this.ValidateNumber();

        case "money":
          return this.ValidateMoney();

        case "text":
        case "bigtext":
          
          return this.ValidateText();

        default:
          return false;
      }
    }

    private ValidateDropdown(): boolean
    {
      ControlGroup.UpdateSelectError(this.container_element, "");
      if (this.value === "-1")
      {
        ControlGroup.UpdateSelectError(this.container_element, "You must choose one of these options.");
        return false;
      }
      if (this.control.valid_values.indexOf(this.value) === -1)
      {
        ControlGroup.UpdateSelectError(this.container_element, "Please select a valid value.");
        return false;
      }
      return true;
    }

    private ValidateDate(): boolean
    {
      let e = "";
      let input = <HTMLInputElement>this.input_element;
      if (input.valueAsDate === null && this.control.required)
      {
        e = "You must selected a date.";
      }
      ControlGroup.UpdateInputError(this.input_element, this.container_element, e);
      return e.length === 0;
    }

    private ValidateText(): boolean
    {
      ControlGroup.UpdateInputError(this.input_element, this.container_element, "");
      this.value = this.value.trim();

      let c = this.control;

      if (c.required && this.value.length === 0)
      {
        ControlGroup.UpdateInputError(this.input_element, this.container_element, "This field is required.");
        return false;
      }

      if (c.max_length > 0 && this.value.length > c.max_length)
      {
        ControlGroup.UpdateInputError(this.input_element, this.container_element, "You entered " + this.value.length.toString() + " characters but " + c.max_length.toString() + " is the maximum number of characters allowed.");
        return false;
      }
      return true;

    }

    private ValidateNumber(): boolean
    {
      let e: string = "";
      let input = <HTMLInputElement>this.input_element;

      if (input.value.length === 0)
      {
        e = "You must enter a number. (No commas or $ allowed).";
      }

      if (input.valueAsNumber === NaN && e.length === 0)
      {
        e = "Please enter Numbers and Decimal points only.";
      }

      ControlGroup.UpdateInputError(this.input_element, this.container_element, e);

      return e.length === 0;
    }

    private ValidateCount(): boolean
    {
      let e: string = "";
      let input = <HTMLInputElement>this.input_element;

      if (input.value.length === 0)
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
      ControlGroup.UpdateInputError(this.input_element, this.container_element, e);

      return e.length === 0;
    }

    private ValidateMoney(): boolean
    {
      let e: string = "";
      let input = <HTMLInputElement>this.input_element;

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
      ControlGroup.UpdateInputError(this.input_element, this.container_element, e);

      return e.length === 0;
    }
  }
}