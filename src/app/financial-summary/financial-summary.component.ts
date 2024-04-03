import { Component } from '@angular/core';
import {TransactionService} from "../services/transaction.service";

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class FinancialSummaryComponent {

  totalIncome: number = 0;
  totalExpense: number = 0;
  totalBalance: number = 0;
  constructor(private transactionService: TransactionService) {
    this.totalIncome = transactionService.getTotalIncome();
    this.totalExpense = transactionService.getTotalExpense();
    this.totalBalance = this.totalIncome - this.totalExpense;
  }

}
