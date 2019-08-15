﻿namespace Transaction
{
  export let departments: Array<Department> = [];
  export let currentReceipt: Receipt = null;
  export let currentTransactionData: Transaction.Data.TransactionData = null;
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

    console.log('departments', Transaction.departments);
  }


  export function NewReceipt()
  {
    Transaction.currentReceipt = new Receipt();
  }

  export function NewDeposit()
  {

  }


}