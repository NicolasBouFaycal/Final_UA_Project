import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component'; 
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditEmailComponent } from './edit-email/edit-email.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { PaymentComponent } from './payment/payment.component';
import { PlanComponent } from './plan/plan.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    ForgetPasswordComponent,
    EditProfileComponent,
    EditEmailComponent,
    EditPasswordComponent,
    PaymentComponent,
    PlanComponent,
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    GooglePayButtonModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule
  ]
})
export class UserManagementModule { }
