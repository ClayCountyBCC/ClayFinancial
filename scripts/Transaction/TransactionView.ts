namespace Transaction
{
  interface ITransactionView
  {
    transaction_id: number;
    child_transaction_id: number;
    transaction_number: string;
    created_by_display_name: string;
    created_on: Date;
    department_id: number;
    department_name: string;
    has_been_modified: boolean;
    total_cash: number;
    total_checks: number;
    number_of_checks: number;
    transaction_type: string;
    my_transaction: boolean;
    can_modify: boolean;

  }

  export class TransactionView implements ITransactionView
  {
    public transaction_id: number;
    public child_transaction_id: number;
    public transaction_number: string;
    public created_by_display_name: string;
    public created_on: Date;
    public department_id: number;
    public department_name: string;
    public has_been_modified: boolean;
    public total_cash: number;
    public total_checks: number;
    public number_of_checks: number;
    public transaction_type: string;
    public my_transaction: boolean;
    public can_modify: boolean;

    constructor()
    {

    }

    public static Get(): Promise<Array<TransactionView>>
    {
      let path = Transaction.GetPath();
      return Utilities.Get<Array<TransactionView>>(path + "API/Transaction/Get");
    }

  }


}