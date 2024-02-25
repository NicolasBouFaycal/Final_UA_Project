import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaceDetectionComponent } from 'src/app/Core/face-detection/face-detection.component';
import { SharedService } from 'src/app/Shared/Services/shared.service'; 

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  public displayImage="../../../../assets/imgs/authentication/take-picture-img.png";
  subscription: any;

  constructor(private dialog:MatDialog,private sharedService:SharedService){
    this.subscription = this.sharedService.image$.subscribe(imageData => {
      this.displayImage = imageData;
    });   
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
}
