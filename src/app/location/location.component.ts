import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {GeoService} from "../services/geo.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent
{
  geoService = inject(GeoService);
  position: any = undefined;
  @Input() isDeletePageActive: boolean = false;
  @Input() lat: any;
  @Input() lon: any
  @Output() positionData = new EventEmitter();
  getLocationOnclick() {
    const subscription = this.geoService.getCurrentLocation().then(data => {
      this.position = data;
      this.lat = data.lat;
      this.lon = data.lon;
      this.sendPositionData();
    }).catch(e => {
      console.log(e);
    });
  }

  sendPositionData(){
    this.positionData.emit({lat: this.lat, lon: this.lon});
  }
}
