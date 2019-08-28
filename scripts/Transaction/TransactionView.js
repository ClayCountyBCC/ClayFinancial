var Transaction;
(function (Transaction) {
    class TransactionView {
        constructor() {
        }
        static Get() {
            let path = Transaction.GetPath();
            return Utilities.Get(path + "API/Transaction/Get");
        }
    }
    Transaction.TransactionView = TransactionView;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=TransactionView.js.map