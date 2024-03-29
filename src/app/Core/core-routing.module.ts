import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MapPageComponent } from './map-page/map-page.component';
import { CaptureImageComponent } from './capture-image/capture-image.component';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
const routes: Routes = [
  {path:'',
  component:MainComponent,
  children:[
    {path:"map", component:MapPageComponent},
    {path:'image',component:CaptureImageComponent},
    {path:'face-detection',component:FaceDetectionComponent },
    {path:'',redirectTo:"map",pathMatch:"full"},
   ]
},  
{path:"authentication",loadChildren:()=>import('../Modules/Authentication/authentication.module').then(m=>m.AuthenticationModule)},
{path:"user-management",loadChildren:()=>import('../Modules/UserManagement/user-management.module').then(m=>m.UserManagementModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
