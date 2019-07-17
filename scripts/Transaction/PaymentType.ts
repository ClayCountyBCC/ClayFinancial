namespace Transaction
{
  interface IPaymentType
  {
    department_id: number;
    id: number;
    name: string;
    is_active: boolean;
    does_tax_exempt_apply: boolean;
    controls: Array<Control>;
  }

  export class PaymentType implements IPaymentType
  {
    public department_id: number;
    public id: number;
    public name: string;
    public is_active: boolean;
    public does_tax_exempt_apply: boolean;
    public controls: Array<Control>;

    Constructor() { }

  }


}