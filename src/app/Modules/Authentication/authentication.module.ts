import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component'; 
import { RegisterComponent } from './register/register.component'; 
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MatDialogModule } from'@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        InputTextModule,
        PasswordModule,
        CheckboxModule,
        ButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        DialogModule,
        ConfirmDialogModule,
    ]
})
export class AuthenticationModule { }
