namespace Transaction
{

  export class Receipt
  {
    public currentTransaction: Transaction.Data.TransactionData

    constructor()
    {
      console.log('New Receipt', Transaction.departments);
      this.currentTransaction = new Transaction.Data.TransactionData();
    }


  }


}