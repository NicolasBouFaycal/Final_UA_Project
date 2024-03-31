import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { MainComponent } from './main/main.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapPageComponent } from './map-page/map-page.component';
import { CaptureImageComponent } from './capture-image/capture-image.component';
import { WebcamModule } from 'ngx-webcam';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollerModule } from 'primeng/scroller';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService,MessageService  } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MatDialogModule } from'@angular/material/dialog';

@NgModule({
  declarations: [
    MainComponent,
    MapPageComponent,
    CaptureImageComponent,
    FaceDetectionComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    GoogleMapsModule,
    WebcamModule,
    HttpClientModule,
    SidebarModule,
    InputTextModule,
    ScrollerModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ConfirmPopupModule,
    ToastModule,
    PanelMenuModule,
    MatDialogModule,
  ],
  providers:[ConfirmationService,MessageService]
})
export class CoreModule { }
