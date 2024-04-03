import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {TransactionService} from "./services/transaction.service";

const transactionService = new TransactionService();
transactionService.initializeDatabase().then(()=>
{

  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));

}).catch((err)=>{
  console.log("Error initializing database", err);
})
