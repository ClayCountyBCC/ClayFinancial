var Transaction;
(function (Transaction) {
    class Receipt {
        //receipt_view_contents
        constructor() {
            //clientside controls
            this.view_container = null;
            this.receipt_number_element = null;
            this.county_manager_element = null;
            this.created_by_element = null;
            this.created_on_element = null;
            this.received_from_element = null;
            this.receipt_department_element = null;
            console.log('New Receipt', Transaction.departments);
            this.view_container = document.getElementById("receipt_view");
            this.receipt_number_element = document.getElementById("receipt_view_number");
            this.created_by_element = document.getElementById("receipt_created_by");
            this.county_manager_element = document.getElementById("receipt_view_county_manager");
            this.created_on_element = document.getElementById("receipt_view_date");
            this.received_from_element = document.getElementById("receipt_received_from");
            this.receipt_department_element = document.getElementById("receipt_department");
            this.currentTransaction = new Transaction.Data.TransactionData("R");
        }
        ShowReceiptPreview() {
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
        CreatePaymentTypeDisplay() {
        }
    }
    Transaction.Receipt = Receipt;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Receipt.js.map