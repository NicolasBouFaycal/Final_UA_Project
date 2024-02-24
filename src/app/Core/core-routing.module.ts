import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PaymentGatwayComponent } from './payment-gatway/payment-gatway.component';
import { MapPageComponent } from './map-page/map-page.component';
import { CaptureImageComponent } from './capture-image/capture-image.component';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
import { ProfileComponent } from './profile/profile.component'; 
const routes: Routes = [
  {path:'',
  component:MainComponent,
  children:[
    {path:"map", component:MapPageComponent},
    {path:"payment-gateway",component:PaymentGatwayComponent},
    {path:'image',component:CaptureImageComponent},
    {path:'face-detection',component:FaceDetectionComponent },
    {path:'profile',component:ProfileComponent},
    {path:'',redirectTo:"map",pathMatch:"full"},
   ]
},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
