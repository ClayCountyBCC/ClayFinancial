namespace Transaction.Data
{
  interface IControlData
  {
    control_data_id: number;
    prior_control_data_id: number;
    control_id: number;
    department_id: number;
    payment_type_id: number;
    payment_type_index: number;
    value: string;
    is_active: boolean;
    modified_by: string;
    modified_on: Date;
  }

  export class ControlData implements IControlData
  {
    public control_data_id: number = -1;
    public prior_control_data_id: number = -1;
    public control_id: number = -1;
    public department_id: number = -1;
    public payment_type_id: number = -1;
    public payment_type_index: number = -1;
    public value: string = "";
    public control: Control = null;
    public input_element: HTMLElement = null;
    public single_element: HTMLElement = null;
    public group_element: HTMLElement = null;
    public is_active: boolean = true;
    public modified_by: string = "";
    public modified_on: Date;

    constructor(control: Control, payment_type_id: number, hints: Array<string>)
    {
      this.control_id = control.control_id;
      this.input_element = Control.CreateControl(control);      
      this.payment_type_id = payment_type_id;
      this.input_element.oninput = (event: Event) =>
      {
        this.value = (<HTMLInputElement>event.target).value;
      }
      if (hints.indexOf("short") !== -1 || hints.indexOf("medium") !== -1)
      {
        this.group_element = Control.CreateInputFieldContainer(this.input_element, control.label, true, hints.indexOf("short") !== -1 ? "is-one-third" : "is-half");
      }
      else
      {
        this.single_element = Control.CreateInputFieldContainer(this.input_element, control.label);
      }
      
    }


  }
}