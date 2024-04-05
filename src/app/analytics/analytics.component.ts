import { Component } from '@angular/core';
import {FinancialSummaryComponent} from "../financial-summary/financial-summary.component";
import {RecentHistoryComponent} from "../recent-history/recent-history.component";
import {ChartComponent} from "../chart/chart.component";

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    FinancialSummaryComponent,
    RecentHistoryComponent,
    ChartComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent
{


}
