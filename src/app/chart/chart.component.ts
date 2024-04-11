import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {IType} from "../../model/model";
import {DALService} from "../services/dal.service";
import {Subscription} from "rxjs";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit
{
  chart: any = [];
  currentMonthSubscription: Subscription = new Subscription();

  currMonth: number = Number(localStorage.getItem('currMonth')) ?? (new Date()).getMonth();
  months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  month: string = '';
  income_date: Array<string> = [];
  expense_date: Array<string> = [];
  expenses: Array<number> = [];
  incomes: Array<number> = [];
  label = 'income'
  color = 'rgb(85,227,7)';
  isIncomeActive = true;
  constructor(public dal: DALService) {}

  async ngOnInit()
  {
    this.currentMonthSubscription = this.dal.getCurrMonth().subscribe(async (value)=>{
      this.currMonth = value;
      this.month = this.months[this.currMonth-1];

      await this.getChartData();
      this.initializeChart();
    })
  }
  ngOnDestroy(): void {
    if (this.currentMonthSubscription) {
      this.currentMonthSubscription.unsubscribe();
    }
  }

  async getChartData()
  {
    this.income_date = [];
    this.expense_date = [];
    this.expenses = [];
    this.incomes = [];
    let month: number = this.currMonth;
    let transactions = await this.dal.getMonthlyTransactions(month);

    transactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    transactions.forEach((item) => {
      const date = new Date(item.date);
      const day = date.getDate();
      const month = this.months[date.getMonth()];
      const fullDate = day + " " + month;
      if (item.typeId === 1) {
        if (this.income_date[this.income_date.length - 1] === fullDate) {
          this.incomes[this.incomes.length - 1] += item.amount;
        } else {
          this.income_date.push(fullDate);
          this.incomes.push(item.amount);
        }
      } else {
        if (this.expense_date[this.expense_date.length - 1] === fullDate) {
          this.expenses[this.expenses.length - 1] += item.amount;
        } else {
          this.expense_date.push(fullDate);
          this.expenses.push(item.amount);
        }
      }
    });
  }

  initializeChart() {
    this.chart = new Chart('canvas', {
      type: "bar",
      data: {
        labels: this.isIncomeActive ? this.income_date : this.expense_date,
        datasets: [
          {
            label: this.label,
            data: this.isIncomeActive ? this.incomes : this.expenses,
            backgroundColor: this.color,
            borderColor: this.color,
            borderWidth: 1,
            barThickness: 10,
            borderRadius: 5
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 13,
                weight: 'bold'
              }
            }
          },
          title: {
            display: true,
            text: 'Monthly Transactions',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              stepSize: 5
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false,
        }
      }
    });
  }

  toggleTransactionChart() {
    this.isIncomeActive = !this.isIncomeActive;
    this.chart.destroy();
    this.color = this.isIncomeActive ? 'rgb(85,227,7)' : 'rgba(255, 99, 132, 1)';
    this.label = this.isIncomeActive ? 'income' : 'expense';
    this.initializeChart();
  }

  async changeMonth(nextOrPrev: string)
  {
    let month: number =  this.currMonth;
    if(nextOrPrev === 'next')
    {
      if(month >= 12)
      {
        month = 1;
      }
      else
      {
        month++;
      }
    }
    else
    {
      if(month <= 1)
      {
        month = 12;
      }
      else
      {
        month--;
      }
    }
    this.dal.updateMonth(month);
    localStorage.setItem('currMonth', month.toString());
    this.month = this.months[this.currMonth-1];
    this.chart.destroy();
  }
}
