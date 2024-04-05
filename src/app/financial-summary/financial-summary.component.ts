import {Component, OnInit} from '@angular/core';
import {DALService} from "../../services/dal.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class FinancialSummaryComponent implements OnInit
{
  totalIncome: number = 0;
  totalExpense: number = 0;
  totalBalance: number = 0;

  currentMonthSubscription: Subscription = new Subscription();
  currMonth: number = Number(localStorage.getItem('currMonth')) ?? (new Date()).getMonth();

  constructor(public dal: DALService)
  {
  }

  async ngOnInit()
  {
    this.currentMonthSubscription = this.dal.getCurrMonth().subscribe((value)=>{
      this.currMonth = value;
      this.loadData();
    });
  }

  async loadData(){
    this.totalIncome = await this.dal.getTotalIncome(this.currMonth);
    this.totalExpense = await this.dal.getTotalExpense(this.currMonth);
    this.totalBalance = this.totalIncome - this.totalExpense;
  }
  ngOnDestroy(): void {
    if (this.currentMonthSubscription) {
      this.currentMonthSubscription.unsubscribe();
    }
}
}
