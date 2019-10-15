namespace Transaction.Data
{
  interface IPaymentMethodData
  {
    payment_method_data_id: number;
    prior_payment_method_data_id: number;
    transaction_payment_type_id: number;
    transaction_id: number;
    cash_amount: number;
    check_amount: number;
    check_count: number;
    check_number: string;
    paying_for: string;
    check_from: string;
    error_text: string;
    is_active: boolean;
    added_after_save: boolean;
    modified_by: string;
    modified_on: Date;
    reason_for_change: string;
  }

  export class PaymentMethodData implements IPaymentMethodData
  {
    public payment_method_data_id: number = -1;
    public prior_payment_method_data_id: number = -1;
    public transaction_payment_type_id: number = -1;
    public transaction_id: number = -1;
    
    public cash_amount: number = 0;
    public check_amount: number = 0;
    public check_count: number = 0;
    public check_number: string = "";
    public check_from: string = "";
    public paying_for: string = "";
    public is_active: boolean = true;
    public added_after_save: boolean = false;
    public modified_by: string = "";
    public modified_on: Date = new Date();
    public reason_for_change: string = "";

    public error_text: string = "";

    //client side specific properties
    private is_cash: boolean = false;
    private show_cancel: boolean = false;

    private cash_amount_input_element: HTMLInputElement = null;
    private cash_amount_input_element_container: HTMLElement = null;
    
    private check_amount_input_element: HTMLInputElement = null;
    private check_amount_input_element_container: HTMLElement = null;

    private check_count_input_element: HTMLInputElement = null;
    private check_count_input_element_container: HTMLElement = null;

    private check_number_input_element: HTMLInputElement = null;
    private check_number_input_element_container: HTMLElement = null;
    
    private paying_for_input_element: HTMLInputElement = null;
    private paying_for_input_element_container: HTMLElement = null;
    
    private check_from_input_element: HTMLInputElement = null;
    private check_from_input_element_container: HTMLElement = null;

    public add_check_button_element: HTMLButtonElement = null;
    public cancel_check_button_element: HTMLButtonElement = null;
    public check_buttons_container_element: HTMLElement = null;

    private payment_method_change: Function = () => { };

    private validate_money_regex: string = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";

    public control_to_render: HTMLElement = null;

    constructor(
      is_cash: boolean,
      show_cancel: boolean = false,
      element_id: number,
      payment_method_amount_change: Function,
      saved_payment_method_data: PaymentMethodData = null)
    {
      this.is_cash = is_cash;
      this.show_cancel = show_cancel;
      this.payment_method_data_id = element_id;
      this.payment_method_change = payment_method_amount_change;
      is_cash ? this.RenderCashControls(saved_payment_method_data) : this.RenderCheckControls(saved_payment_method_data);

    }

    public Validate():boolean
    {
      if (this.is_cash) return this.ValidateCash();

      return this.ValidateCheck();
    }

    private ValidateCash(): boolean
    {
      return ControlGroup.ValidateMoney(this.cash_amount_input_element, this.cash_amount_input_element_container);
    }

    private ValidateCheck(): boolean
    {
      let is_valid = true;

      let v = this.ValidateCheckAmount();
      if (!v && is_valid) is_valid = v;

      v = this.ValidateCheckCount();
      if (!v && is_valid) is_valid = v;

      v = this.ValidateCheckNumber()
      if (!v && is_valid) is_valid = v;

      v = this.ValidateCheckFrom();
      if (!v && is_valid) is_valid = v;

      v = this.ValidatePayingFor();
      if (!v && is_valid) is_valid = v;

      return is_valid;
    }

    private ValidateCheckAmount(): boolean
    {
      return ControlGroup.ValidateMoney(this.check_amount_input_element, this.check_amount_input_element_container);
    }

    private ValidateCheckCount(): boolean
    {
      
      return ControlGroup.ValidateCount(this.check_count_input_element, this.check_count_input_element_container);
    }

    private ValidateCheckNumber(): boolean
    {
      let input = this.check_number_input_element;
      let e = "";
      if (input.value.length > 0 && this.check_amount === 0)
      {
        e = "This field should only be used if a check is entered.";
      }
      if (input.value.length === 0 && this.check_amount > 0 && this.check_count === 1)
      {
        e = "A check number is required when you enter a check amount and set the check count to 1 check.";
      }
      if (input.value.length > 50)
      {
        e = "The check number can be at most 50 characters long.";
      }

      ControlGroup.UpdateInputError(this.check_number_input_element, this.check_number_input_element_container, e);
      return e.length === 0;
    }

    private ValidatePayingFor(): boolean
    {
      let input = this.paying_for_input_element;
      let e = "";
      if (input.value.length > 0 && this.check_amount === 0)
      {
        e = "This field should only be used if a check amount is entered.";
      }
      if (input.value.length > 500)
      {
        e = "This field can be at most 500 characters long.";
      }

      ControlGroup.UpdateInputError(this.paying_for_input_element, this.paying_for_input_element_container, e);
      return e.length === 0;
    }

    private ValidateCheckFrom(): boolean
    {
      let input = this.check_from_input_element;
      let e = "";
      if (input.value.length > 0 && this.check_amount === 0)
      {
        e = "This field should only be used if a check amount is entered.";
      }
      if (input.value.length === 0 && this.check_amount > 0 && this.check_count === 1)
      {
        e = "This field is required if you enter a check amount and set the check count to 1 check.";
      }
      if (input.value.length > 500)
      {
        e = "This field can be at most 500 characters long.";
      }

      ControlGroup.UpdateInputError(this.check_from_input_element, this.check_from_input_element_container, e);
      return e.length === 0;
    }

    private RenderCashControls(payment_method_data: PaymentMethodData)
    {
      let columns = document.createElement("div");
      columns.classList.add("columns");

      this.cash_amount_input_element = ControlGroup.CreateInput("number", 15, true, "0");
      if (payment_method_data === null)
      {
        this.cash_amount_input_element.oninput = (event) =>
        {
          this.cash_amount = 0;

          if (this.ValidateCash())
          {
            this.cash_amount = this.cash_amount_input_element.valueAsNumber;
          }

          this.payment_method_change();
        }
      }
      else
      {
        this.cash_amount_input_element.value = payment_method_data.cash_amount.toString();
        this.cash_amount_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
        this.cash_amount_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
        this.cash_amount_input_element.setAttribute("is_cash", "true");
      }
      this.cash_amount_input_element_container = ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter");
      columns.appendChild(this.cash_amount_input_element_container);
      this.control_to_render = columns;
    }

    private RenderCheckControls(payment_method_data: PaymentMethodData)
    {
      let columns = document.createElement("div");
      columns.classList.add("columns", "is-multiline", "check");

      this.check_amount_input_element = ControlGroup.CreateInput("number", 15, false, "0");

      if (payment_method_data === null)
      {
        this.check_amount_input_element.oninput = (event) =>
        {
          this.check_amount = 0;

          if (this.ValidateCheckAmount())
          {
            this.check_amount = this.check_amount_input_element.valueAsNumber;
            if (this.check_amount > 0)
            {
              Utilities.Show_Flex(this.check_buttons_container_element);
              this.check_count_input_element.required = true;
            }
            else
            {
              Utilities.Hide(this.check_buttons_container_element);
              this.check_count_input_element.required = false;
            }
          }

          this.payment_method_change();
        }
      }
      else
      {
        this.check_amount_input_element.readOnly = true;
        this.check_amount_input_element.value = payment_method_data.check_amount.toString();
        this.check_amount_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
        this.check_amount_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
        this.check_amount_input_element.setAttribute("is_cash", "false");
      }

      this.check_count_input_element = ControlGroup.CreateInput("number", 5, false, "# of Checks");
      this.check_count_input_element.step = "1";
      this.check_count_input_element.min = "0";
      if (payment_method_data === null)
      {
        this.check_count_input_element.oninput = (event) =>
        {
          if (this.ValidateCheckCount())
          {
            this.check_count = (<HTMLInputElement>event.target).valueAsNumber;
            if (this.check_amount > 0)
            {
              switch (this.check_count)
              {
                case 0:
                  ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Partial Check");
                  break;

                case 1:
                  ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Single Check");
                  break;

                default:
                  ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "Bulk Check");
              }
            }
            else
            {
              ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "");
            }

          }
          else
          {
            ControlGroup.UpdateInputGuide(this.check_count_input_element_container, "");
          }
          this.payment_method_change();
        }
      }
      else
      {
        this.check_count_input_element.readOnly = true;
        this.check_count_input_element.value = payment_method_data.check_count.toString();
        this.check_count_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
        this.check_count_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
        this.check_count_input_element.setAttribute("is_cash", "false");
      }


      this.check_number_input_element = ControlGroup.CreateInput("text", 50, false, "Check Number");
      if (payment_method_data === null)
      {
        this.check_number_input_element.oninput = (event) =>
        {
          if (this.ValidateCheckNumber())
          {
            this.check_number = (<HTMLInputElement>event.target).value;
          }
        }
      }
      else
      {
        this.check_number_input_element.readOnly = true;
        this.check_number_input_element.value = payment_method_data.check_number;
        this.check_number_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
        this.check_number_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
        this.check_number_input_element.setAttribute("is_cash", "false");
      }

      this.paying_for_input_element = ControlGroup.CreateInput("text", 500, false, "Check Paying For");
      if (payment_method_data === null)
      {
        this.paying_for_input_element.oninput = (event) =>
        {
          if (this.ValidatePayingFor())
          {
            this.paying_for = (<HTMLInputElement>event.target).value;
          }
        }
      }
      else
      {
        this.paying_for_input_element.readOnly = true;
        this.paying_for_input_element.value = payment_method_data.paying_for;
        this.paying_for_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
        this.paying_for_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
        this.paying_for_input_element.setAttribute("is_cash", "false");
      }

      this.check_from_input_element = ControlGroup.CreateInput("text", 500, false, "Check From");
      if (payment_method_data === null)
      {
        this.check_from_input_element.oninput = (event) =>
        {
          if (this.ValidateCheckFrom())
          {
            this.check_from = (<HTMLInputElement>event.target).value;
          }
        }
      }
      else
      {
        this.check_from_input_element.readOnly = true;
        this.check_from_input_element.value = payment_method_data.check_from;
        this.check_from_input_element.setAttribute("payment_method_data_id", payment_method_data.payment_method_data_id.toString());
        this.check_from_input_element.setAttribute("transaction_id", payment_method_data.transaction_id.toString());
        this.check_from_input_element.setAttribute("is_cash", "false");
      }

      this.add_check_button_element = document.createElement("button");
      this.add_check_button_element.classList.add("button", "is-info", Transaction.app_input_size);
      this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));

      this.check_amount_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter");
      columns.appendChild(this.check_amount_input_element_container);

      this.check_count_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_count_input_element, "# of Checks", true, "is-2", true);
      columns.appendChild(this.check_count_input_element_container);

      this.check_number_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter");
      columns.appendChild(this.check_number_input_element_container);

      if (this.show_cancel)
      {
        let buttons: Array<HTMLElement> = [];
        this.cancel_check_button_element = document.createElement("button");
        this.cancel_check_button_element.classList.add("button", "is-warning", Transaction.app_input_size);
        this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));
        buttons.push(this.add_check_button_element);
        buttons.push(this.cancel_check_button_element);
        this.check_buttons_container_element = ControlGroup.CreateButtonlistFieldContainer(buttons, "", true, "is-one-quarter");
        
      }
      else
      {
        this.check_buttons_container_element = ControlGroup.CreateInputFieldContainer(this.add_check_button_element, "", true, "is-one-half");
        this.check_buttons_container_element.classList.add("hide");
      }
      
      columns.appendChild(this.check_buttons_container_element);

      this.paying_for_input_element_container = ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half");
      columns.appendChild(this.paying_for_input_element_container);
      this.check_from_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half");
      columns.appendChild(this.check_from_input_element_container);

      this.control_to_render = columns;
    }
    
    private static GetHistory(payment_method_data_id: string, transaction_id: string): Promise<Array<PaymentMethodData>>
    {
      let path = Transaction.GetPath();
      return Utilities.Get<Array<PaymentMethodData>>(path + "API/Transaction/GetPaymentMethodHistory?payment_method_data_id=" + payment_method_data_id + "&transaction_id=" + transaction_id);
    }

    public SaveChanges(): void
    {
      let path = Transaction.GetPath();
      Utilities.Post<string>(path + "API/Transaction/EditPaymentMethod", this)
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
            Transaction.editing_payment_method_data = null;
          }
          Utilities.Toggle_Loading_Button("change_transaction_save", false);
        })
    }

    public static async GetAndDisplayHistory(payment_method_data_id: string, transaction_id: string, is_cash: boolean)
    {
      await PaymentMethodData.GetHistory(payment_method_data_id, transaction_id)
        .then((history) =>
        {
          PaymentMethodData.MarkDataToEdit(history, is_cash);
          PaymentMethodData.DisplayHistory(history, is_cash);
          PaymentMethodData.DisplayEdit();
        });
    }

    private static MarkDataToEdit(payment_method_data: Array<PaymentMethodData>, is_cash: boolean)
    {
      Transaction.editing_control_data = null;
      Transaction.editing_payment_method_data = null;
      let filtered = payment_method_data.filter(x => x.is_active);
      if (filtered.length === 1)
      {
        let p = filtered[0];
        let pmd = new Data.PaymentMethodData(is_cash, false, p.payment_method_data_id, () => { });
        pmd.payment_method_data_id = p.payment_method_data_id;
        pmd.transaction_id = p.transaction_id;
        pmd.transaction_payment_type_id = p.transaction_payment_type_id;
        pmd.prior_payment_method_data_id = p.prior_payment_method_data_id;
        pmd.is_active = true;
        if (is_cash)
        {
          pmd.cash_amount = p.cash_amount;          
          pmd.cash_amount_input_element.valueAsNumber = p.cash_amount;
        }
        else
        {
          pmd.check_amount = p.check_amount;
          pmd.check_amount_input_element.valueAsNumber = p.check_amount;

          pmd.check_count = p.check_count;
          pmd.check_count_input_element.valueAsNumber = p.check_count;

          pmd.check_from = p.check_from;
          pmd.check_from_input_element.value = p.check_from;

          pmd.check_number = p.check_number;
          pmd.check_number_input_element.value = p.check_number;

          pmd.paying_for = p.paying_for;
          pmd.paying_for_input_element.value = p.paying_for;
          
        }
        Transaction.editing_payment_method_data = pmd;
      }
      else
      {
        alert("Invalid data stored in database for this transaction.");
      }
    }

    private static DisplayEdit(): void
    {
      if (Transaction.editing_payment_method_data === null) return;
      let container = document.getElementById(Transaction.change_edit_container);
      Utilities.Clear_Element(container);
      container.classList.remove("columns");
      let e = Transaction.editing_payment_method_data;
      Utilities.Clear_Element(e.check_buttons_container_element);
      container.appendChild(e.control_to_render);
      Utilities.Set_Value(Transaction.reason_for_change_input, "");
    }

    private static CreateCashHistoryHeader(): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "20%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Cash Amount", "has-text-right", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "", "", "35%"));
      return tr;
    }

    private static CreateCheckHistoryHeader(): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("th", "Modified On", "has-text-centered", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Modified By", "has-text-centered", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Reason For Change", "has-text-left", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Check Amount", "has-text-right", "15%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Check Count", "has-text-centered", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Check #", "has-text-left", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-left", "10%"));
      tr.appendChild(Utilities.CreateTableCell("th", "Paying For", "has-text-left", "15%"));
      return tr;
    }

    private static DisplayHistory(payment_method_data: Array<PaymentMethodData>, is_cash: boolean): void
    {
      let header = document.getElementById(Transaction.change_transaction_history_table_header);
      Utilities.Clear_Element(header);
      if (is_cash)
      {
        header.appendChild(PaymentMethodData.CreateCashHistoryHeader());
      }
      else
      {
        header.appendChild(PaymentMethodData.CreateCheckHistoryHeader());
      }
      
      let body = document.getElementById(Transaction.change_transaction_history_table_body);
      Utilities.Clear_Element(body);
      for (let pmd of payment_method_data)
      {
        if (is_cash)
        {
          body.appendChild(PaymentMethodData.CreateCashHistoryRow(pmd));
        }
        else
        {
          body.appendChild(PaymentMethodData.CreateCheckHistoryRow(pmd));
        }
      }
    }

    private static CreateCashHistoryRow(data: PaymentMethodData): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      if (new Date(data.modified_on).getFullYear() < 1000)
      {
        let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
        original.colSpan = 3;
        tr.appendChild(original);
      }
      else
      {
        tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.modified_on), "has-text-centered"));
        tr.appendChild(Utilities.CreateTableCell("td", data.modified_by, "has-text-centered"));
        tr.appendChild(Utilities.CreateTableCell("td", data.reason_for_change, "has-text-left"));
      }
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.cash_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", "", "", "35%"));

      return tr;
    }

    private static CreateCheckHistoryRow(data: PaymentMethodData): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      if (new Date(data.modified_on).getFullYear() < 1000)
      {
        let original = Utilities.CreateTableCell("td", "Original Value", "has-text-centered");
        original.colSpan = 3;
        tr.appendChild(original);
      }
      else
      {
        tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_DateTime(data.modified_on), "has-text-centered"));
        tr.appendChild(Utilities.CreateTableCell("td", data.modified_by, "has-text-centered"));
        tr.appendChild(Utilities.CreateTableCell("td", data.reason_for_change, "has-text-left"));
      }
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(data.check_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", data.check_count.toString(), "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("td", data.check_number, "has-text-left"));
      tr.appendChild(Utilities.CreateTableCell("td", data.check_from, "has-text-left"));
      tr.appendChild(Utilities.CreateTableCell("td", data.paying_for, "has-text-left"));

      return tr;
    }


  }
}
