import {Injectable} from "@angular/core";
import {transactionsData} from "../model/model";
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  static db: IDBDatabase | null = null;
  private dbName = "TransactionsDb";
  constructor()
  {
  }

  async initializeDatabase()
  {
    try
    {
      await this.createDatabase();
    }
    catch(e)
    {
      console.error("Database not initialized: ", e)
    }
  }

  createDatabase(): Promise<void>
  {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('currMonth'))
      {
        const currMonth: number = (new Date()).getMonth() + 1;
        localStorage.setItem('currMonth', currMonth.toString());
      }

      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error("Error in creating database", event);
        reject(event);
      }

      request.onsuccess = () => {
        console.log("Database created successfully");
        TransactionService.db = request.result;
        resolve();
      }

      request.onupgradeneeded = (event) => {
        console.log("Upgrade needed for database");
        TransactionService.db = (event.target as IDBOpenDBRequest).result;

        if (! TransactionService.db.objectStoreNames.contains("transactions"))
        {
          const transactions =  TransactionService.db.createObjectStore("transactions", {
            keyPath: "id",
            autoIncrement: true
          });

          // Add starter data to the object store
          transactionsData.forEach((item) => {
            transactions.add(item);
          });
        }
      };
    });
  }
}
