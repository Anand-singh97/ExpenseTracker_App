import {Component} from '@angular/core';
import {IncomeFormComponent} from "../income-form/income-form.component";
import {ExpenseFormComponent} from "../expense-form/expense-form.component";
import {Router, RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    IncomeFormComponent,
    ExpenseFormComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css'
})
export class TransactionsPageComponent
{
  constructor(private router: Router) {}

  isIncomeFormSelected(): boolean {
    return this.router.url.startsWith('/transaction/income');
  }
}
