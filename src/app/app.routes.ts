import { Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {IncomeFormComponent} from "./income-form/income-form.component";
import {ExpenseFormComponent} from "./expense-form/expense-form.component";
export const routes: Routes = [
  {path:'home', component: HomePageComponent},
  {path:'', component: HomePageComponent},
  {path:'transaction/income', component: IncomeFormComponent},
  {path:'transaction/expense', component: ExpenseFormComponent},
];
