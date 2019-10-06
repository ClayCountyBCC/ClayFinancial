namespace Transaction.Data
{
  interface IControlData
  {
    control_data_id: number;
    prior_control_data_id: number;
    transaction_payment_type_id: number;
    transaction_id: number;
    control_id: number;
    control: Control;
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
    public control: Control = null;
    public payment_type_id: number = -1;
    public payment_type_index: number = -1;
    public value: string = "";
    public is_active: boolean = true;
    public modified_on: Date = new Date();
    public modified_by: string = "";
    public reason_for_change: string = "";
    public error_text: string = "";

    // client side controls
    private selected_control: Control = null;
    public input_element: HTMLElement = null;
    public container_element: HTMLElement = null;

    constructor(control: Control, payment_type_id: number, clone_node: boolean)
    {
      this.selected_control = control;
      this.control_id = control.control_id;
      if (clone_node)
      {
        this.input_element = <HTMLElement>control.rendered_input_element.cloneNode(true);
      }
      else
      {
        this.input_element = <HTMLInputElement>control.rendered_input_element;
      }
      this.payment_type_id = payment_type_id;
      if (this.input_element.getAttribute("data_control_id") === null)
      {
        this.input_element.oninput = (event: Event) =>
        {
          let input = (<HTMLInputElement>event.target);
          if (this.Validate())
          {
            switch (control.data_type)
            {
              case "date":
                this.value = Utilities.Format_Date(input.valueAsDate);
                break;

              case "number":
                this.value = input.valueAsNumber.toString();
                break;

              case "count":
                this.value = input.valueAsNumber.toString();
                input.value = input.valueAsNumber.toString();

                break;

              case "money":
                this.value = input.valueAsNumber.toString();
                break;

              default: // "bigtext", "text", "dropdown"
                this.value = input.value;
                break;
            }
          }
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
      
      switch (this.selected_control.data_type)
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
      return ControlGroup.ValidateDropdown(
        <HTMLSelectElement>this.input_element,
        this.container_element,
        this.selected_control.valid_values);
    }

    private ValidateDate(): boolean
    {
      return ControlGroup.ValidateDate(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateText(): boolean
    {
      return ControlGroup.ValidateText(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateNumber(): boolean
    {
      return ControlGroup.ValidateNumber(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateCount(): boolean
    {
      return ControlGroup.ValidateCount(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateMoney(): boolean
    {
      return ControlGroup.ValidateMoney(<HTMLInputElement>this.input_element, this.container_element);
    }
  }
}