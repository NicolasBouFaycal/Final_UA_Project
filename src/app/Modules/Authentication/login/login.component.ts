import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { AuthenticationService } from '../../UserManagement/Services/authentication.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public visible: boolean = false;
  public header:string="";
  public content:string="";

  constructor(private _authenticationService:AuthenticationService,private router:Router,private http:HttpClient,private fb:FormBuilder){}

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
      this.http.get("https://localhost:7103/api/Authentication/login",{
        params:{email:email!,password:password!}}).subscribe((response:any)=>{
          if(response.message == "false"){
            this.showDialog("Error","Wrong email or password");
          }else{
            if(response.message.roleId == 2){
              this._authenticationService.loginUser.next(2);
            }else if(response.message.roleId == 1){
              this._authenticationService.loginUser.next(1);
            }else{
              this._authenticationService.loginUser.next(3);  
            }
            this.router.navigate(['/main/map']);
        }  
      });
    }
  }

  public forgetPassword(){
    if(this.login.get("email")?.value == ''){
      this.showDialog("Attention","Fill email before changimg the password");
    }else{
      this.router.navigate(['/main/user-management/forget-password']);
    }
  }

  private showDialog(header:string,content:string) {
    this.header=header;
    this.content=content;
    this.visible = true;
  }
}
