import {Component, OnInit} from '@angular/core';
import {ITransaction, type} from "../../model/model";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponentComponent} from "../input-component/input-component.component";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {DALService} from "../../services/dal.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    InputComponentComponent,
    ReactiveFormsModule,
    TransactionListComponent
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})

export class ExpenseFormComponent implements OnInit
{
  currentMonthSubscription: Subscription = new Subscription();
  currMonth: number = Number(localStorage.getItem('currMonth')) ?? (new Date()).getMonth();
  expenseList: Array<ITransaction> = [];
  constructor(public dal: DALService)
  {
  }

  async ngOnInit()
  {
    this.currentMonthSubscription = this.dal.getCurrMonth()
      .subscribe((value)=>{this.currMonth = value});
      this.expenseList = await this.dal.getExpenseList();
  }

  title = new FormControl('', [Validators.required])

  amount = new FormControl('',
    [Validators.required, Validators.min(1)])

  category = new FormControl(7,);

  date = new FormControl(new Date(),[Validators.required]);

  comments = new FormControl('');

  expenseForm = new FormGroup({
    title:this.title,
    amount:this.amount,
    date: this.date,
    comments: this.comments,
    category: this.category
  })

  async addTransaction()
  {
    if (this.expenseForm.valid) {
      const newExpense: ITransaction = {
        title: this.expenseForm.value.title!,
        amount: Number(this.expenseForm.value.amount),
        transactionType: type.expense,
        category: Number(this.expenseForm.value.category),
        date: new Date(this.expenseForm.value.date!),
        comment: this.expenseForm.value.comments!
      };
      try
      {
        await this.dal.insert(newExpense);
        this.expenseForm.reset();
        this.expenseList = await this.dal.getExpenseList();
      }
      catch(e)
      {
        console.log('Error adding expense transaction: ', e)
      }
    }
  }
}
