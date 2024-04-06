import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusFaceRecognitionComponent } from './bus-face-recognition/bus-face-recognition.component';

const routes: Routes = [
  {path:'',component:BusFaceRecognitionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusFaceRecognitionRoutingModule { }
