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
    error_text: string;
    received_from: string;
    created_on: any;
    created_by_username: string;
    created_by_ip_address: string;
  }
  export class TransactionData implements ITransactionData
  {
    public transaction_id: number = -1;
    public fiscal_year: number = -1;
    public created_by_employee_id: number = -1;
    public employee_transaction_count: number = -1;
    public transaction_number: string = "";
    public transaction_type: string = "";
    public child_transaction_id: number = -1;
    public department_id: number = -1;
    public department_control_data: Array<ControlData> = [];
    public payment_type_data: Array<PaymentTypeData> = [];
    public error_text: string = "";
    public received_from: string = "";
    public created_on: any = new Date();
    public created_by_username: string = "";
    public created_by_ip_address: string = "";
    // client side only stuff
    public base_container: string = 'root';
    private department_element: HTMLSelectElement = null;
    private department_element_container: HTMLElement = null;
    private received_from_element: HTMLElement = null;
    private received_from_element_container: HTMLElement = null;
    private department_controls_target: string = 'department_controls_container';
    private payment_type_target: string = 'payment_type_container';
    public selected_department: Department = null;
    private next_payment_type_index: number = 0;

    constructor(transaction_type: string)
    {
      this.transaction_type = transaction_type;
      let targetContainer = document.getElementById(this.base_container);
      Utilities.Clear_Element(targetContainer);
      this.CreateReceiptTitle(targetContainer);
      let control_container = document.createElement("div");
      control_container.id = "transaction_controls";
      control_container.classList.add("columns");
      targetContainer.appendChild(control_container);
      this.department_element = <HTMLSelectElement>Transaction.DepartmentControl.cloneNode(true);
      this.RenderDepartmentSelection(control_container);
      this.RenderReceivedFromInput(control_container);
    }

    private CreateReceiptTitle(target:HTMLElement)
    {
      let title = document.createElement("h2");
      title.classList.add("title", "has-text-centered");
      title.appendChild(document.createTextNode("Create a New Receipt"))
      target.appendChild(title);
    }

    private RenderDepartmentSelection(target: HTMLElement)
    {
      this.department_element.onchange = (event: Event) =>
      {
        this.department_id = parseInt((<HTMLSelectElement>event.target).value);        
        this.selected_department = Department.FindDepartment(this.department_id);
        this.RenderDepartmentControls();
        this.RenderPaymentTypes();        
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
        document.getElementById(this.base_container).appendChild(departmentControlContainer);
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
        document.getElementById(this.base_container).appendChild(paymentTypeContainer);
      }

      Utilities.Clear_Element(paymentTypeContainer);
      if (this.department_id === -1 || this.selected_department === null) return;
      
      let ol = document.createElement("ol");
      ol.classList.add("payment_type");

      for (let pt of this.selected_department.payment_types)
      {
        let li = document.createElement("li");
        li.classList.add("light-function", "is-size-3", "has-background-link");
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

    private RenderReceivedFromInput(target_container: HTMLElement): void
    {
      this.received_from_element = ControlGroup.CreateInput("text", 500, true, "Received From");
      this.received_from_element.oninput = (event: Event) =>
      {
        let e = (<HTMLInputElement>event.target);
        this.received_from = e.value.trim();
        this.IsValid();
      }
      this.received_from_element_container = ControlGroup.CreateInputFieldContainer(this.received_from_element, "Received From or N/A", true, "is-one-half");
      target_container.appendChild(this.received_from_element_container);
    }

    private AddPaymentType(payment_type: PaymentType, container: HTMLElement): void
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
        }
        else
        {
          Utilities.Toggle_Loading_Button(button, false);
        }
      }

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


      return is_valid;
    }

    private IsValid(): boolean
    {
      this.ResetErrorElements();

      let is_valid = true;

      if (this.department_id === -1)
      {
        ControlGroup.UpdateSelectError(this.department_element_container, "Invalid Department Selected");
        is_valid = false;
      }
      if (this.received_from.length === 0)
      {
        ControlGroup.UpdateInputError(this.received_from_element, this.received_from_element_container, "This field is required.");
        is_valid = false;
      }
      return is_valid;
    }

    private ResetErrorElements()
    {
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
      Utilities.Post(path + "API/Transaction/Save", t)
        .then(function (response)
        {
          console.log("post probably good", response)
        }, function (error)
          {
            console.log("post error occurred", error);
          });
    }

  }


}