﻿namespace Transaction
{
  export let app_input_size: string = "is-normal";
  export let error_scrolled: boolean = false;
  export let departments: Array<Department> = [];
  export let payment_types: Array<PaymentType> = [];
  export let controls: Array<Control> = [];
  export let transactions: Array<Data.TransactionData> = [];
  export let currentReceipt: Receipt = null;
  //export let currentTransactionData: Transaction.Data.TransactionData = null;
  export let DepartmentControl: HTMLSelectElement = null;
  export let DepartmentControlContainer: HTMLElement = null;
  export let current_page: number = 1;
  export let page_count: number = 0;
  export let department_id_filter: number = -1;
  export let name_filter = "mine";
  export let completed_filter = "";
  export let transaction_type_filter = "";
  export let modified_only_filter = false;
  export let transaction_number_filter = "";
  export let editing_control_data: Data.ControlData = null;
  export let editing_payment_method_data: Data.PaymentMethodData = null;

  export async function Start()
  {
    await Department.GetDepartments()
      .then((d) =>
      {
        Transaction.payment_types = [];
        Transaction.controls = [];

        Transaction.departments = d;
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

      });

    await Transaction.GetTransactionList(1);

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
        Transaction.ViewReceiptDetail();

      });
  }

  export async function GetTransactionList(page: number)
  {
    Transaction.current_page = page;
    await Data.TransactionData.GetTransactionList()
      .then((tv) =>
      {
        Transaction.transactions = tv;
        Data.TransactionData.RenderTransactionList();
        console.log('transactions', Transaction.transactions);
        Utilities.Toggle_Loading_Button(Data.TransactionData.reload_button, false);
      });

    await Data.TransactionData.GetTransactionPageCount()
      .then((pagecount) =>
      {
        Transaction.page_count = pagecount;
        console.log("page count", pagecount);
        HandlePagination();
      });

  }
  
  export function NewReceipt()
  {
    Transaction.currentReceipt = new Receipt();
    Transaction.ViewReceiptDetail();
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

  export function SearchOnEnter(event:KeyboardEvent)
  {
    var e = event || window.event;
    if (event.keyCode == 13)
    {
      console.log('enter');
      Transaction.FilterTransactions();
    }
  }

  export function FilterTransactions(): void
  {
    Transaction.department_id_filter = parseInt(Utilities.Get_Value("departmentFilter"));
    Transaction.name_filter = Utilities.Get_Value("nameFilter");
    Transaction.completed_filter = Utilities.Get_Value("statusFilter");
    Transaction.transaction_type_filter = Utilities.Get_Value("typeFilter");
    Transaction.transaction_number_filter = Utilities.Get_Value("transactionNumberFilter");
    Transaction.modified_only_filter = (<HTMLInputElement>document.getElementById("modifiedFilter")).checked;

    Transaction.GetTransactionList(1);
  }

  export function ViewReceiptDetail(): void
  {
    Utilities.Hide(Data.TransactionData.transaction_view_container);
    Utilities.Show(Data.TransactionData.action_container);
    Utilities.Hide(Receipt.receipt_container);
  }

  export function ViewPrintableReceipt(): void
  {
    Utilities.Hide(Data.TransactionData.transaction_view_container);
    Utilities.Hide(Data.TransactionData.action_container);
    Utilities.Show(Receipt.receipt_container);
  }

  export function ViewTransactions(): void
  {
    Utilities.Show(Data.TransactionData.transaction_view_container);
    Utilities.Hide(Data.TransactionData.action_container);
    Utilities.Hide(Receipt.receipt_container);
  }

  export function ViewDeposit(): void
  {
    Utilities.Hide(Data.TransactionData.transaction_view_container);
    Utilities.Hide(Data.TransactionData.action_container);
    Utilities.Hide(Receipt.receipt_container);
  }

  export function PreviousPage(element: HTMLAnchorElement): void
  {
    if (element.getAttribute("disabled") === null) GetTransactionList(Transaction.current_page - 1);
  }

  export function NextPage(element: HTMLAnchorElement): void
  {
    if (element.getAttribute("disabled") === null) GetTransactionList(Transaction.current_page + 1);
  }

  function HandlePagination()
  {
    
    // Handle next/previous pages
    let previousPage = <HTMLAnchorElement>document.getElementById("resultsPreviousPage");
    let nextPage = <HTMLAnchorElement>document.getElementById("resultsNextPage");
    if (Transaction.current_page === 1)
    {
      previousPage.setAttribute("disabled", "");
    }
    else
    {
      previousPage.removeAttribute("disabled");
    }

    if (Transaction.current_page === Transaction.page_count)
    {
      nextPage.setAttribute("disabled", "");
    }
    else
    {
      nextPage.removeAttribute("disabled");
    }

    // now that we've handled the next/previous buttons, let's reset the current page in the hash.
    let pageList = document.getElementById("resultsPaginationList");
    Utilities.Clear_Element(pageList);
    pageList.appendChild(CreatePaginationLinks());
  }

  function CreatePaginationLinks(): DocumentFragment
  {
    // Scenarios
    // if the number of pages is 7 or less
    //    create a link for every page
    //    nothing else to worry about
    // if the number of pages is > 7 
    //    if the current page is 2 or less or total pages - 2 or more
    //      show pages 1 through 3 an ellipsis, and then last page - 3 to last page
    //    if the current page is 3 or total pages - 3 
    //      show pages 1 through 4 an ellipsis, and then last page - 2 to last page
    // Otherwise
    //    show page 1 then an ellipsis then currentpage - 1 through current page + 1 then last page
    let currentPage = Transaction.current_page;
    let totalPages = Transaction.page_count;
    let df = document.createDocumentFragment();
    if (currentPage < 1) Transaction.current_page = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (totalPages < 8)
    {
      // add a link to every page
      for (let i = 1; i <= totalPages; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      return df;
    }
    if (currentPage === 3)
    {
      for (let i = 1; i <= 4; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      df.appendChild(CreatePaginationEllipsis());
      for (let i = totalPages - 1; i <= totalPages; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      return df;
    }
    if (currentPage === (totalPages - 2))
    {
      for (let i = 1; i <= 2; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      df.appendChild(CreatePaginationEllipsis());
      for (let i = totalPages - 3; i <= totalPages; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      return df;
    }

    if (currentPage < 3 || currentPage > totalPages - 3)
    {
      // add links to the first 3 pages and last 3 pages
      for (let i = 1; i <= 3; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      df.appendChild(CreatePaginationEllipsis());
      for (let i = totalPages - 2; i <= totalPages; i++)
      {
        df.appendChild(CreatePaginationLink(i, i === currentPage));
      }
      return df;
    }

    // add links to the first page, currentpage -1 through currentpage + 1, and last page
    df.appendChild(CreatePaginationLink(1, false));
    df.appendChild(CreatePaginationEllipsis());
    for (let i = currentPage - 1; i <= currentPage + 1; i++)
    {
      df.appendChild(CreatePaginationLink(i, i === currentPage));
    }
    df.appendChild(CreatePaginationEllipsis());
    df.appendChild(CreatePaginationLink(totalPages, false));

    return df;
  }

  function CreatePaginationLink(page: number, isSelected: boolean): HTMLLIElement
  {
    // scroll back up to the top when a page is clicked
    //currentHash.page = page.toString();
    //currentHash.permit_display = "";
    //currentHash.permit_print = "";
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.classList.add("pagination-link");
    a.setAttribute("aria-label", "Goto page " + page.toString());   
    if (isSelected)
    {
      a.classList.add("is-current");
      a.setAttribute("aria-current", "page");
      a.style.cursor = "default";
    }
    else
    {
      a.onclick = () =>
      {
        Transaction.GetTransactionList(page);
        let header = document.getElementById("transaction_list_view_header");
        if (header !== null) header.scrollIntoView(true);
      }
    }
    a.appendChild(document.createTextNode(page.toString()));
    li.appendChild(a);
    return li;
  }

  function CreatePaginationEllipsis(): HTMLLIElement
  {
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.classList.add("pagination-ellipsis");
    span.innerHTML = "&hellip;";
    li.appendChild(span);
    return li;
  }

  export function CreateMessageRow(colspan: number, message: string): HTMLTableRowElement
  {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = colspan;
    td.appendChild(document.createTextNode(message));
    tr.appendChild(td);
    return tr;
  }

  export function ShowChangeModal()
  {
    Transaction.editing_control_data = null;
    Transaction.editing_payment_method_data = null;

    document.getElementById("change_transaction").classList.add("is-active");
  }

  export function CloseChangeModal()
  {
    document.getElementById("change_transaction").classList.remove("is-active");
  }

  export function LoadControlDataChange(control_data_id: string, transaction_id: string, field_label: string): void
  {
    Utilities.Set_Text("change_field_label", field_label);
    Transaction.ShowChangeModal();
    Data.ControlData.GetAndDisplayControlHistory(control_data_id, transaction_id)
      .then(() =>
      {
        console.log('we good', Transaction.editing_control_data);
        if (Transaction.editing_control_data === null) return; // we have a problem
        CreateHistoryTableHeader(true);

      });
  }

  export function LoadPaymentTypeDataChange(payment_method_data_id: string, is_cash: boolean, transaction_id: string, field_label: string): void
  {
    Utilities.Set_Text("change_field_label", field_label);
    Transaction.ShowChangeModal();

  }

  function CreateHistoryTableHeader(is_control_data: boolean)
  {
    let container = document.getElementById("change_transaction_history_header");
    Utilities.Clear_Element(container);
    if (is_control_data)
    {
      container.appendChild(CreateControlDataHistoryHeader());
    }
    else
    {
      container.appendChild(CreatePaymentMethodDataHistoryHeader());
    }
  }

  function CreateControlDataHistoryHeader(): HTMLTableRowElement
  {
    let tr = document.createElement("tr");
    return tr;
  }

  function CreatePaymentMethodDataHistoryHeader(): HTMLTableRowElement
  {
    let tr = document.createElement("tr");
    return tr;
  }


}