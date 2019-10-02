namespace Transaction
{
  interface IPaymentType
  {
    department_id: number;
    payment_type_id: number;
    name: string;
    is_active: boolean;
    controls: Array<Control>;
    controls_dict: object;
    control_groups: Array<ControlGroup>;
  }

  export class PaymentType implements IPaymentType
  {
    public department_id: number;
    public payment_type_id: number;
    public name: string;
    public is_active: boolean;
    public controls: Array<Control>;
    public controls_dict: object;
    public control_groups: Array<ControlGroup> = [];


    Constructor() { }



  }


}