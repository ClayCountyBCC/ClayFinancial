var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Transaction;
(function (Transaction) {
    Transaction.error_scrolled = false;
    Transaction.departments = [];
    Transaction.payment_types = [];
    Transaction.controls = [];
    Transaction.transactions = [];
    Transaction.currentReceipt = null;
    //export let currentTransactionData: Transaction.Data.TransactionData = null;
    Transaction.DepartmentControl = null;
    Transaction.DepartmentControlContainer = null;
    function Start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Department.GetDepartments()
                .then((d) => {
                Transaction.payment_types = [];
                Transaction.controls = [];
                Transaction.departments = d;
                console.log(d);
                Transaction.DepartmentControl = Transaction.Department.CreateDepartmentElement(Transaction.departments);
                for (let department of Transaction.departments) {
                    let payment_type_ids = Transaction.payment_types.map((pt) => { return pt.payment_type_id; });
                    Transaction.payment_types = Transaction.payment_types.concat(department.payment_types.filter((pt) => { return payment_type_ids.indexOf(pt.payment_type_id) === -1; }));
                    let department_control_ids = department.controls.map((c) => { return c.control_id; });
                    Transaction.controls = Transaction.controls.concat(department.controls.filter((c) => { return department_control_ids.indexOf(c.control_id) === -1; }));
                    department.control_groups = Transaction.ControlGroup.CreateControlGroups(department.controls);
                    for (let paymentType of department.payment_types) {
                        paymentType.control_groups = Transaction.ControlGroup.CreateControlGroups(paymentType.controls);
                    }
                }
                for (let payment_type of Transaction.payment_types) {
                    let control_ids = Transaction.controls.map((c) => { return c.control_id; });
                    Transaction.controls = Transaction.controls.concat(payment_type.controls.filter((c) => { return control_ids.indexOf(c.control_id) === -1; }));
                }
                console.log("all payment types", Transaction.payment_types);
                console.log("all controls", Transaction.controls);
            });
            yield Transaction.Data.TransactionData.GetTransactionList(1)
                .then((tv) => {
                Transaction.transactions = tv;
                Transaction.Data.TransactionData.RenderTransactionList();
                console.log('transactions', Transaction.transactions);
            });
            console.log('departments', Transaction.departments);
        });
    }
    Transaction.Start = Start;
    function ShowReceipt(transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Data.TransactionData.GetSpecificTransaction(transaction_id)
                .then((transaction) => {
                console.log('transaction to show', transaction);
                Transaction.currentReceipt = new Transaction.Receipt(transaction);
                Transaction.currentReceipt.ShowReceipt(transaction);
            });
        });
    }
    Transaction.ShowReceipt = ShowReceipt;
    function ShowReceiptDetail(transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Data.TransactionData.GetSpecificTransaction(transaction_id)
                .then((transaction) => {
                console.log('transaction to show', transaction);
                Transaction.currentReceipt = new Transaction.Receipt(transaction);
                Utilities.Hide(Transaction.Data.TransactionData.transaction_view_container);
                Utilities.Show(Transaction.Data.TransactionData.action_container);
                Utilities.Hide(Transaction.Receipt.receipt_container);
            });
        });
    }
    Transaction.ShowReceiptDetail = ShowReceiptDetail;
    function NewReceipt() {
        Transaction.currentReceipt = new Transaction.Receipt();
        Utilities.Hide(Transaction.Data.TransactionData.transaction_view_container);
        Utilities.Show(Transaction.Data.TransactionData.action_container);
        Utilities.Hide(Transaction.Receipt.receipt_container);
    }
    Transaction.NewReceipt = NewReceipt;
    function NewDeposit() {
    }
    Transaction.NewDeposit = NewDeposit;
    function GetPath() {
        let path = "/";
        let i = window.location.pathname.toLowerCase().indexOf("/clayfinancial");
        if (i == 0) {
            path = "/clayfinancial/";
        }
        return path;
    }
    Transaction.GetPath = GetPath;
    function FindPaymentType(payment_type_id) {
        let filtered = Transaction.payment_types.filter((pt) => pt.payment_type_id === payment_type_id);
        return (filtered.length === 1) ? filtered[0] : null;
    }
    Transaction.FindPaymentType = FindPaymentType;
    function FindControl(control_id) {
        let filtered = Transaction.controls.filter((c) => c.control_id === control_id);
        return (filtered.length === 1) ? filtered[0] : null;
    }
    Transaction.FindControl = FindControl;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=app.js.map