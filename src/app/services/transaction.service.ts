import {Injectable} from '@angular/core';
import {categoryOptions, ITransaction, type} from "../model/model";

@Injectable({
  providedIn: 'root'
})

export class TransactionService
{
  readonly transactions: Array<ITransaction> = [];
  constructor() {
    //Dummy data
    this.transactions = [
      {title: "Shopify", id:1, amount:500, transactionType:type.income, category:categoryOptions.Freelancing, date:new Date("2024-3-15"), comment:"income 1"},
      {title: "Youtube ", id:2, amount:300, transactionType:type.income, category:categoryOptions.Youtube, date:new Date("2024-3-1"), comment:"income 2"},
      {title: "bank Payment", id:3, amount:100, transactionType:type.expense, category:categoryOptions.BankTransfer, date:new Date("2024-3-3"), comment:"expense 1"},
      {title: "moving", id:4, amount:300, transactionType:type.expense, category:categoryOptions.OtherExpense, date:new Date("2024-3-12"), comment:"expense 2"},
      {title: "food", id:5, amount:120, transactionType:type.expense, category:categoryOptions.Groceries, date:new Date("2024-3-10"), comment:"expense 3"},
      {title: "food", id:6, amount:100, transactionType:type.expense, category:categoryOptions.Groceries, date:new Date("2024-3-11"), comment:"expense 4"},
    ];
  }

  getTotalIncome(): number{
    let income: number = 0;
    this.transactions.forEach((item: ITransaction): void =>{
      if(item.transactionType === type.income)
      {
        income += item.amount;
      }
    });
    return income;
  }

  getTotalExpense(): number{
    let expense: number = 0;
    this.transactions.forEach((item: ITransaction): void =>{
      if(item.transactionType === type.expense)
      {
        expense += item.amount;
      }
    });
    return expense;
  }

  getRecentHistory(): Array<ITransaction>
  {
    return this.transactions
      .sort((a: ITransaction, b: ITransaction) => b.id - a.id)
      .slice(0, 5);
  }

  gerIncomeList(): Array<ITransaction>{
    return this.transactions.filter((item)=>{
      return item.transactionType === type.income;
    })
  }

  getExpenseList(): Array<ITransaction>{
    return this.transactions.filter((item)=>{
      return item.transactionType === type.expense;
    })
  }

  getAllTransactions(){
    return this.transactions;
  }
}
