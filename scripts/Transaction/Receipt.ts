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

      this.currentTransaction = new Transaction.Data.TransactionData();

    }


    public ShowReceiptPreview()
    {
      let t = this.currentTransaction;
      Utilities.Hide(this.currentTransaction.base_container);
      Utilities.Show(this.view_container);
      Utilities.Set_Text(this.created_on_element, Utilities.Format_Date(new Date()));
      Utilities.Set_Text(this.receipt_number_element, "PREVIEW");
      Utilities.Set_Text(this.created_by_element, "PREVIEW");
      Utilities.Set_Text(this.county_manager_element, "PREVIEW");
      Utilities.Set_Value(this.received_from_element, t.received_from.toUpperCase());
      Utilities.Set_Value(this.receipt_department_element, t.selected_department.name.toUpperCase());
    }

  }


}