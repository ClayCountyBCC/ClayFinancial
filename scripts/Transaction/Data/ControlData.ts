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
    error_text: string;
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
    public container_element: HTMLElement = null;
    public is_active: boolean = true;
    public modified_by: string = "";
    public modified_on: Date;
    public error_text: string = "";

    constructor(control: Control, payment_type_id: number)
    {
      this.control = control;
      this.control_id = control.control_id;
      this.input_element = <HTMLElement>control.rendered_input_element.cloneNode(true);
      this.payment_type_id = payment_type_id;
      this.input_element.oninput = (event: Event) =>
      {
        this.value = (<HTMLInputElement>event.target).value;
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
      return false;
    }


  }
}