namespace Transaction
{
  export let departments: Array<Department> = [];
  //export let currentTransaction: Data.ReceiptData = null;

  export async function Start()
  {
    
    await Department.GetDepartments().then((d) =>
    {
      Transaction.departments = d;
      console.log(d);
    });
    console.log('departments', Transaction.departments);
  }


  export function NewReceipt()
  {
    
  }

  export function NewDeposit()
  {

  }


}