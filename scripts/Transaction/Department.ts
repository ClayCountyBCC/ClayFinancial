namespace Transaction
{
  interface IDepartment
  {

    id: number;
    name: string;
    is_active: boolean;
    organization: string;
    payment_types: Array<PaymentType>;
    controls: Array<Control>;
  }

  export class Department implements IDepartment
  {
    public id: number;
    public name: string;
    public is_active: boolean;
    public organization: string = "";
    public payment_types: Array<PaymentType> = [];
    public controls: Array<Control> = [];

    Constructor() { }

    public static GetPath(): string
    {
      let path = "/";
      let i = window.location.pathname.toLowerCase().indexOf("/clayfinancial");
      if (i == 0)
      {
        path = "/clayfinancial/";
      }
      return path;
    }


    public static GetDepartments(): void
    {
      let path = Department.GetPath();
      Promise.resolve(Utilities.Get<Array<Department>>(path + "API/Transaction/Departments")
        .then(function (departments: Array<Department>)
        {
          console.log("departments", departments);
          Transaction.departments = departments;
          console.log('Transaction.departments', Transaction.departments);          

        }, function (e: Error)
          {
            console.log('error getting departments', e);
            Transaction.departments = [];
          
          }));

    }


  }


}