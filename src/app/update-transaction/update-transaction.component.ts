import {Component, OnInit} from '@angular/core';
import {InputComponentComponent} from "../input-component/input-component.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ICategories, ITransaction, IType} from "../../model/model";
import {DALService} from "../services/dal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {CameraComponent} from "../camera/camera.component";
import {LocationComponent} from "../location/location.component";

@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [
    InputComponentComponent,
    ReactiveFormsModule,
    TransactionListComponent,
    NgIf,
    JsonPipe,
    CameraComponent,
    LocationComponent,
    NgForOf
  ],
  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.css'
})
export class UpdateTransactionComponent implements OnInit
{
  formTitle: string = 'Update Income'
  selectedIncome: ITransaction | null | undefined;
  transactionForm: FormGroup = new FormGroup<any>('');
  categories: Array<ICategories> = [];
  newlyUploadedImg: string = '';
  lat: string = ''
  lon: string = ''

  constructor(public dal: DALService, public route: ActivatedRoute, public router: Router) {}

  async ngOnInit(): Promise<void>
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
            'Update Income' : 'Update Expense'
          this.title.setValue(this.selectedIncome!.title);
          this.amount.setValue(this.selectedIncome!.amount.toString());
          this.category.setValue(this.selectedIncome.categoryId);
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
        console.log(e);
      }
    }
  }

  title = new FormControl('', [Validators.required]);
  amount = new FormControl('',
    [Validators.required, Validators.min(1)]);
  category = new FormControl(0);
  date = new FormControl(new Date().toLocaleDateString(), [Validators.required]);
  comments = new FormControl('');

  async btnUpdate_Click() : Promise<void>
  {
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
          typeId: Number(this.selectedIncome?.typeId),
          categoryId: Number(this.transactionForm.value.category),
          date: transactionDate,
          comment: this.transactionForm.value.comments!,
          photo: this.newlyUploadedImg != '' ? this.newlyUploadedImg : this.selectedIncome?.photo ?
            this.selectedIncome.photo : undefined,
          lat: this.lat != '' ? this.lat : this.selectedIncome?.lat ? this.selectedIncome.lat : undefined,
          lon: this.lon != '' ? this.lon : this.selectedIncome?.lon ? this.selectedIncome.lon : undefined
        };
        await this.dal.update(newIncome);
        alert("Transaction updated Successfully 😊");
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
    const rt = this.selectedIncome?.typeId === 1 ?
      ['/transaction/income'] : ['/transaction/expense'];
    await this.router.navigate(rt);
  }

  onImageUpload($event: string){
    this.newlyUploadedImg = $event;
  }

  onGetLocation_Click($event: any)
  {
    this.lat = $event.lat;
    this.lon = $event.lon;
  }
}
