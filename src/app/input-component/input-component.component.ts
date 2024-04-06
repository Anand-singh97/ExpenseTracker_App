import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-input-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgClass
  ],
  templateUrl: './input-component.component.html',
  styleUrl: './input-component.component.css'
})
export class InputComponentComponent
{
  @Input() control: FormControl = new FormControl();
  @Input() type: string = "";
  @Input() placeholder: string = "";
  @Input() name: string = "";
  @Input() format: string = "";
  @Input() readonly :boolean = false;
}
