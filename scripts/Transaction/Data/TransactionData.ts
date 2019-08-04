namespace Transaction.Data
{
  interface ITransactionData
  {
    transaction_id: number;
    department_id: number;
    department_controls: Array<ControlData>;
    payment_types: Array<PaymentTypeData>;
    error_text: string;
  }
  export class TransactionData implements ITransactionData
  {
    public transaction_id: number = -1;
    public department_id: number = null;
    public department_controls: Array<ControlData> = [];
    public payment_types: Array<PaymentTypeData> = [];
    private base_container: string = 'root';
    private department_element: HTMLSelectElement = null;
    private payment_type_target: string = 'payment_type_container';
    private selected_department: Department = null;
    public error_text: string = "";

    constructor()
    {
      let targetContainer = document.getElementById(this.base_container);
      Utilities.Clear_Element(targetContainer);
      this.CreateReceiptTitle(targetContainer);
      this.department_element = <HTMLSelectElement>Transaction.DepartmentControl.cloneNode(true);
      this.RenderDepartmentSelection(targetContainer);
      this.department_controls = [];
    }

    CreateReceiptTitle(target:HTMLElement)
    {
      let title = document.createElement("h1");
      title.classList.add("title", "has-text-centered");
      title.appendChild(document.createTextNode("Create a New Receipt"))
      target.appendChild(title);
    }

    RenderDepartmentSelection(target: HTMLElement)
    {
      this.department_element.onchange = (event: Event) =>
      {
        this.department_id = parseInt((<HTMLSelectElement>event.target).value);        
        this.selected_department = Department.FindDepartment(this.department_id);
        this.RenderDepartmentControls();
        this.RenderPaymentTypes();

      }
      target.appendChild(Department.CreateDepartmentElementField(this.department_element));
    }

    RenderDepartmentControls()
    {

    }

    RenderPaymentTypes()
    {
      this.payment_types = [];
      console.log('Render Payment Types this', this);
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
        
        let controls = document.createElement("ol");
        controls.classList.add("control", "hide");

        ol.appendChild(controls);

        li.onclick = (event:Event) =>
        {
          controls.classList.toggle("hide");
          if (!controls.classList.contains("hide"))
          {
            if (controls.childElementCount === 0) // there is no payment type data created yet.
            {
              let ptd = new PaymentTypeData(controls, pt.does_tax_exempt_apply, pt.payment_type_id, pt.controls);


              this.payment_types.push(ptd);
            }
            //let li = document.createElement("li");
            //li.appendChild(document.createTextNode(.toString()));
            //controls.appendChild(li);
          }

          console.log('this transaction', this);
        }


      }
      paymentTypeContainer.appendChild(ol);

    }

  }


}