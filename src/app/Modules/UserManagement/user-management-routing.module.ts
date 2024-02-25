import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component'; 
import { EditEmailComponent } from './edit-email/edit-email.component';
import { EditPasswordComponent } from './edit-password/edit-password.component'; 
const routes: Routes = [
  {path:"forget-password",component:ForgetPasswordComponent},
  {path:"edit-profile",component:EditProfileComponent},
  {path:"edit-email",component:EditEmailComponent},
  {path:"edit-password",component:EditPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
