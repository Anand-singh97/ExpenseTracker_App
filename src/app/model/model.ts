export interface ITransaction{
  id:number,
  title: string
  amount: number,
  transactionType: type,
  category: categoryOptions,
  date: Date,
  comment: string
}

export enum type{
  income,
  expense
}

export enum categoryOptions{
  Salary, //income
  Freelancing, //income
  Investments, //income
  Stocks, //income
  Bitcoin, //income
  BankTransfer, //income
  Youtube, //income
  Education,
  Groceries,
  Health,
  Subscriptions,
  Takeaways,
  Clothing,
  Travelling,
  OtherIncome,
  OtherExpense
}
