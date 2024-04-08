import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {FooterComponent} from "./footer/footer.component";
import {CameraComponent} from "./camera/camera.component";

@Component({
    selector: 'app-root',
    standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AnalyticsComponent, FooterComponent, CameraComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent
{
    title = 'AngularBootstrapTemplate';
    constructor()
    {
    }
}
