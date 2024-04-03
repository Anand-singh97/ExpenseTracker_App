import {Component} from '@angular/core';
import {IncomeFormComponent} from "../income-form/income-form.component";
import {ExpenseFormComponent} from "../expense-form/expense-form.component";

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    IncomeFormComponent,
    ExpenseFormComponent
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css'
})
export class TransactionsPageComponent
{
  constructor()
  {

  }
}
