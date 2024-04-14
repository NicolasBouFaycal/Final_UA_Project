import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { CheckPassengersComponent } from './check-passengers/check-passengers.component';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { OrderListModule } from 'primeng/orderlist';
import { HistoryBusComponent } from './history-bus/history-bus.component';
import { TableModule } from 'primeng/table';
import { HeaderDriverComponent } from './header-driver/header-driver.component';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    CheckPassengersComponent,
    HistoryBusComponent,
    HeaderDriverComponent,
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
    DataViewModule,
    RatingModule,
    TagModule,
    OrderListModule,
    TableModule,
    ButtonModule
  ]
})
export class DriverModule { }
