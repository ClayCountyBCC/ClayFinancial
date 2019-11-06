namespace Transaction.Data
{
  interface IControlData
  {
    control_data_id: number;
    prior_control_data_id: number;
    transaction_payment_type_id: number;
    transaction_id: number;
    control_id: number;
    control: Control;
    department_id: number;
    payment_type_id: number;
    payment_type_index: number;
    value: string;
    is_active: boolean;
    modified_by: string;
    modified_on: Date;
    error_text: string;
    reason_for_change: string;
  }

  export class ControlData implements IControlData
  {
    public control_data_id: number = -1;
    public prior_control_data_id: number = -1;
    public transaction_payment_type_id: number = -1;
    public department_id: number = -1;
    public transaction_id: number = -1;
    public control_id: number = -1;
    public control: Control = null;
    public payment_type_id: number = -1;
    public payment_type_index: number = -1;
    public value: string = "";
    public is_active: boolean = true;
    public modified_on: Date = new Date();
    public modified_by: string = "";
    public reason_for_change: string = "";
    public error_text: string = "";

    // client side controls
    public selected_control: Control = null;
    public input_element: HTMLElement = null;
    public container_element: HTMLElement = null;

    constructor(control: Control, payment_type_id: number, clone_node: boolean)
    {
      let saved_control_data_id = control.rendered_input_element ? control.rendered_input_element.getAttribute("control_data_id") : null;
      this.selected_control = control;
      this.control_id = control.control_id;
      
      if (clone_node)
      {
        this.input_element = <HTMLElement>control.rendered_input_element.cloneNode(true);
      }
      else
      {
        this.input_element = control.rendered_input_element ? <HTMLInputElement>control.rendered_input_element : Control.CreateControl(control);
      }
      this.payment_type_id = payment_type_id;
      if (saved_control_data_id === null)
      {
        let input = <HTMLInputElement>this.input_element;
        if (input.type === "number")
        {
          input.onwheel = (e) => { e.preventDefault() };
        }
        this.input_element.oninput = (event: Event) =>
        {

          let input = (<HTMLInputElement>event.target);
          if (this.Validate())
          {
            switch (control.data_type)
            {
              case "date":
                let d = input.valueAsDate;
                d.setMinutes(d.getTimezoneOffset());                
                this.value = Utilities.Format_Date(d);                
                break;

              case "number":
                this.value = input.valueAsNumber.toString();
                break;

              case "count":
                this.value = input.valueAsNumber.toString();
                input.value = input.valueAsNumber.toString();

                break;

              case "money":
                this.value = input.valueAsNumber.toString();
                break;

              default: // "bigtext", "text", "dropdown"
                this.value = input.value;
                break;
            }
          }
        }
      }

      if (control.data_type === "dropdown")
      {
        this.container_element = ControlGroup.CreateSelectFieldContainerByControl(control, <HTMLSelectElement>this.input_element, true);
      }
      else
      {
        this.container_element = ControlGroup.CreateInputFieldContainerByControl(control, this.input_element, true);
      }
    }

    public Validate():boolean
    {
      
      switch (this.selected_control.data_type)
      {
        case "dropdown":
          return this.ValidateDropdown();

        case "count":
          return this.ValidateCount();

        case "date":
          return this.ValidateDate();

        case "number":
          return this.ValidateNumber();

        case "money":
          return this.ValidateMoney();

        case "text":
        case "bigtext":
          
          return this.ValidateText();

        default:
          return false;
      }
    }    

    private ValidateDropdown(): boolean
    {
      return ControlGroup.ValidateDropdown(
        <HTMLSelectElement>this.input_element,
        this.container_element,
        this.selected_control.valid_values);
    }

    private ValidateDate(): boolean
    {
      return ControlGroup.ValidateDate(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateText(): boolean
    {
      return ControlGroup.ValidateText(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateNumber(): boolean
    {
      return ControlGroup.ValidateNumber(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateCount(): boolean
    {
      return ControlGroup.ValidateCount(<HTMLInputElement>this.input_element, this.container_element);
    }

    private ValidateMoney(): boolean
    {
      return ControlGroup.ValidateMoney(<HTMLInputElement>this.input_element, this.container_element);
    }

    private static GetControlHistory(control_data_id: string, transaction_id: string): Promise<Array<ControlData>>
    {
      let path = Transaction.GetPath();
      return Utilities.Get<Array<ControlData>>(path + "API/Transaction/GetControlDataHistory?control_data_id=" + control_data_id + "&transaction_id=" + transaction_id );
    }

    public SaveControlChanges(): void
    {
      let path = Transaction.GetPath();
      console.log('saving this control data', this);
      Utilities.Post<string>(path + "API/Transaction/EditControls", this)
        .then(response =>
        {
          if (response.length > 0)
          {
            alert("There was a problem saving this change." + '\r\n' + response);
          }
          else
          {
            Transaction.CloseChangeModal();
            Transaction.ShowReceiptDetail(this.transaction_id);
            Transaction.editing_control_data = null;
          }
          Utilities.Toggle_Loading_Button("change_transaction_save", false);
        })
    }

    public static async GetAndDisplayControlHistory(control_data_id: string, transaction_id: string)
    {
      await ControlData.GetControlHistory(control_data_id, transaction_id)
        .then((control_data_history) =>
        {
          ControlData.MarkDataToEdit(control_data_history);
          ControlData.DisplayControlHistory(control_data_history);
          ControlData.DisplayControlToEdit();
        });
    }

    private static MarkDataToEdit(control_data: Array<ControlData>)
    {
      Transaction.editing_control_data = null;
      Transaction.editing_payment_method_data = null;
      let filtered = control_data.filter(x => x.is_active);
      if (filtered.length === 1)
      {
        let c = filtered[0];
        let cd = new Data.ControlData(c.control, c.payment_type_id, false);
        cd.transaction_payment_type_id = c.transaction_payment_type_id;
        cd.department_id = c.department_id;
        cd.is_active = c.is_active;
        cd.control_data_id = c.control_data_id;
        cd.transaction_id = c.transaction_id;
        cd.value = c.value;
        switch (c.control.data_type)
        {

          case "date":
            if (c.value !== "" && c.value !== null)
            {
              let tmp = c.value.split("/");
              if (tmp.length === 3)
              {
                let v = tmp[2] + '-';
                v += tmp[0].length === 1 ? "0" + tmp[0] : tmp[0];
                v += "-";
                v += tmp[1].length === 1 ? "0" + tmp[1] : tmp[1];
                (<HTMLInputElement>cd.input_element).value = v;
              }
            }
            break;

          default: 
            (<HTMLInputElement>cd.input_element).value = c.value;
        }
        
        cd.control = cd.selected_control;
        Transaction.editing_control_data = cd;
      }
      else
      {
        alert("Invalid data stored in database for this transaction.");
      }
    }

    private static DisplayControlToEdit(): void
    {
      if (Transaction.editing_control_data === null) return;
      let container = document.getElementById(Transaction.change_edit_container);
      Utilities.Clear_Element(container);
      container.classList.add("columns");
      let e = Transaction.editing_control_data;
      container.appendChild(e.container_element);
      Utilities.Set_Value(Transaction.reason_for_change_input, "");
    }

    private static CreateControlDataHistoryHeader(): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Value", "has-text-left", "50%"));
      return tr;
    }

    private static DisplayControlHistory(control_data: Array<ControlData>): void
    {
      let header = document.getElementById(Transaction.change_transaction_history_table_header);
      Utilities.Clear_Element(header);
      header.appendChild(ControlData.CreateControlDataHistoryHeader());
      let body = document.getElementById(Transaction.change_transaction_history_table_body);
      Utilities.Clear_Element(body);
      for (let cd of control_data)
      {
        body.appendChild(ControlData.CreateControlDataHistoryRow(cd));
      }
    }

    private static CreateControlDataHistoryRow(control_data: ControlData): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      if (new Date(control_data.modified_on).getFullYear() < 1000)
      {
        let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
        original.colSpan = 3;
        tr.appendChild(original);
      }
      else
      {
        tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(control_data.modified_on), "has-text-centered"));
        tr.appendChild(Utilities.CreateTableCell("td", control_data.modified_by, "has-text-centered"));
        tr.appendChild(Utilities.CreateTableCell("td", control_data.reason_for_change, "has-text-left"));
      }
      tr.appendChild(Utilities.CreateTableCell("td", control_data.value, "has-text-left"));

      return tr;
    }

    public SetErrorText(error_text: string):void
    {
      if (this.selected_control.data_type === "dropdown")
      {
        ControlGroup.UpdateSelectError(this.container_element, error_text);
      }
      else
      {
        ControlGroup.UpdateInputError(this.input_element, this.container_element, error_text);
      }
    }

  }
}