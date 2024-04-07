import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
 

@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.scss']
})
export class FaceDetectionComponent implements OnInit,OnDestroy {
  constructor(private http: HttpClient,private sharedService:SharedService) { }
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  @ViewChild('canvasContainerFinalPic', { static: true }) canvasContainerFinalPic!: ElementRef;
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>; // Use @ViewChild for better reference
  public dectedFace:string="" ;
  public intervalId:any; 
  receivedData: any;
  private subscription!: Subscription;
  private starwebCamAgain!: Subscription;

  
  private mediaStream: MediaStream | null = null;
  private rectangle = {
    x: 200, 
    y: 150,
    width: 250,
    height: 250,
  };

  async ngOnInit() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../../assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('../../../assets/models'),
    ]);
    this.startWebcam();
    this.subscription = this.sharedService.closeCam$.subscribe(data => {
      this.receivedData = data;
      if(data=="popup closed"){
        this.stopWebcam();
      }
    });
    this.starwebCamAgain = this.sharedService.startWebCam$.subscribe(data => {
      if(data =="true"){
        location.reload();
      }
    });
  }

  public ngOnDestroy(): void {
    this.stopWebcam();
    this.subscription.unsubscribe();
    this.starwebCamAgain.unsubscribe();
  }

  startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.videoRef.nativeElement.srcObject = stream;
        this.mediaStream = stream;
        // Store the stream for later stopping
        this.videoRef.nativeElement.addEventListener('play', () => {
          const canvas = faceapi.createCanvasFromMedia(this.videoRef.nativeElement);
          this.canvasContainer.nativeElement.appendChild(canvas);
          const ctx = canvas.getContext('2d');
          this.intervalId =setInterval(async () => {
            const detections = await faceapi.detectAllFaces(this.videoRef.nativeElement, new faceapi.TinyFaceDetectorOptions({
              scoreThreshold: 0,
            }))
              .withFaceLandmarks();
            if(ctx!=null){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
            if(detections.length==0){
              this.dectedFace = "Be closer to the camera";
              this.setRectangleOnCanvas(ctx);
            }
            else if(detections.length > 1){
              this.setRectangleOnCanvas(ctx);
              this.dectedFace = "Error: More then one face detected";
            }else if(detections.some(face =>!this.isFaceInRectangle(face.detection.box, this.rectangle))){
              this.setRectangleOnCanvas(ctx);
              this.dectedFace = "Set your Face Inside the rectangle";
            }
            else if(detections.some(face =>face.detection.score < 0.95)){
              this.setRectangleOnCanvas(ctx);
              this.dectedFace = "Error:Score 0.95 need more light";
            }
            else if(detections.some(face =>this.isFaceInRectangle(face.detection.box, this.rectangle) && face.detection.score >= 0.95)) {
              this.setRectangleOnCanvas(ctx);
              clearInterval(this.intervalId); // Stop the interval when conditions are met
              this.CaptureImage();
            } 
            this.setRectangleOnCanvas(ctx);
            //canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceLandmarks(canvas, detections);
          }, 300)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setRectangleOnCanvas(ctx:any){
    ctx.strokeStyle = 'red'; 
    ctx.lineWidth = 2;
    ctx.strokeRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
  }

 isFaceInRectangle(faceBox: { x: number; y: number; width: any; height: any; }, rectangle: { x: number; y: number; width: any; height: any; }) {
    return (
      faceBox.x >= rectangle.x &&
      faceBox.y >= rectangle.y &&
      faceBox.x + faceBox.width <= rectangle.x + rectangle.width &&
      faceBox.y + faceBox.height <= rectangle.y + rectangle.height
    );
  }

   CaptureImage() {
    this.dectedFace = "Image Captured";
    const canvas = faceapi.createCanvasFromMedia(this.videoRef.nativeElement);
    this.canvasContainerFinalPic.nativeElement.appendChild(canvas);
    const imageDataURL = canvas.toDataURL('image/png');
    this.sharedService.setImage(imageDataURL);
    this.stopWebcam();
  }

  stopWebcam() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.videoRef) {
      this.videoRef.nativeElement.srcObject = null;
    }
    const canvasContainer = this.canvasContainer.nativeElement;
    while (canvasContainer.firstChild) {
    canvasContainer.removeChild(canvasContainer.firstChild);
    }
    this.mediaStream = null;
  }
}

