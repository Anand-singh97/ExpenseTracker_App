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


export const transactionsData: Array<ITransaction> = [
  {title: "Shopify", id:1, amount:500, transactionType:type.income, category:categoryOptions.Freelancing, date:new Date("2024-4-15"), comment:"income 1"},
  {title: "Youtube ", id:2, amount:300, transactionType:type.income, category:categoryOptions.Youtube, date:new Date("2024-4-1"), comment:"income 2"},
  {title: "bank Payment", id:3, amount:100, transactionType:type.expense, category:categoryOptions.BankTransfer, date:new Date("2024-4-3"), comment:"expense 1"},
  {title: "moving", id:4, amount:300, transactionType:type.expense, category:categoryOptions.OtherExpense, date:new Date("2024-4-12"), comment:"expense 2"},
  {title: "food", id:5, amount:120, transactionType:type.expense, category:categoryOptions.Groceries, date:new Date("2024-4-10"), comment:"expense 3"},
  {title: "food", id:6, amount:100, transactionType:type.expense, category:categoryOptions.Groceries, date:new Date("2024-4-11"), comment:"expense 4"}
];
