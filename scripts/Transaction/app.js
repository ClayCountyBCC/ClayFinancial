//declare var ReactDOM: any;
//import * as React from '../../lib/react/umd/react.development';
//import * as ReactDOM from '../../lib/react-dom/umd/react-dom.development';
//import * as React from '../../lib/react/umd/react.development';
//import React = require('react');
//import ReactDOM = require('react-dom');
//import * as Transact from './Transaction';
var Transaction;
(function (Transaction) {
    Transaction.departments = [];
    Transaction.Department.GetDepartments();
    ReactDOM.render(React.createElement(Transact, { count: Transaction.departments.length }), document.getElementById("root"));
})(Transaction || (Transaction = {}));
//# sourceMappingURL=app.js.map