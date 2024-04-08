import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponentComponent} from "../input-component/input-component.component";
import {NgIf} from "@angular/common";
import {ITransaction, type} from "../../model/model";
import {DALService} from "../services/dal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CameraComponent} from "../camera/camera.component";
import {LocationComponent} from "../location/location.component";

@Component({
  selector: 'app-delete-transaction',
  standalone: true,
  imports: [
    FormsModule,
    InputComponentComponent,
    NgIf,
    ReactiveFormsModule,
    CameraComponent,
    LocationComponent
  ],
  templateUrl: './delete-transaction.component.html',
  styleUrl: './delete-transaction.component.css'
})
export class DeleteTransactionComponent implements OnInit
{
  formTitle: string = 'Delete Income'
  selectedIncome: ITransaction | null | undefined;
  transactionForm: FormGroup = new FormGroup<any>('');
  protected readonly type = type;
  constructor(public dal: DALService, public route: ActivatedRoute, public router: Router) {}
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
          const selectedDate = this.selectedIncome.date;
          const formattedDate = selectedDate.toISOString().split('T')[0];

          this.formTitle = this.selectedIncome.transactionType === type.income ?
            'Are you sure, you want to delete this Income?' : 'Are you sure, you want to delete this Expense?'
          this.title.setValue(this.selectedIncome!.title);
          this.amount.setValue(this.selectedIncome!.amount.toString());
          this.category.setValue(Number(this.selectedIncome!.category));
          this.date.setValue(formattedDate);
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
  category = new FormControl({value:0, disabled:true});
  date = new FormControl(new Date().toLocaleDateString(), [Validators.required]);
  comments = new FormControl('');

  async btnDelete_Click(): Promise<void>
  {
    try
    {
      if (this.transactionForm.valid)
      {
        await this.dal.delete(this.selectedIncome!.id!);
        await this.navigate();
      }
    }
    catch (e)
    {
      console.error("Error Deleting transaction: ", e);
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
