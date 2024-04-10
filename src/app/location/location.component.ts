import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GeoService } from "../services/geo.service";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
declare const H: any;

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
export class LocationComponent {
  geoService = inject(GeoService);
  position: any = undefined;
  @Input() isDeletePageActive: boolean = false;
  @Input() lat: any;
  @Input() lon: any
  @Output() positionData = new EventEmitter();
  @Input() isMapVisible: boolean = false;

  constructor() {}

  getLocationOnclick() : void
  {
    this.geoService.getCurrentLocation().then(data => {
      this.position = data;
      this.lat = data.lat;
      this.lon = data.lon;
      this.sendPositionData();
      this.showMap();
    })
      .catch(e => {
      console.log(e);
    });
  }

  sendPositionData() {
    this.positionData.emit({ lat: this.lat, lon: this.lon });
  }

  public showMap() {
    document.getElementById('mapContainer')!.innerHTML = '';
    // Initialize the platform object:
    var platform = new H.service.Platform({
      'apikey': 'Lxp7HX9FzbtxvB4YympFbdJSvuYWcLi0vboqPUW_KIM'
    });

    // Obtain the default map types from the platform object
    var maptypes = platform.createDefaultLayers();

    var options = {
      zoom: 15,
      center: {
        lat: this.lat, lng: this.lon
      }
    };

    // Instantiate (and display) a map object:
    var map = new H.Map(
      document.getElementById('mapContainer'),
      maptypes.vector.normal.map,
      options
    );

    var icon = new H.map.Icon('assets/pin.png', { size: { w: 50, h: 50 } });
    var marker = new H.map.Marker({
      lat: this.lat, lng: this.lon
    }, { icon: icon });

    // Add the marker to the map and center the map at the location of the marker:
    map.addObject(marker);
  }

  resetView(){
    this.isMapVisible = false;
    this.lat = null;
    this.lon = null;
  }
}
