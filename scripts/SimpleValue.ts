namespace Utilities
{
  "use strict";

  interface ISimpleValue
  {
    label: string;
    value: string;
  }
  export class SimpleValue implements ISimpleValue
  {

    public label: string = "";
    public value: string = "";

    constructor() { }
  }

}