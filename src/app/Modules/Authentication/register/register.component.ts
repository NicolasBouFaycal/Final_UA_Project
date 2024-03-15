import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FaceDetectionComponent } from 'src/app/Core/face-detection/face-detection.component';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public displayImage = "../../../../assets/imgs/authentication/take-picture-img.png";
  public subscription: any;
  public visible: boolean = false;
  public header:string="";
  public content:string=""; 

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private router:Router,private http: HttpClient, private fb: FormBuilder, private dialog: MatDialog, private sharedService: SharedService) { }

  registration = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),]],
  });

  ngOnInit(): void {
    this.subscription = this.sharedService.image$.subscribe(imageData => {
      this.displayImage = imageData;
    });
  }

  public openPopup() {
    let dialogRef = this.dialog.open(FaceDetectionComponent, {
      width: '657px',
      height: '556px',
      data: {
        message: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.sharedService.sendData("popup closed");
    });
  }

  public async onSubmit() {
    if (this.registration.valid && this.displayImage.length > 400) {
      var pass = this.registration.get("password")?.value;
      // const encrypted = CryptoJS.AES.encrypt(pass!, pass!).toString();
      var registration = {
        firstName: this.registration.get("firstName")?.value,
        lastName: this.registration.get("lastName")?.value,
        email: this.registration.get("email")?.value,
        password: pass,
        profilePic: this.displayImage,
        RoleId: 1
      }

       this.http.post('https://localhost:7103/api/Authentication/register', registration).subscribe((response:any) =>{
        if(response.message == "exist"){
          this.showDialog("Attention","The email already exist");
        }else{
          this.confirm1("Success","User Registered Successfully");
        }
       });
    } else {
      this.showDialog("Error","Fill All required Fields");
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
