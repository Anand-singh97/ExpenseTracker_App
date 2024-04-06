import { Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {IncomeFormComponent} from "./income-form/income-form.component";
import {ExpenseFormComponent} from "./expense-form/expense-form.component";
import {TransactionsPageComponent} from "./transactions-page/transactions-page.component";
import {UpdateTransactionComponent} from "./update-transaction/update-transaction.component";
import {DeleteTransactionComponent} from "./delete-transaction/delete-transaction.component";
export const routes: Routes = [
  {path:'home', component: HomePageComponent},
  {path:'', component: HomePageComponent},
  {path:'updateTransaction/:id', component: UpdateTransactionComponent},
  {
    path: 'transaction',
    component: TransactionsPageComponent,
    children: [
      { path: 'income', component: IncomeFormComponent },
      { path: 'expense', component: ExpenseFormComponent }
    ]
  },
  {path:'deleteTransaction/:id', component: DeleteTransactionComponent}
];
