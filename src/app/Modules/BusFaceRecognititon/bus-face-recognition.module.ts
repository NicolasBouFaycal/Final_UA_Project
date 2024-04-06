import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusFaceRecognitionRoutingModule } from './bus-face-recognition-routing.module';
import { BusFaceRecognitionComponent } from './bus-face-recognition/bus-face-recognition.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    BusFaceRecognitionComponent
  ],
  imports: [
    CommonModule,
    BusFaceRecognitionRoutingModule,
    MatDialogModule,
    DialogModule
  ]
})
export class BusFaceRecognitionModule { }
