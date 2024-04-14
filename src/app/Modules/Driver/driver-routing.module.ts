import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckPassengersComponent } from './check-passengers/check-passengers.component';
import { driverGuard } from './guards/driver.guard';
import { HistoryBusComponent } from './history-bus/history-bus.component';

const routes: Routes = [
  {path:'',component:CheckPassengersComponent, canActivate: [driverGuard]},
  {path:'history_bus',component:HistoryBusComponent,canActivate: [driverGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
