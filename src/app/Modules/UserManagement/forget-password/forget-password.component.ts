import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  public header: string="";
  public content: string="";
  public visible: boolean=false;
  public isVerificationCode:boolean=true;
  public isForgetPassword:boolean=false;


  private verificationCode:string="";

  constructor(private loaderService: LoaderService,private router:Router,private fb:FormBuilder,private _http:HttpClient,private confirmationService: ConfirmationService ){
    this.loaderService.show();
  }

public ngOnInit(): void {
    this.loaderService.hide();
}

  otp = this.fb.group({
    firstInput: ['', Validators.required],
    secondInput: ['', Validators.required],
    thirdInput: ['', [Validators.required]],
    fourthInput: ['', [Validators.required]],
    fifthInput: ['', [Validators.required]],
    sixInput: ['', [Validators.required]],
  });

  forgetPassword=this.fb.group({
    newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),]],
    confirmPassword: ['', Validators.required],
  });

  public onSubmit(){
    let input1 = this.otp.get("firstInput")?.value;
    let input2 = this.otp.get("secondInput")?.value;
    let input3 = this.otp.get("thirdInput")?.value;
    let input4 = this.otp.get("fourthInput")?.value;
    let input5 = this.otp.get("fifthInput")?.value;
    let input6 = this.otp.get("sixInput")?.value;

    if(input1 == ''
     || input2 == ''
     || input3 == ''
     || input4 == ''
     || input5 == ''
     || input6 == ''){
      this.showDialog("Attention","Fill All Fields");
    }
    else{
      this.verificationCode =input1!.toString()+input2!.toString()+input3?.toString()+input4!.toString()+input5!.toString()+input6!.toString();
      let verifyCode={
        Email:localStorage.getItem("email"),
        Code:this.verificationCode
      }
      this.loaderService.show();
      this._http.post<any>('https://localhost:7103/api/Users/verifyCode', verifyCode).subscribe((response:any) => {
        if(response.message == true ){
          this.loaderService.hide();
          this.isVerificationCode=false;
          this.isForgetPassword=true;
        }
        else{
          this.loaderService.hide();
          this.showDialog("Attention","Verification is incorrect or OTP Expiered");
          this.otp.get("firstInput")?.setValue('');
          this.otp.get("secondInput")?.setValue('');
          this.otp.get("thirdInput")?.setValue('');
          this.otp.get("fourthInput")?.setValue('');
          this.otp.get("fifthInput")?.setValue('');
          this.otp.get("sixInput")?.setValue('');
        }
        });
    }
  }

  public goBack(){
    this.router.navigate(['/main/authentication/login']);
  }

  public submitPassword(){
    var newPassword=this.forgetPassword.get("newPassword")?.value;
    var confirmPassword= this.forgetPassword.get("confirmPassword")?.value;
    if(newPassword == '' || confirmPassword == ''){
      this.showDialog("Attention","Fill All Fields");
    }else if(newPassword != confirmPassword){
      this.showDialog("Attention","Check your password");
      this.forgetPassword.get("newPassword")?.setValue('');
      this.forgetPassword.get("confirmPassword")?.setValue('');
    }else{
      let newPassword={
        Email:localStorage.getItem("email"),
        Password:this.forgetPassword.get("newPassword")?.value
      }
      this.loaderService.show();
      this._http.post<any>('https://localhost:7103/api/Users/submitPassword', newPassword).subscribe((response:any) => {
        if(response.message == true ){
          this.loaderService.hide();
          this.confirm1("Attention","Password has been updated succesfuly");
        }
        else{
          this.loaderService.hide();
          this.showDialog("Attention","Something went wrong please try again");
          this.forgetPassword.get("newPassword")?.setValue('');
          this.forgetPassword.get("confirmPassword")?.setValue('');
        }
      });
    }
  }
  public move(e:any,p:any,c:any, n:any){
    var length = c.value.length;
    var maxlength = c.getAttribute('maxlength');
    if(length == maxlength ){
      if(n != ""){
        n.focus();
      }
    }
    if(e.key === "Backspace" ){
      if(p != ""){
        p.focus();
      }
    }
  }
  
  private showDialog(header:string,content:string) {
    this.header=header;
    this.content=content;
    this.visible = true;
  }
  confirm1(header:string,message:string) {
    this.confirmationService.confirm({
        message: message,
        header: header,
        icon: "",
        accept: () => {
          this.router.navigate(['/main/authentication/login']);
        },
        reject: () => {
            
        }
    });
  }
}
