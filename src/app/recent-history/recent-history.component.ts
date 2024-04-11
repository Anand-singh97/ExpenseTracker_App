import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction, IType} from "../../model/model";
import {DALService} from "../services/dal.service";
import {Subscription} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-recent-history',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    TransactionListComponent,
    RouterLink
  ],
  templateUrl: './recent-history.component.html',
  styleUrl: './recent-history.component.css'
})

export class RecentHistoryComponent implements OnInit
{
  months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  recentTransactions: Array<ITransaction> = [];
  // protected readonly type = type;
  currentMonthSubscription: Subscription = new Subscription();
  currMonth: number = Number(localStorage.getItem('currMonth')) ?? (new Date()).getMonth();
  constructor(public dal: DALService)
  {
  }

  async ngOnInit()
  {
    this.currentMonthSubscription = this.dal.getCurrMonth().subscribe(async (value)=>{
      this.currMonth = value;
      this.recentTransactions = await this.dal.getRecentHistory(this.currMonth);
    })
  }
}
