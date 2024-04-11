import {Component, OnInit, ViewChild} from '@angular/core';
import {ICategories, ITransaction, IType} from "../../model/model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponentComponent} from "../input-component/input-component.component";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {DALService} from "../services/dal.service";
import {Subscription} from "rxjs";
import {CameraComponent} from "../camera/camera.component";
import {LocationComponent} from "../location/location.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    InputComponentComponent,
    ReactiveFormsModule,
    TransactionListComponent,
    FormsModule,
    CameraComponent,
    LocationComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})

export class ExpenseFormComponent implements OnInit
{
  @ViewChild(LocationComponent) lc: LocationComponent = new LocationComponent();
  currentMonthSubscription: Subscription = new Subscription();
  currMonth: number = Number(localStorage.getItem('currMonth')) ?? (new Date()).getMonth();
  expenseList: Array<ITransaction> = [];
  selectedSortOption: number = 3;
  imgSrc: string = '';
  isFormSubmitted: boolean = false;
  lat: any;
  lon: any
  categories: Array<ICategories> = [];

  constructor(public dal: DALService) {}

  async ngOnInit() {
    this.currentMonthSubscription = this.dal.getCurrMonth()
      .subscribe((value) => {
        this.currMonth = value
      });
    this.categories = await this.dal.getAllCategories();
    this.expenseList = await this.dal.getExpenseList();
  }

  title = new FormControl('', [Validators.required])

  amount = new FormControl('',
    [Validators.required, Validators.min(1)])

  category = new FormControl(9);

  date = new FormControl(new Date().toLocaleDateString('en-CA')
    .split('T')[0], [Validators.required]);

  comments = new FormControl('');

  expenseForm = new FormGroup({
    title: this.title,
    amount: this.amount,
    date: this.date,
    comments: this.comments,
    category: this.category
  })

  async addTransaction() {
    var transactionDate = new Date(this.expenseForm.value.date!);
    transactionDate.setDate(transactionDate.getDate() + 1);
    if (this.expenseForm.valid) {
      const newExpense: ITransaction = {
        title: this.expenseForm.value.title!,
        amount: Number(this.expenseForm.value.amount),
        typeId: 2,
        categoryId: Number(this.expenseForm.value.category),
        date: transactionDate,
        comment: this.expenseForm.value.comments!,
        photo: this.imgSrc != '' ? this.imgSrc : undefined,
        lat: this.lat ? this.lat : undefined,
        lon: this.lon ? this.lon : undefined
      };
      try {
        await this.dal.insert(newExpense);
        this.expenseForm.reset();
        this.isFormSubmitted = true;
        alert("Expense added Successfully 😊");
        this.lc.resetView();
        this.expenseList = await this.dal.getExpenseList();
      } catch (e) {
        console.log('Error adding expense transaction: ', e)
      }
    }
  }

  sortTransactions() {
    switch (Number(this.selectedSortOption)) {
      case 1:
        // Sort by Price (High to Low)
        this.expenseList.sort((a, b) => a.amount > b.amount ? -1 : 1);
        break;
      case 2:
        // Sort by Price (Low to High)
        this.expenseList.sort((a, b) => a.amount > b.amount ? 1 : -1);
        break;
      case 3:
        // Sort by Date (Most recent)
        this.expenseList.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 4:
        // Sort by Date (Oldest)
        this.expenseList.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
  }
  onImageUpload($event : string)
  {
    this.imgSrc = $event;
  }

  onGetLocation_Click($event: any)
  {
    this.lat = $event.lat;
    this.lon = $event.lon;
  }
}
