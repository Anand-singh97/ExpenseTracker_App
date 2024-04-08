import {Component, OnInit} from '@angular/core';
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {ITransaction, type} from "../../model/model";
import {InputComponentComponent} from "../input-component/input-component.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DALService} from "../services/dal.service";
import {ActivatedRoute} from "@angular/router";
import {CameraComponent} from "../camera/camera.component";
import {LocationComponent} from "../location/location.component";

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [
    TransactionListComponent,
    InputComponentComponent,
    ReactiveFormsModule,
    FormsModule,
    CameraComponent,
    LocationComponent
  ],
  templateUrl: './income-form.component.html',
  styleUrl: './income-form.component.css'
})

export class IncomeFormComponent implements OnInit
{
  incomeList: Array<ITransaction> = [];
  formTitle: string = 'Add Income'
  selectedIncome: ITransaction | null | undefined;
  selectedSortOption: number = 3;
  imgSrc: string = '';
  isFormSubmitted: boolean = false;
  lat: any;
  lon: any

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
        console.log(e);
      }
    }

    this.incomeList = await this.dal.getIncomeList();
  }

  title = new FormControl('', [Validators.required]);
  amount = new FormControl('',
    [Validators.required, Validators.min(1)]);
  category = new FormControl(0);
  date = new FormControl(new Date().toLocaleDateString('en-CA').split('T')[0], [Validators.required]);
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
    var transactionDate = new Date(this.incomeForm.value.date!);
    transactionDate.setDate(transactionDate.getDate() + 1);
    if (this.incomeForm.valid) {
      const newIncome: ITransaction = {
        title: this.incomeForm.value.title!,
        amount: Number(this.incomeForm.value.amount),
        transactionType: type.income,
        category: Number(this.incomeForm.value.category),
        date: transactionDate,
        comment: this.incomeForm.value.comments!,
        photo: this.imgSrc != '' ? this.imgSrc : undefined,
        lat: this.lat ? this.lat : undefined,
        lon: this.lon ? this.lon : undefined
      };
      try
      {
        await this.dal.insert(newIncome);
        this.incomeForm.reset();
        this.isFormSubmitted = true;
        this.incomeList = await this.dal.getIncomeList();
      }
      catch(e)
      {
        console.log('Error adding income transaction: ', e);
      }
    }
  }

  sortTransactions()
  {
    switch (Number(this.selectedSortOption))
    {
      case 1:
        // Sort by Price (High to Low)
        this.incomeList.sort((a, b) => a.amount > b.amount ? -1 : 1);
        break;
      case 2:
        // Sort by Price (Low to High)
        this.incomeList.sort((a, b) => a.amount > b.amount ? 1 : -1);
        break;
      case 3:
        // Sort by Date (Most recent)
        this.incomeList.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 4:
        // Sort by Date (Oldest)
        this.incomeList.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
  }
  onImageUpload($event : string)
  {
    this.imgSrc = $event;
  }
  onGetLocation_Click($event: any){
    this.lat = $event.lat;
    this.lon = $event.lon;
  }
}
