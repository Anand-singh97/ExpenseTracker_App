import { Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {IncomeFormComponent} from "./income-form/income-form.component";
import {ExpenseFormComponent} from "./expense-form/expense-form.component";
import {TransactionsPageComponent} from "./transactions-page/transactions-page.component";
export const routes: Routes = [
  {path:'home', component: HomePageComponent},
  {path:'', component: HomePageComponent},
  // {path:'transaction/income/:id', component: IncomeFormComponent},
  // {path:'transaction/expense/:id', component: ExpenseFormComponent},
  {
    path: 'transaction',
    component: TransactionsPageComponent,
    children: [
      { path: 'income', component: IncomeFormComponent },
      { path: 'expense', component: ExpenseFormComponent }
    ]
  }
];
