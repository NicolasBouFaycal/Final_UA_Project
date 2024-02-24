import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './Shared/marker.service';
import { PopupService } from './Shared/popup.service';
import { ShapeService } from './Shared/shape.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [MarkerService,PopupService,ShapeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
