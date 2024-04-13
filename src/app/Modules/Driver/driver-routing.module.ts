import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckPassengersComponent } from './check-passengers/check-passengers.component';
import { driverGuard } from './guards/driver.guard';

const routes: Routes = [
  {path:'',component:CheckPassengersComponent, canActivate: [driverGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
