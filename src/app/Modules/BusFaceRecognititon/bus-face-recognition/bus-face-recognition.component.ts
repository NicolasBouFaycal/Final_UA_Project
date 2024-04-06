import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaceDetectionComponent } from 'src/app/Core/face-detection/face-detection.component';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-bus-face-recognition',
  templateUrl: './bus-face-recognition.component.html',
  styleUrls: ['./bus-face-recognition.component.scss']
})
export class BusFaceRecognitionComponent implements OnInit {
  public subscription: any;

  constructor( private _http:HttpClient,private dialog: MatDialog, private sharedService: SharedService){}

  ngOnInit(): void {
    this.subscription = this.sharedService.image$.subscribe(async imageData => {
      var img={
        faceRecognititonImage:imageData,
        cameraId:1
      }
      await this._http.post<any>('https://localhost:7103/api/Buses/faceRecognition', img).subscribe((response:any)=>
      {
        if(response.message){
          localStorage.setItem("passenger","true")
        }else{
          localStorage.setItem("passenger","false")
        }
        this.sharedService.startWebCam();
      });
    });
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
}
