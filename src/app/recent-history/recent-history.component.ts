import {Component, OnInit} from '@angular/core';
import {TransactionService} from '../services/transaction.service';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction, type} from "../model/model";
// import _default from "chart.js/dist/plugins/plugin.tooltip";
@Component({
  selector: 'app-recent-history',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    TransactionListComponent
  ],
  templateUrl: './recent-history.component.html',
  styleUrl: './recent-history.component.css'
})
export class RecentHistoryComponent implements OnInit
{
  recentTransactions: Array<ITransaction> = [];
  protected readonly type = type;
  constructor(private transactionService: TransactionService) {
  }

  ngOnInit() {
    this.recentTransactions = this.transactionService.getRecentHistory();
  }
}
