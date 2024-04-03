import { Component } from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {FinancialSummaryComponent} from "../financial-summary/financial-summary.component";
import {RecentHistoryComponent} from "../recent-history/recent-history.component";
import {AnalyticsComponent} from "../analytics/analytics.component";
import {ChartComponent} from "../chart/chart.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FinancialSummaryComponent,
    RecentHistoryComponent,
    AnalyticsComponent,
    ChartComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
