import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './Shared/marker.service';
import { PopupService } from './Shared/popup.service';
import { ShapeService } from './Shared/shape.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/Shared/shared.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    SharedModule
  ],
  providers: [MarkerService,PopupService,ShapeService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
