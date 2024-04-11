import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponentComponent} from "../input-component/input-component.component";
import {NgForOf, NgIf} from "@angular/common";
import {ICategories, ITransaction, IType} from "../../model/model";
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
    LocationComponent,
    NgForOf
  ],
  templateUrl: './delete-transaction.component.html',
  styleUrl: './delete-transaction.component.css'
})
export class DeleteTransactionComponent implements OnInit
{
  formTitle: string = 'Delete Income'
  selectedIncome: ITransaction | null | undefined;
  transactionForm: FormGroup = new FormGroup<any>('');
  categories: Array<ICategories> = [];
  // protected readonly type = type;
  constructor(public dal: DALService, public route: ActivatedRoute, public router: Router) {}
  async ngOnInit()
  {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));
    if (id)
    {
      try
      {
        this.categories = await this.dal.getAllCategories();
        this.selectedIncome = await this.dal.select(id);
        if(this.selectedIncome)
        {
          const selectedDate = this.selectedIncome.date;
          const formattedDate = selectedDate.toISOString().split('T')[0];

          this.formTitle = this.selectedIncome.typeId === 1 ?
            'Are you sure, you want to delete this Income?' : 'Are you sure, you want to delete this Expense?'
          this.title.setValue(this.selectedIncome!.title);
          this.amount.setValue(this.selectedIncome!.amount.toString());
          this.category.setValue(Number(this.selectedIncome!.categoryId));
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
        alert("Transaction deleted successfully 😊");
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
    const rt = this.selectedIncome?.typeId === 1 ?
      ['/transaction/income'] : ['/transaction/expense'];
    await this.router.navigate(rt);
  }

}
