//import * as React from '../../lib/react/umd/react.development';
//import React = require('react');
const Transact = () => {
    return (React.createElement("div", null, "Hey there"));
};
//const numbers = [1, 2, 4,3, 5];
//numbers.sort();
//const listItems = numbers.map((number, index) =>
//  <li key={index}>{number}</li>
//);
function ListItem(props) {
    // Correct! There is no need to specify the key here:
    return React.createElement("li", null, props.value);
}
function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) => 
    // Correct! Key should be specified inside the array.
    React.createElement(ListItem, { class: "number", key: number.toString(), value: number }));
    return (React.createElement("ul", null, listItems));
}
//export default Transact;
//# sourceMappingURL=Transaction.js.map