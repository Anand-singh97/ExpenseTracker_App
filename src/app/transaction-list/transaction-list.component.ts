import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ICategories, ITransaction, IType} from "../../model/model";
import {RouterLink} from "@angular/router";
import {DALService} from "../services/dal.service";
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [NgForOf,
    DatePipe,
    NgIf, NgClass, RouterLink,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent
{
  @Input() transactions: Array<ITransaction> = [];
  // readonly type = type;
  constructor(public dal: DALService)
  {
  }
  // protected readonly categoryOptions = categoryOptions;

  async delete(id: number): Promise<void>
  {
    await this.dal.delete(id);
  }
}

