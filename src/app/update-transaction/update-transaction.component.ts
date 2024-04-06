import {Component, OnInit} from '@angular/core';
import {InputComponentComponent} from "../input-component/input-component.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction, type} from "../../model/model";
import {DALService} from "../../services/dal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [
    InputComponentComponent,
    ReactiveFormsModule,
    TransactionListComponent,
    NgIf,
    JsonPipe
  ],
  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.css'
})
export class UpdateTransactionComponent implements OnInit
{
  formTitle: string = 'Update Income'
  selectedIncome: ITransaction | null | undefined;
  transactionForm: FormGroup = new FormGroup<any>('');
  protected readonly type = type;
  constructor(public dal: DALService, public route: ActivatedRoute, public router: Router)
  {
  }

  async ngOnInit()
  {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));
    if (id)
    {
      try
      {
        this.selectedIncome = await this.dal.select(id);
        if(this.selectedIncome)
        {
          this.formTitle = this.selectedIncome.transactionType === type.income ?
            'Update Income' : 'Update Expense'
          this.title.setValue(this.selectedIncome!.title);
          this.amount.setValue(this.selectedIncome!.amount.toString());
          this.category.setValue(this.selectedIncome!.category);
          this.date.setValue(new Date(this.selectedIncome.date).toLocaleDateString());
          this.comments.setValue(this.selectedIncome!.comment.toString());
        }
        this.transactionForm = new FormGroup({
          title: this.title,
          amount: this.amount,
          date: this.date,
          comments: this.comments,
          category: this.category
        });
      }
      catch (e)
      {
      }
    }
  }

  title = new FormControl('', [Validators.required]);
  amount = new FormControl('',
    [Validators.required, Validators.min(1)]);
  category = new FormControl(0);
  date = new FormControl(new Date().toLocaleDateString(), [Validators.required]);
  comments = new FormControl('');

  async btnUpdate_Click() {
    try
    {
      if (this.transactionForm.valid)
      {
        var transactionDate = new Date(this.transactionForm.value.date);
        transactionDate.setDate(transactionDate.getDate() + 1);

        const newIncome: ITransaction = {
          id: this.selectedIncome?.id,
          title: this.transactionForm.value.title!,
          amount: Number(this.transactionForm.value.amount),
          transactionType: Number(this.selectedIncome?.transactionType),
          category: Number(this.transactionForm.value.category),
          date: transactionDate,
          comment: this.transactionForm.value.comments!
        };
        await this.dal.update(newIncome);
        await this.navigate();
      }
    }
    catch (e)
    {
      console.error("Error updating income transaction: ", e);
    }
  }
  btnCancel_Click(){
    this.navigate();
  }

  async navigate(){
    const rt = this.selectedIncome?.transactionType === type.income ?
      ['/transaction/income'] : ['/transaction/expense'];
    await this.router.navigate(rt);
  }
}
