import {Component, OnInit} from '@angular/core';
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction, type} from "../../model/model";
import {InputComponentComponent} from "../input-component/input-component.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DALService} from "../../services/dal.service";
import {ActivatedRoute} from "@angular/router";

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
  incomeList: Array<ITransaction> = [];
  formTitle: string = 'Add Income'
  selectedIncome: ITransaction | null | undefined;
  constructor(public dal: DALService, public route: ActivatedRoute) {}

  async ngOnInit()
  {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));
    if(id)
    {
      try
      {
        this.selectedIncome = await this.dal.select(id);
        console.log(id);
      }
      catch(e)
      {
      }
    }

    this.incomeList = await this.dal.getIncomeList();
  }

  title = new FormControl('', [Validators.required]);
  amount = new FormControl('',
    [Validators.required, Validators.min(1)]);
  category = new FormControl(0);
  date = new FormControl(new Date(), [Validators.required]);
  comments = new FormControl('');
  incomeForm = new FormGroup({
    title: this.title,
    amount: this.amount,
    date: this.date,
    comments: this.comments,
    category: this.category
  })

  async addTransaction()
  {
    if (this.incomeForm.valid) {
      const newIncome: ITransaction = {
        title: this.incomeForm.value.title!,
        amount: Number(this.incomeForm.value.amount),
        transactionType: type.income,
        category: Number(this.incomeForm.value.category),
        date: new Date(this.incomeForm.value.date!),
        comment: this.incomeForm.value.comments!
      };
      try
      {
        await this.dal.insert(newIncome);
        this.incomeForm.reset();
        this.incomeList = await this.dal.getIncomeList();
      }
      catch(e)
      {
        console.log('Error adding income transaction: ', e)
      }
    }
  }
}
