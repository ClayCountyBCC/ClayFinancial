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
    Transaction.transactions = [];
    Transaction.currentReceipt = null;
    //export let currentTransactionData: Transaction.Data.TransactionData = null;
    Transaction.DepartmentControl = null;
    Transaction.DepartmentControlContainer = null;
    function Start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Department.GetDepartments()
                .then((d) => {
                Transaction.departments = d;
                console.log(d);
                Transaction.DepartmentControl = Transaction.Department.CreateDepartmentElement(Transaction.departments);
                for (let department of Transaction.departments) {
                    department.control_groups = Transaction.ControlGroup.CreateControlGroups(department.controls);
                    for (let paymentType of department.payment_types) {
                        paymentType.control_groups = Transaction.ControlGroup.CreateControlGroups(paymentType.controls);
                    }
                }
            });
            yield Transaction.Data.TransactionData.GetTransactionList()
                .then((tv) => {
                Transaction.transactions = tv;
                Transaction.Data.TransactionData.RenderTransactionList();
                console.log('transactions', Transaction.transactions);
            });
            console.log('departments', Transaction.departments);
        });
    }
    Transaction.Start = Start;
    function NewReceipt() {
        Transaction.currentReceipt = new Transaction.Receipt();
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
})(Transaction || (Transaction = {}));
//# sourceMappingURL=app.js.map