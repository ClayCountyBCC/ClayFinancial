﻿namespace Transaction.Data
{
  interface IPaymentTypeData
  {
    transaction_payment_type_id: number;
    payment_type_id: number;
    payment_type_index: number
    transaction_id: number;
    tax_exempt: boolean;
    does_tax_exempt_apply: boolean;
    control_data: Array<ControlData>;
    payment_methods: Array<PaymentMethodData>;
    error_text: string;
  }

  export class PaymentTypeData implements IPaymentTypeData
  {
    public transaction_payment_type_id: number = -1;
    public payment_type_id: number = -1;
    public payment_type_index: number = -1;
    public transaction_id: number = -1;
    public does_tax_exempt_apply: boolean = false;
    public tax_exempt: boolean = false;
    public control_data: Array<ControlData> = [];
    public payment_type_parent_container: HTMLElement = null;
    public payment_type_container: HTMLElement = null;    
    public payment_methods: Array<PaymentMethodData> = [];
    public selected_payment_type: PaymentType = null;
    public cancel_payment_type_button: HTMLElement = null;
    public add_another_payment_type_button: HTMLElement = null;
    public ready_to_save_button: HTMLElement = null;
    public total_cash_element: HTMLElement = null;
    public total_checks_element: HTMLElement = null;
    public total_number_checks_element: HTMLElement = null;
    public error_text: string = "";
    private next_payment_method_id: number = 0;

    constructor(
      payment_type: PaymentType,
      target_container: HTMLElement,
      payment_type_index: number)
    {
      this.selected_payment_type = payment_type;
      this.payment_type_parent_container = target_container;
      this.payment_type_id = payment_type.payment_type_id;      
      this.payment_type_index = payment_type_index;
      //this.controls = payment_type.controls;
      this.does_tax_exempt_apply = payment_type.does_tax_exempt_apply;

      let li = document.createElement("li");
      li.style.display = "block";

      this.payment_type_container = li;

      this.RenderPaymentTypeControls(li);      
      this.RenderPaymentMethods(li);
      this.RenderPaymentTypeFooter(li);
      this.payment_type_parent_container.appendChild(li);
    }

    private RenderPaymentTypeControls(target_container: HTMLLIElement)
    {
      for (let group of this.selected_payment_type.control_groups)
      {
        this.control_data.push(...group.CreateControlData(target_container));
      }
    }

    private CreateHeaderButton(label: string, ...classes: Array<string>): HTMLButtonElement
    {
      let button = document.createElement("button");
      button.appendChild(document.createTextNode(label));
      button.classList.add("button", ...classes);
      return button;
    }

    private RenderPaymentTypeFooter(target_container: HTMLLIElement):void
    {
      let pt = this.selected_payment_type.name;
      let items : Array < Utilities.LevelItem > =[];
      this.total_cash_element = document.createElement("span");
      this.total_cash_element.classList.add("title");
      this.total_cash_element.appendChild(document.createTextNode("$0.00"));

      this.total_checks_element = document.createElement("span");
      this.total_checks_element.classList.add("title");
      this.total_checks_element.appendChild(document.createTextNode("$0.00"));

      this.total_number_checks_element = document.createElement("span");
      this.total_number_checks_element.classList.add("title");
      this.total_number_checks_element.appendChild(document.createTextNode("0"));

      //items.push(new Utilities.LevelItem("", pt, null, "has-text-left"));
      items.push(new Utilities.LevelItem("Total Cash", "", this.total_cash_element, "has-text-centered"));
      items.push(new Utilities.LevelItem("Total Checks", "", this.total_checks_element, "has-text-centered"));
      items.push(new Utilities.LevelItem("# Checks", "", this.total_number_checks_element, "has-text-centered"));

      this.add_another_payment_type_button = this.CreateHeaderButton("Add", "is-info");
      this.cancel_payment_type_button = this.CreateHeaderButton("Cancel", "is-warning");
      this.ready_to_save_button = this.CreateHeaderButton("Ready to Save", "is-success");

      let buttons = document.createElement("div");
      buttons.classList.add("buttons");
      buttons.appendChild(this.add_another_payment_type_button);
      buttons.appendChild(this.cancel_payment_type_button);
      buttons.appendChild(this.ready_to_save_button);
      let right: Array<Utilities.LevelItem> = [];

      right.push(new Utilities.LevelItem("", "", buttons, "has-text-centered"));

      let heading = Utilities.Create_Centered_Level(items, [], right);
      heading.classList.add("has-background-grey-lighter");

      target_container.appendChild(heading);
    }

    private RenderPaymentMethods(target_container: HTMLLIElement)
    {
      let fieldset = document.createElement("fieldset");
      let legend = document.createElement("legend");
      legend.classList.add("label");
      legend.appendChild(document.createTextNode("Payment Methods"));
      fieldset.appendChild(legend);
      this.AddCashPaymentMethod(fieldset);
      this.AddCheckPaymentMethod(fieldset);

      target_container.appendChild(fieldset);
    }

    private AddCheckPaymentMethod(target_container: HTMLElement, show_cancel: boolean = false): void
    {
      let check = new PaymentMethodData(false, this.payment_type_id, show_cancel, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
      target_container.appendChild(check.control_to_render)
      this.payment_methods.push(check);
      check.add_check_button_element.onclick = (event: Event) =>
      {
        this.AddCheckPaymentMethod(target_container, true);
      }
      if (show_cancel)
      {
        check.cancel_check_button_element.onclick = (event: Event) =>
        {
          target_container.removeChild(check.control_to_render);
          let indextoremove = this.payment_methods.findIndex(function (j) { return j.payment_method_data_id === check.payment_method_data_id });
          if (indextoremove > -1) this.payment_methods.splice(indextoremove, 1);
          check = null;
          this.PaymentMethodDataChanged();
        }
      }
    }

    private AddCashPaymentMethod(target_container: HTMLElement): void
    {
      let cash = new PaymentMethodData(true, this.payment_type_id, false, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
      target_container.appendChild(cash.control_to_render);
      this.payment_methods.push(cash);
    }

    private PaymentMethodDataChanged():void
    {
      let cash = 0;
      let checks = 0;
      let number_checks = 0;
      for (let pmt of this.payment_methods)
      {
        cash += pmt.cash_amount;
        checks += pmt.check_amount;
        if (pmt.check_amount > 0)
        {
          number_checks += 1;
        }
      }
      this.total_cash_element.innerHTML = Utilities.Format_Amount(cash);
      this.total_checks_element.innerHTML = Utilities.Format_Amount(checks);
      this.total_number_checks_element.innerHTML = number_checks.toString();
    }

  }
}