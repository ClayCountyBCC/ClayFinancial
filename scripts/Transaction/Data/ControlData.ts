namespace Transaction.Data
{
  interface IControlData
  {
    control_id: number;
    department_id: number;
    payment_type_id: number;
    payment_type_counter: number;
    value: string;
  }

  export class ControlData implements IControlData
  {

    public control_id: number;
    public department_id: number;
    public payment_type_id: number;
    public payment_type_counter: number;
    public value: string;

    constructor() {}


  }
}