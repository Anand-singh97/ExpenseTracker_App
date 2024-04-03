import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction, type} from "../../model/model";
import {DALService} from "../../services/dal.service";

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
  constructor(public dal: DALService) {
  }

  async ngOnInit() {
    this.recentTransactions = await this.dal.getRecentHistory();
  }
}
