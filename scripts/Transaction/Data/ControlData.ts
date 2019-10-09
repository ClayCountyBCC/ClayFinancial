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
    public selected_control: Control = null;
    public input_element: HTMLElement = null;
    public container_element: HTMLElement = null;

    constructor(control: Control, payment_type_id: number, clone_node: boolean)
    {
      let saved_control_data_id = control.rendered_input_element ? control.rendered_input_element.getAttribute("control_data_id") : null;
      this.selected_control = control;
      this.control_id = control.control_id;
      
      if (clone_node)
      {
        this.input_element = <HTMLElement>control.rendered_input_element.cloneNode(true);
      }
      else
      {
        this.input_element = control.rendered_input_element ? <HTMLInputElement>control.rendered_input_element : Control.CreateControl(control);
      }
      this.payment_type_id = payment_type_id;
      if (saved_control_data_id === null)
      {
        let input = <HTMLInputElement>this.input_element;
        if (input.type === "number")
        {
          input.onwheel = (e) => { e.preventDefault() };
        }
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

    private static GetControlHistory(control_data_id: string, transaction_id: string): Promise<Array<ControlData>>
    {
      let path = Transaction.GetPath();
      return Utilities.Get<Array<ControlData>>(path + "API/Transaction/GetControlDataHistory?control_data_id=" + control_data_id + "&transaction_id=" + transaction_id );
    }

    public static async GetAndDisplayControlHistory(control_data_id: string, transaction_id: string)
    {
      console.log('GetAndDisplayControlHistory', 'control_data_id', control_data_id, 'transaction_id', transaction_id);
      await ControlData.GetControlHistory(control_data_id, transaction_id)
        .then((control_data_history) =>
        {
          console.log('control data history', control_data_history);
          this.MarkControlDataToEdit(control_data_history);
          ControlData.DisplayControlHistory(control_data_history);
        });
    }

    private static MarkControlDataToEdit(control_data: Array<ControlData>)
    {
      let filtered = control_data.filter(x => x.is_active);
      if (filtered.length === 1)
      {
        let c = filtered[0];
        let cd = new Data.ControlData(c.control, c.payment_type_id, false);
        cd.transaction_payment_type_id = c.transaction_payment_type_id;
        cd.department_id = c.department_id;
        cd.is_active = c.is_active;
        cd.control_data_id = c.control_data_id;
        cd.value = c.value;
        Transaction.editing_control_data = c;
      }
      else
      {
        alert("Invalid data stored in database for this transaction.");
      }
    }

    private static DisplayControlHistory(control_data: Array<ControlData>): void
    {

    }
  }
}