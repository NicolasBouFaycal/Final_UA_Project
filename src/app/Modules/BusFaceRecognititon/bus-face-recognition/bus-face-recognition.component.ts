import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { FaceDetectionComponent } from 'src/app/Core/face-detection/face-detection.component';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-bus-face-recognition',
  templateUrl: './bus-face-recognition.component.html',
  styleUrls: ['./bus-face-recognition.component.scss']
})
export class BusFaceRecognitionComponent implements OnInit ,OnDestroy {
  public subscription: any;
  private checkOpenCam!: Subscription;
  private dialogRef:any;
  constructor( private _http:HttpClient,private dialog: MatDialog, private sharedService: SharedService){}

  ngOnInit(): void {
    this.subscription = this.sharedService.image$.subscribe(async imageData => {
      var img={
        faceRecognititonImage:imageData,
        driverId:localStorage.getItem("userId")
      }
      this.dialogRef.close()
      await this._http.post<any>('https://localhost:7103/api/Buses/faceRecognition', img).subscribe();
    });
    var userId=parseInt(localStorage.getItem("userId")!);
    this._http.get<any>(`https://localhost:7103/api/Buses/isUserVerified?userId=${userId}`).subscribe((response:any)=>{
      if(response.message != false && response.message=="info"){
        this.openCam();
      }
    });
    this.asyncCheckOpenCam();
  }

  ngOnDestroy(): void {
      this.checkOpenCam.unsubscribe();
  }

  
  private asyncCheckOpenCam(){
    this.checkOpenCam = interval(2000)
    .subscribe(() => {
      this.getOpenCamLocalStorage();
    });
  }

  private getOpenCamLocalStorage(){
    var openCam= localStorage.getItem("openCam");
    if(openCam!=null){
      this.openCam();
      localStorage.removeItem("openCam");
    }
  }

  private openCam(){
     this.dialogRef = this.dialog.open(FaceDetectionComponent, {
      width: '657px',
      height: '556px',
      data: {
        message: ""
      }
    });
    this.dialogRef.afterClosed().subscribe((result:any) => {
      this.sharedService.closeCamera("popup closed");
    });
  }
}
