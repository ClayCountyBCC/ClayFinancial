namespace Transaction.Data
{
  interface IPaymentMethodData
  {
    payment_method_data_id: number;
    prior_payment_method_data_id: number;
    transaction_id: number;
    cash_amount: number;
    check_amount: number;
    check_number: string;
    paying_for: string;
    check_from: string;
    error_text: string;
  }

  export class PaymentMethodData implements IPaymentMethodData
  {
    public is_cash: boolean = false;
    public payment_method_data_id: number = -1;
    public payment_type_id: number = -1;
    public prior_payment_method_data_id: number = -1;
    public transaction_id: number = -1;
    public error_text: string = "";
    public show_cancel: boolean = false;

    public cash_amount: number = 0;
    private cash_amount_input_element: HTMLInputElement = null;

    public check_amount: number = 0;
    private check_amount_input_element: HTMLInputElement = null;
    public check_number: string = "";
    public check_number_input_element: HTMLInputElement = null;
    public paying_for: string = "";
    public paying_for_input_element: HTMLInputElement = null;
    public check_from: string = "";
    public check_from_input_element: HTMLInputElement = null;

    public add_check_button_element: HTMLButtonElement = null;
    public cancel_check_button_element: HTMLButtonElement = null;

    private payment_method_change: Function = () => { };

    private validate_money_regex: string = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";

    public control_to_render: HTMLElement = null;

    constructor(is_cash: boolean, payment_type_id: number, show_cancel: boolean = false, element_id: number, payment_method_amount_change: Function)
    {
      this.is_cash = is_cash;
      this.payment_type_id = payment_type_id;
      this.show_cancel = show_cancel;
      this.payment_method_data_id = element_id;
      this.payment_method_change = payment_method_amount_change;
      is_cash ? this.RenderCashControls() : this.RenderCheckControls();
      
    }

    private RenderCashControls()
    {
      let columns = document.createElement("div");
      columns.classList.add("columns");

      this.cash_amount_input_element = PaymentMethodData.CreateInput("tel", 15, true, "0");
      this.cash_amount_input_element.oninput = (event) =>
      {
        this.cash_amount = parseFloat((<HTMLInputElement>event.target).value.replace("$", ""));
        this.payment_method_change();
      }

      columns.appendChild(ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter"));
      this.control_to_render = columns;
    }

    private RenderCheckControls()
    {
      let columns = document.createElement("div");
      columns.classList.add("columns", "is-multiline", "check");

      this.check_amount_input_element = PaymentMethodData.CreateInput("tel", 15, true, "0");
      this.check_amount_input_element.oninput = (event) =>
      {
        this.check_amount = 0;
        let input = (<HTMLInputElement>event.target);
        let value = input.value.trim();

        if (value.length > 0)
        {
          let v = parseFloat(value);
          if (!isNaN(v)) this.check_amount = v;          
        }

        this.payment_method_change();
      }

      this.check_number_input_element = PaymentMethodData.CreateInput("text", 50, false, "Check Number");
      this.check_number_input_element.oninput = (event) =>
      {
        this.check_number = (<HTMLInputElement>event.target).value;
      }

      this.paying_for_input_element = PaymentMethodData.CreateInput("text", 500, false, "Check Paying For");
      this.paying_for_input_element.oninput = (event) =>
      {
        this.paying_for = (<HTMLInputElement>event.target).value;
      }

      this.check_from_input_element = PaymentMethodData.CreateInput("text", 500, false, "Check From");
      this.check_from_input_element.oninput = (event) =>
      {
        this.check_from = (<HTMLInputElement>event.target).value;
      }



      this.add_check_button_element = document.createElement("button");
      this.add_check_button_element.classList.add("button", "is-info", "is-medium");
      this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));


      columns.appendChild(ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter"));
      columns.appendChild(ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter"));

      if (this.show_cancel)
      {
        let buttons: Array<HTMLElement> = [];
        this.cancel_check_button_element = document.createElement("button");
        this.cancel_check_button_element.classList.add("button", "is-warning", "is-medium");
        this.cancel_check_button_element.appendChild(document.createTextNode("Cancel Check"));
        buttons.push(this.add_check_button_element);
        buttons.push(this.cancel_check_button_element);
        columns.appendChild(ControlGroup.CreateButtonlistFieldContainer(buttons, "", true, "is-one-half"));
      }
      else
      {
        columns.appendChild(ControlGroup.CreateInputFieldContainer(this.add_check_button_element, "", true, "is-one-half"));
      }

      columns.appendChild(ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half"));
      columns.appendChild(ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half"));

      this.control_to_render = columns;
    }



  }
}
