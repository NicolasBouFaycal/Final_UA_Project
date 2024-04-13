import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { AuthenticationService } from '../../UserManagement/Services/authentication.service'; 
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public visible: boolean = false;
  public header:string="";
  public content:string="";

  constructor(private decode:DecodeTokenService,private loaderService: LoaderService,private confirmationService: ConfirmationService,private _authenticationService:AuthenticationService,private router:Router,private http:HttpClient,private fb:FormBuilder){
    this.loaderService.show();
  }
  public ngOnInit(): void {
    this.loaderService.hide();
  }

  login = this.fb.group({
    email: [''],
    password: [''],
  });

  public onSubmit(){
    var email = this.login.get("email")?.value;
    var password= this.login.get("password")?.value;
    // const encrypted = CryptoJS.AES.encrypt(password!, password!).toString();
    // const decryptedBytes = CryptoJS.AES.decrypt(encrypted, password!).toString(CryptoJS.enc.Utf8);;

   if(email == '' || password == ''){
      this.showDialog("Error","Fill all the input");
    }else{
      this.loaderService.show();
      this.http.get("https://localhost:7103/api/Authentication/login",{
        params:{email:email!,password:password!},withCredentials: true}).subscribe((response:any)=>{
          if(response.message == "false"){
            this.loaderService.hide();
            this.showDialog("Error","Wrong email or password");
          }else{
            localStorage.setItem("accessToken",response.message.accessToken);
            localStorage.setItem("refreshToken",response.message.token);
            this.loaderService.hide();
            this.router.navigate(['/main/map']);
        }  
      });
    }
  }

  public forgetPassword(){
    if(this.login.get("email")?.value == ''){
      this.showDialog("Attention","Fill email before changing the password");
    }else{
      this.loaderService.show();
      var user = {
        Email:this.login.get("email")?.value,
      }
      this.loaderService.show();
      this.http.post<any>('https://localhost:7103/api/Users/forgetPassword', user).subscribe((response:any) => {
        if(response.message == true ){
          localStorage.setItem("email",this.login.get("email")?.value!);
          this.loaderService.hide();
          this.confirm1("Attention","Check your email to get the verification code",'/main/user-management/forget-password')
        }
        else{
          this.loaderService.hide();
          this.showDialog("Attention","Wrong email");
        }
        });
    }
  }

  private showDialog(header:string,content:string) {
    this.header=header;
    this.content=content;
    this.visible = true;
  }

  confirm1(header:string,message:string,navigation:any) {
    this.confirmationService.confirm({
        message: message,
        header: header,
        icon: "",
        accept: () => {
          this.loaderService.hide();
          this.router.navigate([navigation])
        },
        reject: () => {
            
        }
    });
  }
}
