//import * as React from '../../lib/react/umd/react.development';
//import React = require('react');

const Transact: React.FunctionComponent<{ count: number} > = (props) =>
{
  return (
    <div>
      {props.count}
    </div>
  );
}


//const numbers = [1, 2, 4,3, 5];
//numbers.sort();

//const listItems = numbers.map((number, index) =>
//  <li key={index}>{number}</li>
//);


function ListItem(props)
{
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props)
{
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem class="number" key={number.toString()}
      value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

//export default Transact;