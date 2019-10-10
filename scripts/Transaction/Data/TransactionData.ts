namespace Transaction.Data
{
  interface ITransactionData
  {
    transaction_id: number;
    child_transaction_id: number;
    department_id: number;
    fiscal_year: number;
    created_by_employee_id: number;
    transaction_number: string;
    employee_transaction_count: number;
    department_control_data: Array<ControlData>;
    payment_type_data: Array<PaymentTypeData>;
    county_manager_name: string;
    error_text: string;
    received_from: string;
    total_cash_amount: number;
    total_check_amount: number;
    total_check_count: number;
    created_on: any;
    created_by_username: string;
    created_by_display_name: string;
    created_by_ip_address: string;
  }

  export class TransactionData implements ITransactionData
  {
    public transaction_id: number = -1;
    public fiscal_year: number = -1;
    public created_by_employee_id: number = -1;
    public employee_transaction_count: number = -1;
    public transaction_number: string = "PREVIEW";
    public transaction_type: string = "";
    public child_transaction_id: number = -1;
    public department_id: number = -1;
    public department_name: string = "";
    public department_control_data: Array<ControlData> = [];
    public payment_type_data: Array<PaymentTypeData> = [];
    public county_manager_name: string = "PREVIEW";
    public error_text: string = "";
    public received_from: string = "";
    public total_cash_amount: number = -1;
    public total_check_amount: number = -1;
    public total_check_count: number = -1;
    public created_on: any = new Date();
    public created_by_username: string = "";
    public created_by_ip_address: string = "";
    public created_by_display_name: string = "PREVIEW";
    // client side only stuff
    public static reload_button: string = 'filterRefreshButton';
    public static action_container: string = 'action_view';
    public static transaction_view_container: string = "transaction_view";
    public static transaction_list_view_container: string = 'transaction_list_view';
    public static transaction_view_filters_container: string = "transaction_view_filters";
    //public base_container: string = 'root';
    private department_element: HTMLSelectElement = null;
    private department_element_container: HTMLElement = null;
    private received_from_element: HTMLElement = null;
    private received_from_element_container: HTMLElement = null;
    private department_controls_target: string = 'department_controls_container';
    private payment_type_target: string = 'payment_type_container';
    private transaction_error_element: HTMLElement = null;
    public selected_department: Department = null;
    private next_payment_type_index: number = 0;

    constructor(transaction_type: string, saved_transaction: TransactionData)
    {
      this.transaction_type = transaction_type;

      let targetContainer = document.getElementById(TransactionData.action_container);
      Utilities.Clear_Element(targetContainer);
      this.CreateReceiptTitle(targetContainer, saved_transaction);
      let control_container = document.createElement("div");
      control_container.id = "transaction_controls";
      control_container.classList.add("columns");
      targetContainer.appendChild(control_container);
      this.department_element = <HTMLSelectElement>Transaction.DepartmentControl.cloneNode(true);
      this.RenderDepartmentSelection(control_container, saved_transaction);
      this.RenderReceivedFromInput(control_container, saved_transaction);
      
      this.transaction_error_element = this.CreateTransactionErrorElement();
      targetContainer.appendChild(this.transaction_error_element);
    }
       
    private CreateTransactionErrorElement(): HTMLElement
    {
      let e = document.createElement("div");      
      return e;
    }

    private CreateReceiptTitle(target:HTMLElement, saved_transaction: TransactionData)
    {
      let title = document.createElement("h2");
      title.classList.add("title", "has-text-centered");
      let text = saved_transaction !== null ? "Viewing Transaction: " + saved_transaction.transaction_number : "Create a New Receipt";
      title.appendChild(document.createTextNode(text))
      target.appendChild(title);
    }

    private RenderDepartmentSelection(target: HTMLElement, saved_transaction: TransactionData)
    {
      if (saved_transaction === null)
      {
        this.department_element.onchange = (event: Event) =>
        {
          this.department_id = parseInt((<HTMLSelectElement>event.target).value);
          this.selected_department = Department.FindDepartment(this.department_id);
          this.RenderDepartmentControls();
          this.RenderPaymentTypes();
        }
      }
      else
      {
        //this.department_element.classList.add("disabled"); // see if this does anything

        this.department_id = saved_transaction.department_id;
        this.selected_department = Department.FindDepartment(this.department_id);
        this.RenderSavedDepartmentControls(saved_transaction);
        this.RenderSavedPaymentTypes(saved_transaction);
        this.department_element.value = saved_transaction.department_id.toString();
        (<HTMLSelectElement>this.department_element).disabled = true;
      }
      this.department_element_container = Department.CreateDepartmentElementField(this.department_element);
      target.appendChild(this.department_element_container);
    }

    private RenderDepartmentControls()
    {
      this.department_control_data = [];
      let departmentControlContainer = document.getElementById(this.department_controls_target);
      if (departmentControlContainer === null)
      {
        departmentControlContainer = document.createElement("div");
        departmentControlContainer.id = this.department_controls_target;
        document.getElementById(TransactionData.action_container).appendChild(departmentControlContainer);
      }
      Utilities.Clear_Element(departmentControlContainer);
      if (this.department_id === -1 ||
        this.selected_department === null ||
        this.selected_department.controls.length === 0) return;

      for (let group of this.selected_department.control_groups)
      {
        this.department_control_data.push(...group.CreateControlData(departmentControlContainer));
      }
    }

    private RenderPaymentTypes()
    {
      this.payment_type_data = [];
      let paymentTypeContainer = document.getElementById(this.payment_type_target);
      // if we can't find it, create it.
      if (paymentTypeContainer === null)
      {
        paymentTypeContainer = document.createElement("div");
        paymentTypeContainer.id = this.payment_type_target;
        document.getElementById(TransactionData.action_container).appendChild(paymentTypeContainer);
      }

      Utilities.Clear_Element(paymentTypeContainer);
      if (this.department_id === -1 || this.selected_department === null) return;
      
      let ol = document.createElement("ol");
      ol.classList.add("payment_type");

      for (let pt of this.selected_department.payment_types)
      {
        let li = document.createElement("li");
        li.classList.add("light-function", "is-size-4", "has-background-link");
        li.style.cursor = "pointer";        
        li.setAttribute("payment_type_id", pt.payment_type_id.toString());
        let name = document.createElement("span");
        name.classList.add("name");
        name.appendChild(document.createTextNode(pt.name));
        li.appendChild(name);

        let totals = document.createElement("span");
        totals.classList.add("totals");
        li.appendChild(totals);

        ol.appendChild(li);
        
        let controls_container = document.createElement("ol");
        controls_container.classList.add("control_container", "hide");

        ol.appendChild(controls_container);

        li.onclick = (event:Event) =>
        {
          if (controls_container.childElementCount === 0) // there is no payment type data created yet.
          {
            this.AddPaymentType(pt, controls_container);
            controls_container.classList.remove("hide");
          }
          //controls_container.classList.toggle("hide");
          //if (!controls_container.classList.contains("hide"))
          //{

          //}

          console.log('this transaction', this);
        }
      }
      paymentTypeContainer.appendChild(ol);

    }

    private AddPaymentType(payment_type: PaymentType, container: HTMLElement, saved_payment_type_data: PaymentTypeData = null): void
    {
      let ptd = new PaymentTypeData(payment_type, container, this.next_payment_type_index++);
      this.payment_type_data.push(ptd);

      ptd.add_another_payment_type_button.onclick = (event: Event) =>
      {
        this.AddPaymentType(payment_type, container);
      }

      ptd.cancel_payment_type_button.onclick = (event: Event) =>
      {
        container.removeChild(ptd.payment_type_container);
        let indextoremove = this.payment_type_data.findIndex((j) => { return j.payment_type_index === ptd.payment_type_index; });
        if (indextoremove > -1) this.payment_type_data.splice(indextoremove, 1);
        ptd = null;
        if (container.childElementCount === 0) container.classList.add("hide");
      }

      ptd.save_button.onclick = (event: Event) =>
      {
        let button = <HTMLButtonElement>event.target;
        Utilities.Toggle_Loading_Button(button, true);

        if (this.ValidateTransaction())
        {
          Transaction.currentReceipt.ShowReceiptPreview();
          Utilities.Toggle_Loading_Button(button, false);
        }
        else
        {
          Utilities.Toggle_Loading_Button(button, false);
        }
      }
    }

    /*
     * Saved Transaction Rendering functions
     * 
     */

    private RenderSavedDepartmentControls(saved_transaction: TransactionData)
    {
      this.department_control_data = [];
      let departmentControlContainer = document.getElementById(this.department_controls_target);
      if (departmentControlContainer === null)
      {
        departmentControlContainer = document.createElement("div");
        departmentControlContainer.id = this.department_controls_target;
        document.getElementById(TransactionData.action_container).appendChild(departmentControlContainer);
      }
      Utilities.Clear_Element(departmentControlContainer);
      if (this.department_id === -1 ||
        this.selected_department === null ||
        this.selected_department.controls.length === 0) return;

      let control_groups = ControlGroup.CreateSavedControlGroups(saved_transaction.department_control_data);

      for (let group of control_groups)
      {
        this.department_control_data.push(...group.CreateControlData(departmentControlContainer, false));
      }
    }

    private RenderSavedPaymentTypes(saved_transaction: TransactionData)
    {
      // The primary difference between the RenderSavedPaymentTypes and RenderPaymentTypes functions
      // is that the RenderPaymentTypes function renders the payment type based on what information
      // the system is currently set up to expect for that paymenttype.
      // The RenderSavedPaymentTypes function renders the payment type based on the information
      // that was saved.  This information may not be vaild for the payment types going forward.
      this.payment_type_data = []; 
      let paymentTypeContainer = document.getElementById(this.payment_type_target);
      // if we can't find it, create it.
      if (paymentTypeContainer === null)
      {
        paymentTypeContainer = document.createElement("div");
        paymentTypeContainer.id = this.payment_type_target;
        document.getElementById(TransactionData.action_container).appendChild(paymentTypeContainer);
      }

      Utilities.Clear_Element(paymentTypeContainer);
      if (this.department_id === -1 || this.selected_department === null) return;

      let ol = document.createElement("ol");
      ol.classList.add("payment_type");
      let ids = saved_transaction.payment_type_data.map(ptd => ptd.payment_type_id);
      let distinct_payment_type_ids = [...new Set(ids)];
      for (let payment_type_id of distinct_payment_type_ids)
      {
        let filtered = saved_transaction.payment_type_data.filter(x => x.payment_type_id === payment_type_id);

        let pt = Transaction.FindPaymentType(filtered[0].payment_type_id); //filtered[0].payment_type;
        //let pt = Transaction.FindPaymentType(payment_type_id);

        let li = document.createElement("li");
        li.classList.add("light-function", "is-size-4", "has-background-link");
        li.style.cursor = "pointer";
        li.setAttribute("payment_type_id", pt.payment_type_id.toString());
        let name = document.createElement("span");
        name.classList.add("name");
        name.appendChild(document.createTextNode(pt.name));
        li.appendChild(name);

        let totals = document.createElement("span"); // will need to calculate totals now
        totals.classList.add("totals");
        li.appendChild(totals);

        ol.appendChild(li);

        let controls_container = document.createElement("ol");
        controls_container.classList.add("control_container");

        ol.appendChild(controls_container);
        for (let ptd of filtered)
        {
          this.AddSavedPaymentType(pt, ptd, controls_container);
        }
        
      }
      paymentTypeContainer.appendChild(ol);

    }

    private AddSavedPaymentType(payment_type: PaymentType, payment_type_data: PaymentTypeData, container: HTMLElement): void
    {
      let ptd = new PaymentTypeData(payment_type, container, this.next_payment_type_index++, payment_type_data);
      this.payment_type_data.push(ptd);      

      ptd.add_another_payment_type_button.style.display = "none";

      //ptd.add_another_payment_type_button.onclick = (event: Event) =>
      //{ // if they click this, I need to capture it so that I can save that particular payment type separately.
      //  this.AddPaymentType(payment_type, container, payment_type_data);
      //}


      ptd.cancel_payment_type_button.style.display = "none";

      ptd.save_button.style.display = "none";
    }
    
    private RenderReceivedFromInput(target_container: HTMLElement, saved_transaction: TransactionData): void
    {
      let input_value = saved_transaction === null ? "" : saved_transaction.received_from;
      this.received_from = input_value;
      this.received_from_element = ControlGroup.CreateInput("text", 500, true, "Received From", input_value);
      if (saved_transaction === null)
      {
        this.received_from_element.oninput = (event: Event) =>
        {
          let e = (<HTMLInputElement>event.target);
          this.received_from = e.value.trim();
          this.IsValid();
        }
      }
      else
      {
        (<HTMLInputElement>this.received_from_element).readOnly = true;
      }
      this.received_from_element_container = ControlGroup.CreateInputFieldContainer(this.received_from_element, "Received From or N/A", true, "is-one-half");
      target_container.appendChild(this.received_from_element_container);
    }
           
    private ValidateTransaction(): boolean
    {
      let is_valid = true;

      is_valid = this.IsValid();

      for (let ct of this.department_control_data)
      {
        let v = ct.Validate();
        if (!v && is_valid) is_valid = false;
      }

      for (let pt of this.payment_type_data)
      {
        let v = pt.Validate();
        if (!v && is_valid) is_valid = false;
      }

      if (is_valid)
      {
        if (!this.ValidateCheckCount())
        {
          Utilities.Error_Show(this.transaction_error_element, "You have entered a check amount but have entered that you have collected no checks.");
          this.transaction_error_element.parentElement.scrollIntoView();
          is_valid = false;
        }
      }

      return is_valid;
    }

    private ValidateCheckCount(): boolean
    {
      let check_amount: number = 0;
      for (let pt of this.payment_type_data)
      {
        for (let pmd of pt.payment_method_data)
        {
          if (pmd.check_count > 0) return true;
          check_amount += pmd.check_amount;
        }
      }
      return check_amount === 0;
    }

    private IsValid(): boolean
    {
      Transaction.error_scrolled = false;
      this.ResetErrorElements();

      let is_valid = true;

      //if (this.department_id === -1)
      //{
      //  //ControlGroup.UpdateSelectError(this.department_element_container, "Invalid Department Selected");
      //  is_valid = false;
      //}
      if (this.received_from.length === 0)
      {
        ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "This field is required.");
        is_valid = false;
      }
      return is_valid;
    }

    private ResetErrorElements()
    {
      Utilities.Clear_Element(this.transaction_error_element);
      ControlGroup.UpdateSelectError(this.department_element_container, "");
      ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "");
    }

    public SaveTransactionData(): void
    {
      // first let's reorder all of the payment_type_index fields
      // by reorder I mean make them representative
      // of the actual index that element is in the array.
      let t = this;
      let path = Transaction.GetPath();
      Utilities.Post<TransactionData>(path + "API/Transaction/Save", t)
        .then(function (response)
        {
          console.log("post probably good", response);

          Transaction.currentReceipt.ShowReceipt(response);
          Transaction.ResetReceipt();

          Transaction.Data.TransactionData.GetTransactionList()
            .then((tv) =>
            {
              Transaction.transactions = tv;
              Utilities.Toggle_Loading_Button(Data.TransactionData.reload_button, false);
            });

          // need to reset the current transaction
          // and display the one that I just downloaded.
        }, function (error)
          {
            console.log("post error occurred", error);
          });
    }

    /* 
     * Transaction View Code
     */

    public static GetTransactionList(): Promise<Array<TransactionData>>
    {
      let page = Transaction.current_page;
      Utilities.Toggle_Loading_Button(TransactionData.reload_button, true);
      let path = Transaction.GetPath();
      let filters = TransactionData.GetTransactionFilters();
      return Utilities.Get<Array<TransactionData>>(path + "API/Transaction/Get?page_number=" + page.toString() + filters);
    }

    public static GetTransactionPageCount(): Promise<number>
    {
      let path = Transaction.GetPath();
      let props: Array<string> = [];
      let filters = TransactionData.GetTransactionFilters();
      if (filters.length > 0) filters = "?" + filters.substr(1);
      return Utilities.Get<number>(path + "API/Transaction/PageCount" + filters);
    }

    private static GetTransactionFilters(): string
    {
      let props: Array<string> = [];
      if (Transaction.name_filter.length > 0) props.push("&display_name_filter=" + Transaction.name_filter);
      if (Transaction.department_id_filter > 0) props.push("&department_id_filter=" + Transaction.department_id_filter.toString());
      if (Transaction.transaction_type_filter.length > 0) props.push("&transaction_type_filter=" + Transaction.transaction_type_filter);
      if (Transaction.completed_filter.length > 0) props.push("&completed_filter=" + Transaction.completed_filter);
      if (Transaction.modified_only_filter) props.push("&has_been_modified=true");
      if (Transaction.transaction_number_filter.length > 0) props.push("&transaction_number_filter=" + Transaction.transaction_number_filter);
      return props.join("");
    }

    public static GetSpecificTransaction(transaction_id: number): Promise<TransactionData>
    {
      let path = Transaction.GetPath();
      return Utilities.Get<TransactionData>(path + "API/Transaction/GetTransactionData?transaction_id=" + transaction_id.toString());
    }

    public static RenderTransactionList()
    {
      Transaction.ViewTransactions();

      let container = document.getElementById(TransactionData.transaction_list_view_container);
      Utilities.Clear_Element(container);
      let table = TransactionData.CreateTransactionListTable();
      container.appendChild(table);
      let tbody = document.createElement("tbody");
      table.appendChild(tbody);
      if (Transaction.transactions.length === 0)
      {
        tbody.appendChild(Transaction.CreateMessageRow(11, "No transactions were found to match your filters."));
      }
      else
      {
        for (let data of Transaction.transactions)
        {
          tbody.appendChild(TransactionData.CreateTransactionListRow(data));
        }
      }

      Utilities.Toggle_Loading_Button(Data.TransactionData.reload_button, false);
    }

    private static CreateTransactionListTable():HTMLTableElement
    {
      let table = document.createElement("table");
      table.classList.add("table", "is-fullwidth");
      let thead = document.createElement("thead");
      thead.id = "transaction_list_view_header";
      table.appendChild(thead);
      let tr = document.createElement("tr");
      thead.appendChild(tr);
      tr.appendChild(Utilities.CreateTableCell("th", "Created On", "has-text-left", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered", "5%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Number", "has-text-left", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Status", "has-text-left", "7.5%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Department", "has-text-left", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Checks", "has-text-right", "7.25%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Check Amount", "has-text-right", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Cash Amount", "has-text-right", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Total Amount", "has-text-right", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "", "", "5%"));
      tr.appendChild(Utilities.CreateTableCell("th", "", "", "5%"));
      return table;
    }

    private static CreateTransactionListRow(data: TransactionData): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.created_on), "has-text-left"));

      //let transaction_display_value = data.transaction_type + " / " + data.transaction_number;
      tr.appendChild(Utilities.CreateTableCell("td", data.transaction_type, "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("td", data.transaction_number, "has-text-left"));
      let status = "";
      if (data.transaction_type === "R")
      {
        if (data.child_transaction_id === null)
        {
          status = "Incomplete";
        }
        else
        {
          if (data.child_transaction_id === data.transaction_id)
          {
            status = "Completed";
          }
          else
          {
            status = "Deposited"; // maybe turn this into a link to the deposit?
          }
        }
      }
      else
      {
        if (data.transaction_type === "D")
        {
          if (data.child_transaction_id === null)
          {
            status = "Incomplete";
          }
          else
          {
            status = "Accepted";
          }
        }
      }
      tr.appendChild(Utilities.CreateTableCell("td", status, "has-text-left"));
      tr.appendChild(Utilities.CreateTableCell("td", data.department_name, "has-text-left"));
      tr.appendChild(Utilities.CreateTableCell("td", data.total_check_count.toString(), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_cash_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.total_check_amount + data.total_cash_amount), "has-text-right"));
      //tr.appendChild(Utilities.CreateTableCell("td", "", ""));
      let listtd = document.createElement("td");
      listtd.classList.add("has-text-right");
      let detailButton = TransactionData.CreateTableCellIconButton("fa-list", "is-small");
      detailButton.onclick = () =>
      {
        Transaction.ShowReceiptDetail(data.transaction_id);
      }
      listtd.appendChild(detailButton);
      tr.appendChild(listtd);
      let printtd = document.createElement("td");
      printtd.classList.add("has-text-right");
      let printButton = TransactionData.CreateTableCellIconButton("fa-print", "is-small");
      printButton.onclick = () =>
      {
        Transaction.ShowReceipt(data.transaction_id);
      }
      printtd.appendChild(printButton);
      tr.appendChild(printtd);

      //tr.appendChild(Utilities.CreateTableCell("td", "", ""));
      return tr;
    }

    private static CreateTableCellIconButton(icon: string, size: string): HTMLAnchorElement
    {
      let button = document.createElement("a");
      button.classList.add("button", size);
      let span = document.createElement("span");
      span.classList.add("icon", size);
      let i = document.createElement("i");
      i.classList.add("fas", icon)
      span.appendChild(i);
      button.appendChild(span);
      return button;
    }

  }




}