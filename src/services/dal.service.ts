import {Injectable} from '@angular/core';
import {TransactionService} from "./transaction.service";
import {ITransaction, type} from "../model/model";

@Injectable({
  providedIn: 'root'
})

export class DALService
{

  constructor()
  {

  }

  async getIncomeList(): Promise<ITransaction[]>{
    try
    {
      const tr: Array<ITransaction> = await this.getAllTransactions();
      return tr.filter((item)=>{
        return item.transactionType = type.income;
      });
    }
    catch(e)
    {
      console.error("Error, filtering transactions for income List: ", e);
      throw e;
    }
  }

  async getExpenseList(): Promise<ITransaction[]>{
    try
    {
      const tr: Array<ITransaction> = await this.getAllTransactions();
      return tr.filter((item)=>{
        return item.transactionType = type.expense;
      });
    }
    catch(e)
    {
      console.error("Error, filtering transactions for expense List: ", e);
      throw e;
    }
  }

  async getTotalIncome(): Promise<number>
  {
    let total: number = 0;
    try
    {
      const transactions: ITransaction[] = await this.getAllTransactions();
      console.log(transactions);
      let selectedMonth: number = Number(localStorage.getItem('currMonth'));
      selectedMonth = selectedMonth ? selectedMonth : ((new Date()).getMonth() + 1);

      transactions.forEach((item) => {
        const monthOfTransaction: number = (item.date).getMonth() + 1;
        if (monthOfTransaction === selectedMonth && item.transactionType === type.income) {
          total += item.amount;
        }
      });
      return total;
    }
    catch (e)
    {
      console.error("Error in getTotalIncome: ", e);
      throw e;
    }
  }

  async getTotalExpense(): Promise<number>
  {
    let total: number = 0;
    try
    {
      const transactions: ITransaction[] = await this.getAllTransactions();
      let selectedMonth: number = Number(localStorage.getItem('currMonth'));
      selectedMonth = selectedMonth ? selectedMonth : ((new Date()).getMonth() + 1);

      transactions.forEach((item) => {
        const monthOfTransaction: number = (item.date).getMonth() + 1;
        if (monthOfTransaction === selectedMonth && item.transactionType === type.expense) {
          total += item.amount;
        }
      });
      return total;
    }
    catch (e)
    {
      console.error("Error in getTotalExpense: ", e);
      throw e;
    }
  }

  async getRecentHistory(): Promise<ITransaction[]>
  {
    let selectedMonth = Number(localStorage.getItem('currMonth'));
    selectedMonth = selectedMonth ? selectedMonth : ((new Date()).getMonth() + 1);
    try
    {
      const transactions: Array<ITransaction> = await this.getAllTransactions();
      const filteredTransactions = transactions.filter((item)=>{
        const monthOfTransaction = (item.date).getMonth() + 1;
        return monthOfTransaction === selectedMonth;
      });
      filteredTransactions.sort((a, b) => (a.date > b.date) ? -1 : 1);
      return filteredTransactions.slice(0, 5);
    }
    catch(e)
    {
      console.error("Error in gettingRecentHistory: ", e);
      throw e;
    }
  }

  getAllTransactions(): Promise<ITransaction[]>
  {
    return new Promise((resolve, reject) => {
      if (!TransactionService.db) {
        reject("Database is not initialized.");
        return;
      }

      const transaction = TransactionService.db.transaction(["transactions"], "readonly");

      transaction.oncomplete = () => {
        console.log("Success: selectAll transaction successful");
      };

      transaction.onerror = (event) => {
        console.error("Error: error in selectAll transaction ", event);
        reject(event);
      };

      const transactionStore = transaction.objectStore("transactions");
      const reviewRequest = transactionStore.openCursor();

      const transactions: ITransaction[] = [];

      reviewRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result; // Access result from request
        if (cursor) {
          transactions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(transactions);
        }
      };

      reviewRequest.onerror = (event) => {
        console.error("Error opening cursor", event);
        reject(event);
      };
    });
  }
}
