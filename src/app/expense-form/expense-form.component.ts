import {Component, OnInit} from '@angular/core';
import {ITransaction} from "../../model/model";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponentComponent} from "../input-component/input-component.component";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {DALService} from "../../services/dal.service";

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
  constructor(public dal: DALService)
  {

  }
  async ngOnInit()
  {
    this.expenseList = await this.dal.getExpenseList();
    this.totalExpense = await this.dal.getTotalExpense();
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
