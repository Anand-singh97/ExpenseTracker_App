import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CameraService} from "../services/camera.service";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [NgOptimizedImage, NgIf],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent
{
  imgsrc: any
  @Input() isDeletePageActive: boolean = false;
  @Input() clearImg: boolean = false;
  @Input() alreadyUploadedImg: any;
  cameraService: CameraService = inject(CameraService);
  @Output() uploadedImg: EventEmitter<string> = new EventEmitter<string>();

  sendImage(): void
  {
    this.uploadedImg.emit(this.imgsrc);
  }
  onCapturePhotoClick() {
    this.cameraService.capturePhoto().then(data=>{
      this.imgsrc = data
      this.sendImage();
    }).catch(e=>{
      alert(e.toString())
    });
  }

  onLoadFromLibraryClick(){
    this.cameraService.loadPhotoFromLibrary().then(data=>{
      this.imgsrc = data;
      this.sendImage();
    }).catch(e=>{
      alert(e.toString())
    });
  }
}
