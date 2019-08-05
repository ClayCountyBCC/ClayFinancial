namespace Transaction.Data
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
    public payment_type_container: HTMLElement = null;
    public payment_type_element: HTMLElement = null;
    public controls: Array<Control> = [];
    public payment_methods: Array<PaymentMethodData> = [];   
    public error_text: string = "";
    private next_payment_method_id: number = 0;

    constructor(target_container: HTMLElement,
      does_tax_exempt_apply: boolean,
      payment_type_id: number,
      controls: Array<Control>)
    {
      this.payment_type_container = target_container;
      this.payment_type_id = payment_type_id;      
      this.controls = controls;
      this.does_tax_exempt_apply = does_tax_exempt_apply;

      let li = document.createElement("li");
      li.style.display = "block";

      this.RenderControls(li);      
      this.RenderPaymentMethods(li);

      this.payment_type_container.appendChild(li);
    }

    private RenderControls(target_container: HTMLLIElement)
    {
      let group_element: HTMLElement = document.createElement("div");
      group_element.classList.add("columns", "is-multiline");
      
      for (let i = 0; i < this.controls.length; i++)
      {
        let c = this.controls[i];
        let hints = c.render_hints.split(",");
        let cd = new ControlData(c, this.payment_type_id, hints);
        this.control_data.push(cd);
        if (cd.single_element !== null)
        {
          target_container.appendChild(cd.single_element);
        }
        else
        {
          if (hints.indexOf("short") !== -1 || hints.indexOf("medium") !== -1)
          {
            group_element.appendChild(cd.group_element);
            if (i + 1 === this.controls.length)
            {
              target_container.appendChild(group_element);
            }
            
          }
        }

        
      }      
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
      let check = new PaymentMethodData(false, this.payment_type_id, show_cancel, this.next_payment_method_id++);
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
        }
      }
    }

    private AddCashPaymentMethod(target_container: HTMLElement): void
    {
      let cash = new PaymentMethodData(true, this.payment_type_id, false, this.next_payment_method_id++);
      target_container.appendChild(cash.control_to_render);
      this.payment_methods.push(cash);
    }

  }
}