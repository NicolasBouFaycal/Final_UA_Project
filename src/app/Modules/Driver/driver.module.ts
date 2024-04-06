import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { CheckPassengersComponent } from './check-passengers/check-passengers.component';


@NgModule({
  declarations: [
    CheckPassengersComponent
  ],
  imports: [
    CommonModule,
    DriverRoutingModule
  ]
})
export class DriverModule { }
