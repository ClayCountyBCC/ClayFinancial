

//declare var ReactDOM: any;
//import * as React from '../../lib/react/umd/react.development';
//import * as ReactDOM from '../../lib/react-dom/umd/react-dom.development';
//import * as React from '../../lib/react/umd/react.development';
//import React = require('react');
//import ReactDOM = require('react-dom');
//import * as Transact from './Transaction';


namespace Transaction
{
  export let departments: Array<Department> = [];

  
  Transaction.Department.GetDepartments();  
  
  ReactDOM.render(<Transact count={Transaction.departments.length} />, document.getElementById("root"));




}






