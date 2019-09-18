namespace Transaction
{

  export class Receipt
  {
    public currentTransaction: Transaction.Data.TransactionData

    //clientside controls
    private view_container: HTMLElement = null;
    private receipt_number_element: HTMLElement = null;
    private county_manager_element: HTMLElement = null;
    private created_by_element: HTMLElement = null;
    private created_on_element: HTMLElement = null;
    private received_from_element: HTMLInputElement = null;
    private receipt_department_element: HTMLInputElement = null;
    private receipt_view_contents_element: HTMLElement = null;
    private receipt_view_totals_element: HTMLElement = null;
    private receipt_preview_controls_element: HTMLElement = null;
    private receipt_preview_cancel_button_element: HTMLButtonElement = null;
    private receipt_preview_save_button_element: HTMLButtonElement = null;
    //receipt_view_contents

    constructor()
    {
      console.log('New Receipt', Transaction.departments);
      this.view_container = document.getElementById("receipt_view");
      this.receipt_number_element = document.getElementById("receipt_view_number");
      this.created_by_element = document.getElementById("receipt_created_by");
      this.county_manager_element = document.getElementById("receipt_view_county_manager");
      this.created_on_element = document.getElementById("receipt_view_date");
      this.received_from_element = <HTMLInputElement>document.getElementById("receipt_received_from");
      this.receipt_department_element = <HTMLInputElement>document.getElementById("receipt_department");
      this.receipt_view_contents_element = document.getElementById("receipt_view_contents");
      this.receipt_view_totals_element = document.getElementById("receipt_view_totals");
      this.currentTransaction = new Transaction.Data.TransactionData("R");
      this.receipt_preview_controls_element = document.getElementById("receipt_preview_controls");
      this.receipt_preview_cancel_button_element = <HTMLButtonElement>document.getElementById("receipt_view_cancel");
      this.receipt_preview_save_button_element = <HTMLButtonElement>document.getElementById("receipt_view_save");
      this.receipt_preview_cancel_button_element.onclick = (event: Event) =>
      {
        Utilities.Hide(this.view_container);
        Utilities.Show(Data.TransactionData.base_container);
      }
      this.receipt_preview_save_button_element.onclick = (event: Event) =>
      {
        this.currentTransaction.SaveTransactionData();
      }
    }


    public ShowReceiptPreview():void
    {
      let t = this.currentTransaction;
      Utilities.Hide(Data.TransactionData.base_container);
      Utilities.Show(this.view_container);
      Utilities.Set_Text(this.created_on_element, Utilities.Format_Date(new Date()));
      Utilities.Set_Text(this.receipt_number_element, "PREVIEW");
      Utilities.Set_Text(this.created_by_element, "PREVIEW");
      Utilities.Set_Text(this.county_manager_element, "PREVIEW");
      Utilities.Set_Value(this.received_from_element, t.received_from.toUpperCase());
      Utilities.Set_Value(this.receipt_department_element, t.selected_department.name.toUpperCase());
      this.CreatePaymentTypeDisplay();
      Utilities.Show(this.receipt_preview_controls_element);
    }

    private CreatePaymentTypeDisplay():void
    {
      Utilities.Clear_Element(this.receipt_view_contents_element);
      Utilities.Clear_Element(this.receipt_view_totals_element);

      let check_total = 0;
      let cash_total = 0;
      let check_count = 0;
      for (let ptd of this.currentTransaction.payment_type_data)
      {
        let current_check_total = 0;
        let current_cash_total = 0;
        let current_check_count = 0;
        for (let pmd of ptd.payment_method_data)
        {
          current_cash_total += pmd.cash_amount;
          current_check_total += pmd.check_amount;
          current_check_count += pmd.check_count;
        }
        this.receipt_view_contents_element.appendChild(
          this.CreatePaymentTypeRow(
            ptd.selected_payment_type.name,
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
      let tr = document.createElement("tr");
      tr.appendChild(Utilities.CreateTableCell("td", payment_type, "has-text-left"));
      tr.appendChild(Utilities.CreateTableCell("td", check_count.toString(), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(check_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(cash_amount), "has-text-right"));
      tr.appendChild(Utilities.CreateTableCell("td", Utilities.Format_Amount(cash_amount + check_amount), "has-text-right"));
      return tr;
    }



  }


}