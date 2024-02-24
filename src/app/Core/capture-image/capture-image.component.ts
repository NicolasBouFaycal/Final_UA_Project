import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-capture-image',
  templateUrl: './capture-image.component.html',
  styleUrls: ['./capture-image.component.scss']
})
export class CaptureImageComponent implements OnInit {

  @ViewChild('webcam') webcam: any; // Reference to your webcam component

  isCameraExist:boolean=true;
  showWebcam=true;
  errors:WebcamInitError[]=[];
  webcamImage:WebcamImage | undefined;

  private trigger:Subject<void>=new Subject<void>();
  private nextWebcam: Subject<boolean | string>=new Subject<boolean | string>();

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices:MediaDeviceInfo[])=>{
        this.isCameraExist=mediaDevices && mediaDevices.length>0;
      })
  }
  takeSnapshot(){
    this.trigger.next();
  }

  onOffWebCame(){
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError){
    this.errors.push(error);
  }

  changeWebcame(directionOrDeviceId:boolean | string){
    this.nextWebcam.next(directionOrDeviceId);
  }


  handleImage(webcamImage:any){
    //this.getPicture.emit(webcamImage);
    this.webcamImage=webcamImage;
     this.showWebcam = false;
  }

  get triggerObservable():Observable<void>{
    return this.trigger.asObservable();
  }

  get nextWebcamObservable():Observable<boolean | string>{
    return this.nextWebcam.asObservable();
  }


}
