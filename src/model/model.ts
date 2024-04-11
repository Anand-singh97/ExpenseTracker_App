export interface ITransaction{
  id? : number | null
  title: string
  amount: number,
  typeId: number
  categoryId: number
  date: Date,
  comment: string,
  photo?: string,
  lat?: string,
  lon?: string
}

export interface IType
{
  type: string
}

export interface ICategories{
  name: string,
  typeId: number
  id?: number
}

export const typesData: Array<IType> = [{type: "Income"}, {type: "Expense"}];

// Starting Data
export const transactionsData: Array<ITransaction> = [
  {title: "Shopify sale", amount:500, typeId: 1, categoryId: 2, date:new Date("2024-4-15"), comment:"Sold books on shopify."},
  {title: "Youtube Ad-sense", amount:300, typeId: 1, categoryId: 7, date:new Date("2024-4-1"), comment:"Youtube video revenue"},

  {title: "TD minimum payment", amount:100, typeId: 2, categoryId: 16, date:new Date("2024-4-3"), comment:"minimum payment"},
  {title: "BMO minimum payment", amount:50, typeId: 2, categoryId: 16, date:new Date("2024-4-10"), comment:"minimum payment"},
  {title: "Zara Shopping", amount:300, typeId: 2, categoryId: 14, date:new Date("2024-4-3"), comment:"bought some sweaters"},
  {title: "Playstation shopping", amount:500, typeId: 2, categoryId: 17, date:new Date("2024-4-1"), comment:"bought ps-5"},

  {title: "Salary", amount:6500, typeId: 1, categoryId: 1, date:new Date("2024-3-10"), comment:"IBM salary credited"},
  {title: "Car sale", amount:8000, typeId: 1, categoryId: 6, date:new Date("2024-3-2"), comment:"Sold my old honda"},

  {title: "TD minimum payment", amount:100, typeId: 2, categoryId: 16, date:new Date("2024-3-1"), comment:"minimum payment"},
  {title: "money Transfer", amount:50, typeId: 2, categoryId:16, date:new Date("2024-3-5"), comment:"Sent money to Raj"},
  {title: "cellphone shopping", amount:300, typeId: 2, categoryId: 17, date:new Date("2024-3-8"), comment:"bought new Samsung"},
  {title: "walmart grocery", amount:300, typeId: 2, categoryId: 10, date:new Date("2024-3-6"), comment:"grocery shopping."},
];
export const categoriesData: Array<ICategories> = [
  {name: 'Salary', typeId: 1},
  {name: 'Freelancing', typeId: 1},
  {name: 'Investments', typeId: 1},
  {name: 'Stocks', typeId: 1},
  {name: 'Bitcoin', typeId: 1},
  {name: 'BankTransfer', typeId: 1}, //6
  {name: 'Youtube', typeId: 1},
  {name: 'OtherIncome', typeId: 1},
  {name: 'Education', typeId: 2},
  {name: 'Groceries', typeId: 2},
  {name: 'Health', typeId: 2},
  {name: 'Subscriptions', typeId: 2},
  {name: 'Takeaways', typeId: 2},
  {name: 'Clothing', typeId: 2},
  {name: 'Travelling', typeId: 2},
  {name: 'BankTransfer', typeId: 2},
  {name: 'Electronics', typeId: 2}, //17
  {name: 'OtherExpense', typeId: 2},
]
