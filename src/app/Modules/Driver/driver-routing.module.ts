import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckPassengersComponent } from './check-passengers/check-passengers.component';

const routes: Routes = [
  {path:'',component:CheckPassengersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
