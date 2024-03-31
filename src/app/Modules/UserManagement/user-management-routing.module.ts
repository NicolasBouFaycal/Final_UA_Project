import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component'; 
import { EditEmailComponent } from './edit-email/edit-email.component';
import { EditPasswordComponent } from './edit-password/edit-password.component'; 
import { PaymentComponent } from './payment/payment.component';
import { PlanComponent } from './plan/plan.component';
import { userGuard } from './guard/user.guard';
import { paymentGuard } from './guard/payment.guard';

const routes: Routes = [
  {path:"forget-password",component:ForgetPasswordComponent},
  {path:"edit-profile",component:EditProfileComponent,canActivate: [userGuard]},
  {path:"edit-email",component:EditEmailComponent,canActivate: [userGuard]},
  {path:"edit-password",component:EditPasswordComponent,canActivate: [userGuard]},
  {path:"payment",component:PaymentComponent,canActivate: [userGuard,paymentGuard]},
  {path:"plan",component:PlanComponent,canActivate: [userGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
