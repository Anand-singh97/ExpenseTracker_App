import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {TransactionService} from "../services/transaction.service";
import {type} from "../model/model";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  chart: any = [];
  months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  income_date: Array<string> = [];
  expense_date: Array<string> = [];
  expenses: Array<number> = [];
  incomes: Array<number> = [];
  label = 'income'
  color = 'rgb(85,227,7)';
  isIncomeActive = true;
  constructor(public transaction: TransactionService) {
  }

  ngOnInit() {
    this.getChartData();
    this.initializeChart();
  }

  getChartData() {
    let transactions = this.transaction.getAllTransactions();

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
      if (item.transactionType === type.income) {
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
            text: 'Summary',
            font: {
              size: 20,
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
}
