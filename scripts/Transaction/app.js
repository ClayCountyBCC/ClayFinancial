(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../lib/react/umd/react.development", "../../lib/react-dom/umd/react-dom.development", "./Transaction"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //declare var ReactDOM: any;
    const React = require("../../lib/react/umd/react.development");
    const react_dom_development_1 = require("../../lib/react-dom/umd/react-dom.development");
    const Transaction_1 = require("./Transaction");
    //  //let departments: Array<Transaction.Department> = [];
    //    //Transaction.Department.GetDepartments();    
    //console.log('Start');    
    react_dom_development_1.render(React.createElement(Transaction_1.default, null), document.getElementById("root"));
});
//# sourceMappingURL=app.js.map