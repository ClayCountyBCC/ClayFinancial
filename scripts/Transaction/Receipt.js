var Transaction;
(function (Transaction) {
    class Receipt {
        constructor() {
            console.log('New Receipt', Transaction.departments);
            this.currentTransaction = new Transaction.Data.TransactionData();
        }
    }
    Transaction.Receipt = Receipt;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Receipt.js.map