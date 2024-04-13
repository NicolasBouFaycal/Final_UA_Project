import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';

@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss']
})
export class EditEmailComponent implements OnInit {
  public header: string = '';
  public content: string = '';
  public visible: boolean = false;

  constructor(private _decodeToken:DecodeTokenService ,private loaderService: LoaderService,private router:Router,private confirmationService: ConfirmationService,private fb:FormBuilder,private dialog:MatDialog,private _http:HttpClient){
    this.loaderService.show();
  }

  public ngOnInit(): void {
    this.loaderService.hide();
  }

  editEmail=this.fb.group({
    email: ['', [Validators.required,Validators.email]],
    password: ['', Validators.required],
  });

  public submit(){
    if (!this.editEmail.valid) {
      this.showDialog("Attention","InValid Form")
    }else{
      let editEmail={
        UserId:parseInt(this._decodeToken.getUserId()),
        NewEmail:this.editEmail.get("email")?.value,
        Password:this.editEmail.get("password")?.value
      }
      this.loaderService.show();
      this._http.post<any>('https://localhost:7103/api/Users/editEmail', editEmail).subscribe((response:any) => {
        if(response.message == true ){
          this.loaderService.hide();
          this.confirm1("Attention","Data has been edited");
        }
        else{
          this.loaderService.hide();
          this.showDialog("Attention","Something went wrong please try again");
        }
      });

    }
  }

  public goBack(){
    this.router.navigate(['/main/user-management/edit-profile']);
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
          this.router.navigate(['/main/user-management/edit-profile']);
        },
        reject: () => {
            
        }
    });
  }

}
