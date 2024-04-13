import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusFaceRecognitionComponent } from './bus-face-recognition/bus-face-recognition.component';
import { driverGuard } from '../Driver/guards/driver.guard';

const routes: Routes = [
  {path:'',component:BusFaceRecognitionComponent, canActivate: [driverGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusFaceRecognitionRoutingModule { }
