namespace Transaction
{
  export let error_scrolled: boolean = false;
  export let departments: Array<Department> = [];
  export let payment_types: Array<PaymentType> = [];
  export let controls: Array<Control> = [];
  export let transactions: Array<Data.TransactionData> = [];
  export let currentReceipt: Receipt = null;
  //export let currentTransactionData: Transaction.Data.TransactionData = null;
  export let DepartmentControl: HTMLSelectElement = null;
  export let DepartmentControlContainer: HTMLElement = null;
  export let department_filter = "";
  export let name_filter = "mine";
  export let status_filter = "incomplete";
  export let type_filter = "";
  export let modified_only_filter = false;
  export let transaction_number_filter = "";

  export async function Start()
  {

    await Department.GetDepartments()
      .then((d) =>
      {
        Transaction.payment_types = [];
        Transaction.controls = [];

        Transaction.departments = d;
        console.log(d);
        Transaction.DepartmentControl = Department.CreateDepartmentElement(Transaction.departments);

        PopulateFilters();

        for (let department of Transaction.departments)
        {
          let payment_type_ids = Transaction.payment_types.map((pt) => { return pt.payment_type_id; });

          Transaction.payment_types = Transaction.payment_types.concat(
            department.payment_types.filter((pt) => { return payment_type_ids.indexOf(pt.payment_type_id) === -1; })
          );

          let department_control_ids = department.controls.map((c) => { return c.control_id; });

          Transaction.controls = Transaction.controls.concat(
            department.controls.filter((c) => { return department_control_ids.indexOf(c.control_id) === -1; })
          );

          department.control_groups = ControlGroup.CreateControlGroups(department.controls);

          for (let paymentType of department.payment_types)
          {
            paymentType.control_groups = ControlGroup.CreateControlGroups(paymentType.controls);
          }
        }

        for (let payment_type of Transaction.payment_types)
        {
          let control_ids = Transaction.controls.map((c) => { return c.control_id; });

          Transaction.controls = Transaction.controls.concat(
            payment_type.controls.filter((c) => { return control_ids.indexOf(c.control_id) === -1; })
          );
        }

        console.log("all payment types", Transaction.payment_types);
        console.log("all controls", Transaction.controls);
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

  export async function ShowReceipt(transaction_id: number)
  {
    await Data.TransactionData.GetSpecificTransaction(transaction_id)
      .then((transaction) =>
      {
        console.log('transaction to show', transaction);
        Transaction.currentReceipt = new Receipt(transaction);
        Transaction.currentReceipt.ShowReceipt(transaction);
      });
  }

  export async function ShowReceiptDetail(transaction_id: number)
  {
    await Data.TransactionData.GetSpecificTransaction(transaction_id)
      .then((transaction) =>
      {
        console.log('transaction to show', transaction);
        Transaction.currentReceipt = new Receipt(transaction);
        Utilities.Hide(Data.TransactionData.transaction_view_filters_container);
        Utilities.Hide(Data.TransactionData.transaction_view_container);
        Utilities.Show(Data.TransactionData.action_container);
        Utilities.Hide(Receipt.receipt_container);        
      });
  }
  
  export function NewReceipt()
  {
    Transaction.currentReceipt = new Receipt();
    Utilities.Hide(Data.TransactionData.transaction_view_filters_container);
    Utilities.Hide(Data.TransactionData.transaction_view_container);
    Utilities.Show(Data.TransactionData.action_container);
    Utilities.Hide(Receipt.receipt_container);
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

  export function FindPaymentType(payment_type_id: number): PaymentType
  {
    let filtered = Transaction.payment_types.filter((pt) => pt.payment_type_id === payment_type_id);
    return (filtered.length === 1) ? filtered[0] : null;
  }

  export function FindControl(control_id: number): Control
  {
    let filtered = Transaction.controls.filter((c) => c.control_id === control_id);
    return (filtered.length === 1) ? filtered[0] : null;
  }

  function PopulateFilters()
  {
    let departmentSelect = <HTMLSelectElement>document.getElementById("departmentFilter");
    departmentSelect.add(Utilities.Create_Option("", "All Departments", true));
    for (let d of Transaction.departments)
    {
      departmentSelect.add(Utilities.Create_Option(d.department_id.toString(), d.name, false));
    }

    let nameSelect = <HTMLSelectElement>document.getElementById("nameFilter");
    nameSelect.add(Utilities.Create_Option("mine", "My Transactions", true));
    nameSelect.add(Utilities.Create_Option("", "All Users", false));

    let statusSelect = <HTMLSelectElement>document.getElementById("statusFilter");
    statusSelect.add(Utilities.Create_Option("", "All Statuses", true));
    statusSelect.add(Utilities.Create_Option("i", "Incomplete", false));
    statusSelect.add(Utilities.Create_Option("c", "Completed", false));

    let typeSelect = <HTMLSelectElement>document.getElementById("typeFilter");
    typeSelect.add(Utilities.Create_Option("", "All Types", true));
    typeSelect.add(Utilities.Create_Option("R", "Receipts", false));
    typeSelect.add(Utilities.Create_Option("D", "Deposits", false));
  }

  export function FilterTransactions(): void
  {
    Transaction.department_filter = Utilities.Get_Value("departmentFilter");
    Transaction.name_filter = Utilities.Get_Value("nameFilter");
    Transaction.status_filter = Utilities.Get_Value("statusFilter");
    Transaction.type_filter = Utilities.Get_Value("typeFilter");
    Transaction.transaction_number_filter = Utilities.Get_Value("transactionNumberFilter");
    Transaction.modified_only_filter = (<HTMLInputElement>document.getElementById("modifiedFilter")).checked;

    Data.TransactionData.GetTransactionList(1)
      .then((tv) =>
      {
        Transaction.transactions = tv;
        Data.TransactionData.RenderTransactionList();
        console.log('transactions', Transaction.transactions);
      });
    //filterRefreshButton
    console.log("Filterin'!");
  }

}