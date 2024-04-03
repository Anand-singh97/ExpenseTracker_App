import {Component, Input, OnInit} from '@angular/core';
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction} from "../model/model";
import {TransactionService} from "../services/transaction.service";
import {InputComponentComponent} from "../input-component/input-component.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [
    TransactionListComponent,
    InputComponentComponent,
    ReactiveFormsModule
  ],
  templateUrl: './income-form.component.html',
  styleUrl: './income-form.component.css'
})
export class IncomeFormComponent implements OnInit
{
  @Input() transactionType: string = '';
  incomeList: Array<ITransaction> = [];
  constructor(public transactionService: TransactionService)
  {

  }
  ngOnInit(): void
  {
    this.incomeList = this.transactionService.gerIncomeList();
  }

  name = new FormControl('', [
    Validators.required
  ])

  amount = new FormControl('',[
    Validators.required,
    Validators.min(1)
  ])

  category = new FormControl(0,[
  ])

  date = new FormControl(new Date(),[
    Validators.required
  ])

  comments = new FormControl('', [

  ]);

  incomeForm = new FormGroup({
    name:this.name,
    amount:this.amount,
    date: this.date,
    comments: this.comments,
    category: this.category
  })
}
