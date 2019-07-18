var Transaction;
(function (Transaction) {
    class Department {
        constructor() {
            this.organization = "";
            this.payment_types = [];
            this.controls = [];
        }
        Constructor() { }
        static GetPath() {
            let path = "/";
            let i = window.location.pathname.toLowerCase().indexOf("/clayfinancial");
            if (i == 0) {
                path = "/clayfinancial/";
            }
            return path;
        }
        static GetDepartments() {
            let path = Department.GetPath();
            Promise.resolve(Utilities.Get(path + "API/Transaction/Departments")
                .then(function (departments) {
                console.log("departments", departments);
                Transaction.departments = departments;
                console.log('Transaction.departments', Transaction.departments);
            }, function (e) {
                console.log('error getting departments', e);
                Transaction.departments = [];
            }));
        }
    }
    Transaction.Department = Department;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Department.js.map