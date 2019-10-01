namespace Transaction
{
  export let error_scrolled: boolean = false;
  export let departments: Array<Department> = [];
  export let transactions: Array<Data.TransactionData> = [];
  export let currentReceipt: Receipt = null;
  //export let currentTransactionData: Transaction.Data.TransactionData = null;
  export let DepartmentControl: HTMLSelectElement = null;
  export let DepartmentControlContainer: HTMLElement = null;
  

  export async function Start()
  {

    await Department.GetDepartments()
      .then((d) =>
      {
        Transaction.departments = d;
        console.log(d);
        Transaction.DepartmentControl = Department.CreateDepartmentElement(Transaction.departments);

        for (let department of Transaction.departments)
        {

          department.control_groups = ControlGroup.CreateControlGroups(department.controls);

          for (let paymentType of department.payment_types)
          {

            paymentType.control_groups = ControlGroup.CreateControlGroups(paymentType.controls);

          }
        }

      });

    await Data.TransactionData.GetTransactionList(1)
      .then((tv) =>
      {
        Transaction.transactions = tv;
        Data.TransactionData.RenderTransactionList();
        console.log('transactions', Transaction.transactions);
      });

    console.log('departments', Transaction.departments);
  }


  export function NewReceipt()
  {
    Transaction.currentReceipt = new Receipt();
  }

  export function NewDeposit()
  {

  }

  export function GetPath(): string
  {
    let path = "/";
    let i = window.location.pathname.toLowerCase().indexOf("/clayfinancial");
    if (i == 0)
    {
      path = "/clayfinancial/";
    }
    return path;
  }


}