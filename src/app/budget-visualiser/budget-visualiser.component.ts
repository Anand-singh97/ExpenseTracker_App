import {Component, OnInit} from '@angular/core';
import {DALService} from "../services/dal.service";
import {Subscription} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-budget-visualiser',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './budget-visualiser.component.html',
  styleUrl: './budget-visualiser.component.css'
})
export class BudgetVisualiserComponent implements OnInit
{
  totalExpense: number = 0;
  currentMonthSubscription: Subscription = new Subscription();
  currMonth: number = Number(localStorage.getItem('currMonth')) ?? (new Date()).getMonth();
  months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  maxBudget: number = 1000;
  month: string = '';
  categoriesBasedExpense: Array<any> = [];
  budgetLeft: number = 0;

  constructor(public dal: DALService) {}

  protected readonly Math = Math;
    async ngOnInit(): Promise<void>
    {

      this.currentMonthSubscription = this.dal.getCurrMonth()
        .subscribe(async (value): Promise<void>=>
        {
          this.currMonth = value;
          this.loadData();
        })
    }
    async loadData()
    {
      if(localStorage.getItem('maxBudget'))
      {
        this.maxBudget = Number(localStorage.getItem('maxBudget'));
      }
      this.month = this.months[this.currMonth-1];
      this.totalExpense = await this.dal.getTotalExpense(this.currMonth);
      this.categoriesBasedExpense = await this.dal.getCategoryBasedExpense(this.currMonth);
      this.budgetLeft = this.maxBudget - this.totalExpense;
    }
    calculateLeftBudget(): void
    {
      localStorage.setItem('maxBudget', this.maxBudget.toString());
      console.log(this.maxBudget, this.totalExpense);
      this.budgetLeft = this.maxBudget - this.totalExpense;
    }
}
