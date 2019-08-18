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
        if (control.data_type === "date")
        {
          let v = input.valueAsDate;
          this.value = v !== null ? Utilities.Format_Date(v) : "";
        }
        else
        {
          this.value = input.value;
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

        case "date":

          return this.ValidateDate();

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
      ControlGroup.UpdateInputError(this.input_element, this.container_element, "");
      let input = <HTMLInputElement>this.input_element;
      if (input.valueAsDate === null && this.control.required)
      {
        ControlGroup.UpdateInputError(this.input_element, this.container_element, "You must selected a date.");
        return false
      }
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


  }
}