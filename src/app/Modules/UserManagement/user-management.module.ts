import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component'; 
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ]
})
export class UserManagementModule { }
