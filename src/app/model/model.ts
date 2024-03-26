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
  Salary,
  Freelancing,
  Investments,
  Stocks,
  Bitcoin,
  BankTransfer,
  Youtube,
  Education,
  Groceries,
  Health,
  Subscriptions,
  Takeaways,
  Clothing,
  Travelling,
  Other
}
