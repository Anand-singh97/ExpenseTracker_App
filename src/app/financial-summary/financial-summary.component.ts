import {Component, OnInit} from '@angular/core';
import {DALService} from "../../services/dal.service";

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
  constructor(public dal: DALService)
  {

  }

  async ngOnInit()
  {
    this.totalIncome = await this.dal.getTotalIncome();
    this.totalExpense = await this.dal.getTotalExpense();
    this.totalBalance = this.totalIncome - this.totalExpense;
  }
}
