namespace Transaction.Data
{

  interface IDepartmentData
  {
    department_id: number;
    control_data: Array<ControlData>;
    payment_type_data: Array<PaymentTypeData>;
  }

  export class DepartmentData implements IDepartmentData 
  {
    department_id: number;
    control_data: Array<ControlData>;
    payment_type_data: Array<PaymentTypeData>;

    constructor() {}
  }
}