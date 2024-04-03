import {Component, OnInit} from '@angular/core';
import {ITransaction} from "../model/model";
import {TransactionService} from "../services/transaction.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponentComponent} from "../input-component/input-component.component";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";

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
  // @Input() transactionType: string = '';
  expenseList: Array<ITransaction> = [];
  totalExpense: number = 0;
  constructor(public transactionService: TransactionService)
  {

  }
  ngOnInit(): void
  {
    this.expenseList = this.transactionService.getExpenseList();
    this.totalExpense = this.transactionService.getTotalExpense();
  }

  name = new FormControl('', [
    Validators.required
  ])

  amount = new FormControl('',[
    Validators.required,
    Validators.min(1)
  ])

  category = new FormControl(7,[
  ])

  date = new FormControl(new Date(),[
    Validators.required
  ])

  comments = new FormControl('', [

  ]);

  expenseForm = new FormGroup({
    name:this.name,
    amount:this.amount,
    date: this.date,
    comments: this.comments,
    category: this.category
  })
}
