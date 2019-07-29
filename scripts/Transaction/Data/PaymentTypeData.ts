namespace Transaction.Data
{
  interface IPaymentTypeData
  {
    transaction_payment_type_id: number;
    payment_type_id: number;
    payment_type_index: number
    transaction_id: number;
    tax_exempt: boolean;
    control_data: Array<ControlData>;
  }

  export class PaymentTypeData implements IPaymentTypeData
  {
    public transaction_payment_type_id: number;
    public payment_type_id: number;
    public payment_type_index: number
    public transaction_id: number;
    public tax_exempt: boolean;
    public control_data: Array<ControlData>;

    constructor() { }




  }
}