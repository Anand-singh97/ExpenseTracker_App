import {Injectable} from '@angular/core';
import {TransactionService} from "./transaction.service";
import {ICategories, ITransaction, IType} from "../../model/model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DALService
{
  private monthSubject =
    new BehaviorSubject<number>(new Date().getMonth()+1);
  constructor() {}

  updateMonth(month: number){
    this.monthSubject.next(month);
  }
  getCurrMonth(){
    return this.monthSubject.asObservable();
  }

  getAllCategories(): Promise<ICategories[]>
  {
    return new Promise((resolve, reject) => {
      if (!TransactionService.db) {
        reject("Database is not initialized.");
        return;
      }

      const transaction = TransactionService.db.transaction(["categories"], "readonly");

      transaction.oncomplete = () => {
        console.log("Success: getAllCategories transaction successful");
      };

      transaction.onerror = (event) => {
        console.error("Error: error in getAll categories transaction ", event);
        reject(event);
      };

      const transactionStore = transaction.objectStore("categories");
      const reviewRequest = transactionStore.openCursor();

      const categories: ICategories[] = [];

      reviewRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result; // Access result from request
        if (cursor) {
          categories.push(cursor.value);
          cursor.continue();
        } else {
          resolve(categories);
        }
      };

      reviewRequest.onerror = (event) => {
        console.error("Error opening cursor", event);
        reject(event);
      };
    });
  }

  async getCategoryBasedExpense(month: number): Promise<Array<any>>
  {
    let res: any[] = [];
    let categories: Array<ICategories> = [];
    try
    {
      const expenses = await this.getMonthlyTransactions(month);
      categories = await this.getAllCategories();
      for (const item of expenses)
      {
        if(item.typeId === 2)
        {
          let found = false;
          for (const i of res)
          {
            if (i.id === item.categoryId)
            {
              i.amount += item.amount;
              found = true;
              break;
            }
          }
          if (!found)
          {
            res.push({ id: item.categoryId, amount: item.amount });
          }
        }
      }
    } catch(e) {
      console.log("Error getting category based expense: ", e);
    }
    if(res.length > 0)
    {
      res.forEach((item)=>{
        categories.forEach((i)=>{
          if(item.id === i.id)
          {
            item.id = i.name;
          }
        })
      })
    }
    console.log(res);
    return res;
  }

  async getIncomeList(): Promise<ITransaction[]>
  {
    try
    {
      const tr: Array<ITransaction> = await this.getAllTransactions();
      let filteredIncomeList = tr.filter((item)=>{
        return item.typeId === 1;
      });
      return filteredIncomeList
        .sort((a, b)=> a.date > b.date ? -1 : 1);
    }
    catch(e)
    {
      console.error("Error, filtering transactions for income List: ", e);
      throw e;
    }
  }

  async getExpenseList(): Promise<ITransaction[]>
  {
    try
    {
      const tr: Array<ITransaction> = await this.getAllTransactions();
      let filteredExpenseList =  tr.filter((item)=>{
        return item.typeId === 2;
      });
      return filteredExpenseList.sort((a, b)=> a.date > b.date ? -1 : 1);
    }
    catch(e)
    {
      console.error("Error, filtering transactions for expense List: ", e);
      throw e;
    }
  }

  async getTotalIncome(month: number): Promise<number>
  {
    let total: number = 0;
    try
    {
      const transactions: ITransaction[] = await this.getMonthlyTransactions(month);
      let selectedMonth: number = Number(localStorage.getItem('currMonth'));
      selectedMonth = selectedMonth ? selectedMonth : ((new Date()).getMonth() + 1);

      transactions.forEach((item) => {
        const monthOfTransaction: number = (item.date).getMonth() + 1;
        if (monthOfTransaction === selectedMonth && item.typeId === 1) {
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

  async getTotalExpense(month: number): Promise<number>
  {
    let total: number = 0;
    try
    {
      const transactions: ITransaction[] = await this.getMonthlyTransactions(month);
      let selectedMonth: number = Number(localStorage.getItem('currMonth'));
      selectedMonth = selectedMonth ? selectedMonth : ((new Date()).getMonth() + 1);

      transactions.forEach((item) => {
        const monthOfTransaction: number = (item.date).getMonth() + 1;
        if (monthOfTransaction === selectedMonth && item.typeId === 2) {
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

  async getRecentHistory(selectedMonth: number): Promise<ITransaction[]>
  {
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

  async select(id: number): Promise<ITransaction | null> { // Return type should be Promise<ITransaction | null> to handle cases where transaction is not found
    return new Promise<ITransaction | null>((resolve, reject) => {
      if (!TransactionService.db) {
        reject("Database is not initialized.");
        return;
      }

      const transaction = TransactionService.db.transaction(["transactions"], "readonly"); // Use readonly mode for transaction as you're not performing any writes

      transaction.oncomplete = () => {
        // Transaction completed successfully
      };

      transaction.onerror = (event) => {
        console.error("Error: error in selecting a transaction ", event);
        reject(event);
      };

      const transactionStore = transaction.objectStore("transactions");
      const request = transactionStore.get(id);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        if(result)
        {
          resolve(result);
        }
        else
        {
          reject(new Error('Review not found.'))
        }
      };

      request.onerror = (event) => {
        console.error("Error finding transaction", event);
        reject(event);
      };
    });
  }


  async getMonthlyTransactions(month: number): Promise<ITransaction[]>
  {
    try
    {
      const transactions = await this.getAllTransactions();
       return transactions.filter((item)=>{
        return item.date.getMonth() + 1 === month;
      });
    }
    catch(e)
    {
      console.log("error fetching monthly transactions: ", e);
      throw e;
    }
  }

  async insert(newTransaction: ITransaction) {
    return new Promise<void>((resolve, reject) => {
      if (!TransactionService.db) {
        reject("Database is not initialized.");
        return;
      }

      const transaction = TransactionService.db.transaction(["transactions"], "readwrite");

      transaction.oncomplete = () => {
        console.log("Success: insert transaction successful");
        resolve();
      };

      transaction.onerror = (event) => {
        console.error("Error: error in insert transaction ", event);
        reject(event); // Reject the promise if there's an error
      };

      const transactionStore = transaction.objectStore("transactions");
      const request = transactionStore.add(newTransaction);

      request.onsuccess = () => {
        console.log("New transaction added successfully");
      };

      request.onerror = (event) => {
        console.error("Error adding new transaction", event);
        reject(event); // Reject the promise if there's an error adding the transaction
      };
    });
  }

  async update(tr: ITransaction): Promise<void>
  {
    return new Promise((resolve, reject) => {
      if(!TransactionService.db){
        reject('Database not initialized');
      }
      else
      {
        const transaction = TransactionService.db.transaction(["transactions"], "readwrite");
        transaction.onerror = (event) => console.log("Error: error in update transaction " + event);

        const transactionStore = transaction.objectStore("transactions");

        const req = transactionStore.put(tr);
        req.onsuccess = ()=>{
          console.log('Success: review updated successfully');
          resolve();
        }
        req.onerror = (event)=>{
          console.log(`Error: error in update ${event}`);
          reject(event);
        }
      }
    });
  }

  async delete(id: number): Promise<void>{
    return new Promise((resolve, reject)=>{
      if(!TransactionService.db)
      {
        reject('Database not initialized');
      }
      else
      {
        const transaction = TransactionService.db.transaction(['transactions'], 'readwrite');
        transaction.onerror = (event)=>console.log('Error in delete transaction: ', event);
        const transactionStore = transaction.objectStore('transactions');
        const req = transactionStore.delete(id);
        req.onsuccess = ()=>{
          console.log('transaction deleted successfully');
          resolve();
        }
        req.onerror = ()=>{
          console.log('error deleting transaction');
          reject();
        }
      }
    })
  }
}
