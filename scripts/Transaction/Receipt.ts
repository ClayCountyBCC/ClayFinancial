namespace Transaction
{

  export class Receipt
  {
    public currentTransaction: Transaction.Data.TransactionData = null;
    public savedTransaction: Transaction.Data.TransactionData = null;

    //clientside controls
    public static receipt_container: string = "receipt_view";
    private view_container: HTMLElement = null;
    private receipt_number_element: HTMLElement = null;
    private county_manager_element: HTMLElement = null;
    private created_by_element: HTMLElement = null;
    private created_on_element: HTMLElement = null;
    private receipt_view_contents_element: HTMLElement = null;
    private receipt_view_totals_element: HTMLElement = null;
    private receipt_preview_controls_element: HTMLElement = null;
    private receipt_preview_cancel_button_element: HTMLButtonElement = null;
    private receipt_preview_save_button_element: HTMLButtonElement = null;
    //receipt_view_contents

    constructor(saved_transaction: Data.TransactionData = null)
    {
      this.view_container = document.getElementById(Receipt.receipt_container);
      this.receipt_number_element = document.getElementById("receipt_view_number");
      this.created_by_element = document.getElementById("receipt_created_by");
      this.county_manager_element = document.getElementById("receipt_view_county_manager");
      this.created_on_element = document.getElementById("receipt_view_date");
      this.receipt_view_contents_element = document.getElementById("receipt_view_contents");
      this.receipt_view_totals_element = document.getElementById("receipt_view_totals");
      this.currentTransaction = new Transaction.Data.TransactionData("R", saved_transaction);
      this.receipt_preview_controls_element = document.getElementById("receipt_preview_controls");
      this.receipt_preview_cancel_button_element = <HTMLButtonElement>document.getElementById("receipt_view_cancel");
      this.receipt_preview_save_button_element = <HTMLButtonElement>document.getElementById("receipt_view_save");
      this.receipt_preview_cancel_button_element.onclick = (event: Event) =>
      {
        Transaction.ViewReceiptDetail();
      }
      this.receipt_preview_save_button_element.onclick = (event: Event) =>
      {
        this.currentTransaction.SaveTransactionData();
      }
    }

    public ShowReceiptPreview(): void
    {
      let t = this.currentTransaction;

      this.UpdateReceipt(t);
      Utilities.Show(this.receipt_preview_controls_element);
    }
    
    public ShowReceipt(t: Transaction.Data.TransactionData): void
    {
      this.UpdateReceipt(t);

      Utilities.Hide(this.receipt_preview_controls_element);
    }

    private UpdateReceipt(t: Data.TransactionData):void
    {
      Transaction.ViewPrintableReceipt();
      Utilities.Set_Text(this.created_on_element, Utilities.Format_Date(t.created_on));
      Utilities.Set_Text(this.receipt_number_element, t.transaction_number);
      Utilities.Set_Text(this.created_by_element, t.created_by_display_name);
      Utilities.Set_Text(this.county_manager_element, t.county_manager_name);
      this.DisplayDepartmentControls(t);

      if (t.transaction_type == "R")
      {
        this.CreatePaymentTypeDisplay(t);
      }
      else
      {
        this.CreateTransactionViewDisplay(t);
        if (t.transaction_type === "C")
        {

        }
      }
      
    }

    private CreateTransactionViewDisplay(t: Data.TransactionData): void
    {
      Utilities.Clear_Element(this.receipt_view_contents_element);
      Utilities.Clear_Element(this.receipt_view_totals_element);
      
      for (let td of t.deposit_receipts)
      {

        this.receipt_view_contents_element.appendChild(
          this.CreateReceiptDetailRow(
            td.transaction_type + " " + td.transaction_number,
            td.total_cash_amount,
            td.total_check_amount,
            td.total_check_count));
      }
      this.receipt_view_totals_element.appendChild(
        this.CreateReceiptDetailRow(
          "Grand Total",
          t.total_cash_amount,
          t.total_check_amount,
          t.total_check_count));
    }

    private CreatePaymentTypeDisplay(t: Data.TransactionData):void
    {
      Utilities.Clear_Element(this.receipt_view_contents_element);
      Utilities.Clear_Element(this.receipt_view_totals_element);

      let check_total = 0;
      let cash_total = 0;
      let check_count = 0;
      for (let ptd of t.payment_type_data)
      {
        let payment_method_header_row_shown = false;
        let current_check_total = 0;
        let current_cash_total = 0;
        let current_check_count = 0;
        for (let cd of ptd.control_data)
        {
          this.receipt_view_contents_element.appendChild(this.CreateControlDataRow(cd.control.label, cd.value));
        }


        for (let pmd of ptd.payment_method_data)
        {
          if (pmd.cash_amount > 0)
          {
            if (!payment_method_header_row_shown)
            {
              this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeHeaderRow());
              payment_method_header_row_shown = true;
            }
            this.receipt_view_contents_element.appendChild(this.CreateCashDataRow(pmd));
          }
          else
          {
            if (pmd.check_amount > 0 || pmd.check_number.length > 0 || pmd.check_from.length > 0)
            {
              if (!payment_method_header_row_shown)
              {
                this.receipt_view_contents_element.appendChild(this.CreatePaymentTypeHeaderRow());
                payment_method_header_row_shown = true;
              }
              this.receipt_view_contents_element.appendChild(this.CreateCheckDataRow(pmd));
            }
          }
          current_cash_total += pmd.cash_amount;
          current_check_total += pmd.check_amount;
          current_check_count += pmd.check_count;
        }
        let payment_type_name: string = ptd.selected_payment_type !== undefined ? ptd.selected_payment_type.name : ptd.payment_type.name;
        this.receipt_view_contents_element.appendChild(
          this.CreatePaymentTypeRow(
            payment_type_name + " Total",
            current_cash_total,
            current_check_total,
            current_check_count));

        check_total += current_check_total;
        cash_total += current_cash_total;
        check_count += current_check_count;
      }

      this.receipt_view_totals_element.appendChild(
        this.CreatePaymentTypeRow(
          "Grand Total",
          cash_total,
          check_total,
          check_count));
    }

    private CreatePaymentTypeRow(
      payment_type: string,
      cash_amount: number,
      check_amount: number,
      check_count: number): HTMLTableRowElement
    {
      return this.CreateReceiptDetailRow(payment_type, cash_amount, check_amount, check_count);
    }

    private CreateControlDataRow(label: string, value: string) :HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("td", label, "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", value, "has-text-left", "", 2));
      tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 4));
      return tr;
    }

    private CreatePaymentTypeHeaderRow(): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("th", "Check Number", "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("th", "Check From", "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("th", "Type", "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 4));
      return tr;
    }

    private CreateCheckDataRow(pmd: Data.PaymentMethodData): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("td", pmd.check_number, "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", pmd.check_from, "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", "Check", "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("td", pmd.check_count.toString(), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.check_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", "", ""));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.check_amount), "has-text-right"));
      return tr;
    }

    private CreateCashDataRow(pmd: Data.PaymentMethodData): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 2));
      //tr.appendChild(Utilities.CreateTableCell("td", pmd.check_from, "has-text-left"));
      tr.appendChild(Utilities.CreateTableCell("td", "Cash", "has-text-centered"));
      tr.appendChild(Utilities.CreateTableCell("td", "", "", "", 2));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.cash_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(pmd.cash_amount), "has-text-right"));
      return tr;
    }



    private CreateReceiptDetailRow(
      label: string,
      cash_amount: number,
      check_amount: number,
      check_count: number): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("th", label, "has-text-left", "", 3));
      tr.appendChild(Utilities.CreateTableCell("th", check_count.toString(), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(check_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(cash_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("th", Utilities.Format_Amount(cash_amount + check_amount), "has-text-right"));
      tr.classList.add("payment_type_end");
      return tr;
    }

    private DisplayDepartmentControls(t: Data.TransactionData): void
    {
      let container = document.getElementById("receipt_department_controls");
      Utilities.Clear_Element(container);
      let df = document.createDocumentFragment();
      df.appendChild(this.CreatePrintableControl("is-half", "Received From", t.received_from));
      df.appendChild(this.CreatePrintableControl("is-half", "Department", t.department_name));
      for (let cd of t.department_control_data)
      {
        df.appendChild(this.CreateDepartmentControl(cd));
      }
      container.appendChild(df);
    }

    private CreateDepartmentControl(control_data: Data.ControlData): HTMLElement
    {
      let size = "";
      console.log("create departmental control", control_data);

      let c = control_data.control !== null ? control_data.control : control_data.selected_control;
      if (c.render_hints.length > 0) size = c.render_hints;
      return this.CreatePrintableControl(size, c.label, control_data.value);
    }

    private CreatePrintableControl(size: string, label: string, value: string): HTMLElement
    {
      let e: HTMLElement = document.createElement("div");
      e.classList.add("field", "column", size);

      let l = document.createElement("label");
      l.classList.add("label", Transaction.app_input_size);
      l.appendChild(document.createTextNode(label));
      e.appendChild(l);

      let control = document.createElement("p");
      control.classList.add("control");
      e.appendChild(control);

      let input = document.createElement("input");
      input.classList.add("input", "is-static", Transaction.app_input_size);
      input.value = value;
      input.readOnly = true;
      control.appendChild(input);

      return e;
    }

  }


}