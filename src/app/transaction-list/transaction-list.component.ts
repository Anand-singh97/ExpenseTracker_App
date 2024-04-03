import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {TransactionService} from "../services/transaction.service";
import {categoryOptions, ITransaction, type} from "../model/model";
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [NgForOf,
    DatePipe,
    NgIf, NgClass,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent
{
  @Input() transactions: Array<ITransaction> = [];
  protected readonly type = type;
  constructor(private transactionService: TransactionService) {
  }
  protected readonly categoryOptions = categoryOptions;
}
