import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {
  public header: string = '';
  public content: string = '';
  public visible: boolean = false;

   constructor(private loaderService: LoaderService,private router:Router,private fb:FormBuilder,private _http:HttpClient,private confirmationService: ConfirmationService ){
    this.loaderService.show();
   }

   ngOnInit(): void {
      this.loaderService.hide();
   }

  passwordForm=this.fb.group({
    password: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),]],
    confirmPassword: ['', Validators.required],
  });

  public submitForm(){
    var password = this.passwordForm.get('password')?.value;
    var newPassword = this.passwordForm.get('newPassword')?.value;
    var confirmPassword =  this.passwordForm.get('confirmPassword')?.value;
    if(password == '' || newPassword == '' ||  confirmPassword == '' ){
      this.showDialog('Attention', "Fill All Fields" )
    }else if(newPassword != confirmPassword){
      this.showDialog('Attention', "Check your Password" )
    }else{
      var userId = localStorage.getItem("userId")?.toString();
      let changePassword={
        UserId:userId,
        Password:password,
        NewPassword:newPassword
      }
      this.loaderService.show();
      this._http.post<any>('https://localhost:7103/api/Users/editPassword', changePassword).subscribe((response:any) => {
        if(response.message == true ){
          this.loaderService.hide();
          this.confirm1("Attention","Password has been updated succesfuly");
        }
        else{
          this.loaderService.hide();
          this.showDialog("Attention","Something went wrong please try again");
          this.passwordForm.get('password')?.setValue('');
          this.passwordForm.get('newPassword')?.setValue('');
          this.passwordForm.get('confirmPassword')?.setValue('');
        }
      });
    }
  }

  public goBack(){
    this.router.navigate(['/main/map']);
  }

  private showDialog(header:string,content:string) {
    this.header=header;
    this.content=content;
    this.visible = true;
  }

  private confirm1(header:string,message:string) {
    this.confirmationService.confirm({
        message: message,
        header: header,
        icon: "",
        accept: () => {
          this.router.navigate(['/main/map']);
        },
        reject: () => {
            
        }
    });
  }

}
