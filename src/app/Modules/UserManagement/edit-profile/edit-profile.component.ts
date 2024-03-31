import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { FaceDetectionComponent } from 'src/app/Core/face-detection/face-detection.component';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';
import { SharedService } from 'src/app/Shared/Services/shared.service'; 

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public displayImage="../../../../assets/imgs/authentication/take-picture-img.png";
  subscription: any;
  public header: string = '';
  public content: string = '';
  public visible: boolean = false;

  constructor(private loaderService: LoaderService,private router:Router,private confirmationService: ConfirmationService,private fb:FormBuilder,private dialog:MatDialog,private sharedService:SharedService,private _http:HttpClient){
    this.loaderService.show();
    this.subscription = this.sharedService.image$.subscribe(imageData => {
      this.displayImage = imageData;
    });   
  }

  editProfile=this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email:[{ value: '', disabled: true }, Validators.required],
  });

   public ngOnInit(): void {
    let params = new HttpParams()
      .set('userId', parseInt(localStorage.getItem("userId")!));

    this._http.get('https://localhost:7103/api/Users/userInfo',{params}).subscribe((response:any)=>{
      if(response.message){
        this.loaderService.hide();
        this.editProfile.get("firstName")?.setValue(response.message.firstName);
        this.editProfile.get("lastName")?.setValue(response.message.lastName);
        this.editProfile.get("email")?.setValue(response.message.email);
        this.displayImage = response.message.profilePic;
      }
    });
  }

   public goBack(){
    this.router.navigate(['/main/map']);
  }

  public openPopup(){
    let dialogRef =this.dialog.open(FaceDetectionComponent,{
      width: '657px',
      height:'556px',
      data:{
        message:""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.sharedService.sendData("popup closed");
    });
    
    //dialogRef.close('Pizza!');
  }

  public submit(){
    var firstName = this.editProfile.get("firstName")?.value;
    var lastName = this.editProfile.get("lastName")?.value;
    if(firstName == '' || lastName == ''){
      this.showDialog("Attention", "Fill All Fields")
    }else{
      let editData={
        UserId : parseInt(localStorage.getItem("userId")!),
        FirstName:firstName,
        LastName:lastName,
        ProfilePic:this.displayImage
      }
      this.loaderService.show();
      this._http.post<any>('https://localhost:7103/api/Users/editProfile', editData).subscribe((response:any) => {
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
          this.router.navigate(['/main/map']);
        },
        reject: () => {
            
        }
    });
  }
}
