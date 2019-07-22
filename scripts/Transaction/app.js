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
    Transaction.departments = [];
    function Start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Department.GetDepartments().then((d) => {
                Transaction.departments = d;
                console.log(d);
            });
            console.log('departments', Transaction.departments);
        });
    }
    Transaction.Start = Start;
    function NewReceipt() {
    }
    Transaction.NewReceipt = NewReceipt;
    function NewDeposit() {
    }
    Transaction.NewDeposit = NewDeposit;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=app.js.map