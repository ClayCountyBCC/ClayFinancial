namespace Transaction.Data
{
  interface IPaymentTypeData
  {
    transaction_payment_type_id: number;
    payment_type_id: number;
    payment_type_index: number
    transaction_id: number;
    payment_type: PaymentType;
    control_data: Array<ControlData>;
    payment_method_data: Array<PaymentMethodData>;
    error_text: string;
    added_after_save: boolean;
  }

  export class PaymentTypeData implements IPaymentTypeData
  {
    public transaction_payment_type_id: number = -1;
    public transaction_id: number = -1;
    public payment_type_id: number = -1;
    public payment_type_index: number = -1;
    public payment_type: PaymentType = null;    
    public control_data: Array<ControlData> = [];    
    public added_after_save: boolean = false;
    public error_text: string = "";
    public payment_method_data: Array<PaymentMethodData> = [];

    //clientside controls
    private payment_type_parent_container: HTMLElement = null;
    public payment_type_container: HTMLElement = null;    
    public selected_payment_type: PaymentType = null; // this is used by the new receipt process.  payment_type is used when you view an existing transaction.
    public cancel_payment_type_button: HTMLElement = null;
    public add_another_payment_type_button: HTMLElement = null;
    public save_button: HTMLElement = null;    
    public control_groups: Array<ControlGroup> = [];
    private total_cash_element: HTMLElement = null;
    private total_checks_element: HTMLElement = null;
    private total_number_checks_element: HTMLElement = null;
    private next_payment_method_id: number = 0;

    constructor(
      payment_type: PaymentType,
      target_container: HTMLElement,
      payment_type_index: number,
      saved_payment_type_data: PaymentTypeData = null)
    {
      this.selected_payment_type = payment_type;
      this.payment_type_parent_container = target_container;
      this.payment_type_id = payment_type.payment_type_id;

      this.payment_type_index = saved_payment_type_data !== null ? saved_payment_type_data.payment_type_index : payment_type_index;
           
      let li = document.createElement("li");
      li.style.display = "block";

      this.payment_type_container = li;

      if (saved_payment_type_data !== null)
      {
        this.RenderSavedPaymentTypeControls(li, saved_payment_type_data);
        this.RenderSavedPaymentMethods(li, saved_payment_type_data);
      }
      else
      {
        this.RenderPaymentTypeControls(li);
        this.RenderPaymentMethods(li);
      }
      this.RenderPaymentTypeFooter(li);      
      if (saved_payment_type_data !== null) this.SavedPaymentMethodDataCalculateTotals(saved_payment_type_data.payment_method_data);

      this.payment_type_parent_container.appendChild(li);
    }

    public Validate(): boolean
    {
      let is_valid = true;
      for (let ct of this.control_data)
      {
        let v = ct.Validate();
        if (!v && is_valid) is_valid = false;
      }
      for (let pmt of this.payment_method_data)
      {
        let v = pmt.Validate();
        if (!v && is_valid) is_valid = false;
      }

      return is_valid;
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

      items.push(new Utilities.LevelItem("Total Cash", "", this.total_cash_element, "has-text-centered"));
      items.push(new Utilities.LevelItem("Total Checks", "", this.total_checks_element, "has-text-centered"));
      items.push(new Utilities.LevelItem("# Checks", "", this.total_number_checks_element, "has-text-centered"));

      this.add_another_payment_type_button = this.CreateHeaderButton("Add", "is-info");
      this.cancel_payment_type_button = this.CreateHeaderButton("Cancel", "is-warning");
      this.save_button = this.CreateHeaderButton("Preview & Save", "is-success");

      let buttons = document.createElement("div");
      buttons.classList.add("buttons");
      buttons.appendChild(this.add_another_payment_type_button);
      buttons.appendChild(this.cancel_payment_type_button);
      buttons.appendChild(this.save_button);
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
      let check = new PaymentMethodData(false, show_cancel, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
      target_container.appendChild(check.control_to_render)
      this.payment_method_data.push(check);
      check.add_check_button_element.onclick = (event: Event) =>
      {
        this.AddCheckPaymentMethod(target_container, true);
      }
      if (show_cancel)
      {
        check.cancel_check_button_element.onclick = (event: Event) =>
        {
          target_container.removeChild(check.control_to_render);
          let indextoremove = this.payment_method_data.findIndex(function (j) { return j.payment_method_data_id === check.payment_method_data_id });
          if (indextoremove > -1) this.payment_method_data.splice(indextoremove, 1);
          check = null;
          this.PaymentMethodDataChanged();
        }
      }
    }

    private AddCashPaymentMethod(target_container: HTMLElement): void
    {
      let cash = new PaymentMethodData(true, false, this.next_payment_method_id++, () => { this.PaymentMethodDataChanged(); });
      target_container.appendChild(cash.control_to_render);
      this.payment_method_data.push(cash);
    }

    private PaymentMethodDataChanged():void
    {
      let cash = 0;
      let checks = 0;
      let number_checks = 0;
      for (let pmt of this.payment_method_data)
      {
        cash += pmt.cash_amount;
        checks += pmt.check_amount;
        number_checks += pmt.check_count;
      }
      this.total_cash_element.innerHTML = Utilities.Format_Amount(cash);
      this.total_checks_element.innerHTML = Utilities.Format_Amount(checks);
      this.total_number_checks_element.innerHTML = number_checks.toString();
    }

    private SavedPaymentMethodDataCalculateTotals(payment_method_data: Array<PaymentMethodData>): void
    {
      let cash = 0;
      let checks = 0;
      let number_checks = 0;
      for (let pmt of payment_method_data)
      {
        cash += pmt.cash_amount;
        checks += pmt.check_amount;
        number_checks += pmt.check_count;
      }
      this.total_cash_element.innerHTML = Utilities.Format_Amount(cash);
      this.total_checks_element.innerHTML = Utilities.Format_Amount(checks);
      this.total_number_checks_element.innerHTML = number_checks.toString();
    }
    /*
     * Render functions that are for Saved Transactions 
     * 
     */

    private RenderSavedPaymentTypeControls(target_container: HTMLLIElement, saved_payment_type_data: PaymentTypeData)
    {
      this.control_groups = ControlGroup.CreateSavedControlGroups(saved_payment_type_data.control_data);
      
      for (let group of this.control_groups)
      {
        this.control_data.push(...group.CreateControlData(target_container, false));
      }
    }

    private RenderSavedPaymentMethods(target_container: HTMLLIElement, saved_payment_type_data: PaymentTypeData)
    {
      let fieldset = document.createElement("fieldset");
      let legend = document.createElement("legend");
      legend.classList.add("label");
      legend.appendChild(document.createTextNode("Payment Methods"));
      fieldset.appendChild(legend);
      let cash_payment_method_data: PaymentMethodData = null;
      let check_payment_method_data: Array<PaymentMethodData> = [];
      let payment_method_data_copy: Array<PaymentMethodData> = [...saved_payment_type_data.payment_method_data];
      do
      {
        let pmd = payment_method_data_copy.shift();

        if (pmd.check_amount > 0 ||
          pmd.check_number.length > 0 ||
          pmd.check_count > 0 ||
          pmd.check_from.length > 0 ||
          pmd.paying_for.length > 0)
        {
          check_payment_method_data.push(pmd);
        }
        else
        {
          if (pmd.cash_amount > 0 || cash_payment_method_data === null)
          {
            cash_payment_method_data = pmd;
          }
          else
          {
            check_payment_method_data.push(pmd);
          }
        }

      } while (payment_method_data_copy.length > 0);

      this.AddSavedCashPaymentMethod(fieldset, cash_payment_method_data);

      for (let cpmd of check_payment_method_data)
      {
        this.AddSavedCheckPaymentMethod(fieldset, cpmd);
      }
      target_container.appendChild(fieldset);
    }

    private AddSavedCheckPaymentMethod(target_container: HTMLElement, payment_method_data: PaymentMethodData): void
    {
      let check = new PaymentMethodData(false, false, this.next_payment_method_id++, null, payment_method_data);
      target_container.appendChild(check.control_to_render)
      this.payment_method_data.push(check);
      check.add_check_button_element.onclick = (event: Event) =>
      {
        this.AddCheckPaymentMethod(target_container, true, );
      }
    }

    private AddSavedCashPaymentMethod(target_container: HTMLElement, payment_method_data: PaymentMethodData): void
    {
      let cash = new PaymentMethodData(true, false, this.next_payment_method_id++, null, payment_method_data);
      target_container.appendChild(cash.control_to_render);
      this.payment_method_data.push(cash);
    }

  }
}