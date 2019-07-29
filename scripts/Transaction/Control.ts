namespace Transaction
{

  interface IControl
  {
    department_id: number;
    department_sort_order: number;
    payment_type_id: number;
    payment_type_sort_order: number;
    control_id: number;
    label: string;
    value: string;
    data_type: string;
    is_active: boolean;
    required: boolean;
    max_length: number;
    validation_regex: string;

  }
  export class Control implements IControl
  {
    public department_id: number;
    public department_sort_order: number;
    public payment_type_id: number;
    public payment_type_sort_order: number;
    public control_id: number;
    public label: string;
    public value: string;
    public data_type: string;
    public is_active: boolean;
    public required: boolean;
    public max_length: number;
    public validation_regex: string;

    Constructor() { }


  }


}