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
    
    private check_number_input_element: HTMLInputElement = null;
    private check_number_input_element_container: HTMLElement = null;
    
    private paying_for_input_element: HTMLInputElement = null;
    private paying_for_input_element_container: HTMLElement = null;
    
    private check_from_input_element: HTMLInputElement = null;
    private check_from_input_element_container: HTMLElement = null;

    public add_check_button_element: HTMLButtonElement = null;
    public cancel_check_button_element: HTMLButtonElement = null;

    private payment_method_change: Function = () => { };

    private validate_money_regex: string = "(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$";

    public control_to_render: HTMLElement = null;

    constructor(is_cash: boolean, show_cancel: boolean = false, element_id: number, payment_method_amount_change: Function)
    {
      this.is_cash = is_cash;
      this.show_cancel = show_cancel;
      this.payment_method_data_id = element_id;
      this.payment_method_change = payment_method_amount_change;
      is_cash ? this.RenderCashControls() : this.RenderCheckControls();
      
    }

    public Validate():boolean
    {
      if (this.is_cash) return this.ValidateCash();

      return this.ValidateCheck();
    }

    private ValidateCash(): boolean
    {
      let input = this.cash_amount_input_element;
      let e = this.ValidateNumericAmount(input);
      ControlGroup.UpdateInputError(this.cash_amount_input_element, this.cash_amount_input_element_container, e);
      return e.length === 0;
    }

    private ValidateNumericAmount(input: HTMLInputElement): string
    {
      if (input.value.length === 0)
      {
        return "You must enter a number. (No commas or $ allowed).";        
      }

      if (input.valueAsNumber === NaN)
      {
        return "Please enter Numbers and Decimal points only.";
      }

      if (input.valueAsNumber < 0)
      {
        return "Negative numbers are not allowed.";
      }

      let i = input.value.split(".");
      if (i.length === 2)
      {
        if (i[1].length > 2)
        {
          return "Too many digits after the decimal place. Amounts are limited to 2 digits after the decimal place.";
        }
      }
      return "";
    }

    private ValidateCheck(): boolean
    {
      let is_valid = true;

      let v = this.ValidateCheckAmount();
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
      let input = this.check_amount_input_element;
      let e = this.ValidateNumericAmount(input);
      ControlGroup.UpdateInputError(this.check_amount_input_element, this.check_amount_input_element_container, e);
      return e.length === 0;
    }

    private ValidateCheckNumber(): boolean
    {
      let input = this.check_number_input_element;
      let e = "";
      if (input.value.length > 0 && this.check_amount === 0)
      {
        e = "This field should only be used if a check is entered.";
      }
      if (input.value.length === 0 && this.check_amount > 0)
      {
        e = "A check number is required when you enter a check amount.";
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
        e = "This field should only be used if a check is entered.";
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
        e = "This field should only be used if a check is entered.";
      }
      if (input.value.length === 0 && this.check_amount > 0)
      {
        e = "This field is required if you enter a check amount.";
      }
      if (input.value.length > 500)
      {
        e = "This field can be at most 500 characters long.";
      }

      ControlGroup.UpdateInputError(this.check_from_input_element, this.check_from_input_element_container, e);
      return e.length === 0;
    }

    private RenderCashControls()
    {
      let columns = document.createElement("div");
      columns.classList.add("columns");

      this.cash_amount_input_element = ControlGroup.CreateInput("number", 15, true, "0");
      this.cash_amount_input_element.oninput = (event) =>
      {
        this.cash_amount = 0;

        if (this.ValidateCash())
        {
          this.cash_amount = this.cash_amount_input_element.valueAsNumber;
        }

        this.payment_method_change();
      }
      this.cash_amount_input_element_container = ControlGroup.CreateInputFieldContainer(this.cash_amount_input_element, "Cash Amount", true, "is-one-quarter");
      columns.appendChild(this.cash_amount_input_element_container);
      this.control_to_render = columns;
    }

    private RenderCheckControls()
    {
      let columns = document.createElement("div");
      columns.classList.add("columns", "is-multiline", "check");

      this.check_amount_input_element = ControlGroup.CreateInput("number", 15, true, "0");
      this.check_amount_input_element.oninput = (event) =>
      {
        this.check_amount = 0;

        if (this.ValidateCheckAmount())
        {
          this.check_amount = this.check_amount_input_element.valueAsNumber;
        }

        this.payment_method_change();
      }

      this.check_number_input_element = ControlGroup.CreateInput("text", 50, false, "Check Number");
      this.check_number_input_element.oninput = (event) =>
      {
        if (this.ValidateCheckNumber())
        {
          this.check_number = (<HTMLInputElement>event.target).value;
        }
        
      }

      this.paying_for_input_element = ControlGroup.CreateInput("text", 500, false, "Check Paying For");
      this.paying_for_input_element.oninput = (event) =>
      {
        if (this.ValidatePayingFor())
        {
          this.paying_for = (<HTMLInputElement>event.target).value;
        }
      }

      this.check_from_input_element = ControlGroup.CreateInput("text", 500, false, "Check From");
      this.check_from_input_element.oninput = (event) =>
      {
        if (this.ValidateCheckFrom())
        {
          this.check_from = (<HTMLInputElement>event.target).value;
        }
      }



      this.add_check_button_element = document.createElement("button");
      this.add_check_button_element.classList.add("button", "is-info", "is-medium");
      this.add_check_button_element.appendChild(document.createTextNode("Add Another Check"));

      this.check_amount_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_amount_input_element, "Check Amount", true, "is-one-quarter");

      columns.appendChild(this.check_amount_input_element_container);
      this.check_number_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_number_input_element, "Check Number", true, "is-one-quarter");
      columns.appendChild(this.check_number_input_element_container);

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
      this.paying_for_input_element_container = ControlGroup.CreateInputFieldContainer(this.paying_for_input_element, "Paying For", true, "is-half");
      columns.appendChild(this.paying_for_input_element_container);
      this.check_from_input_element_container = ControlGroup.CreateInputFieldContainer(this.check_from_input_element, "Check From", true, "is-half");
      columns.appendChild(this.check_from_input_element_container);

      this.control_to_render = columns;
    }



  }
}
