import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  webcamImage:WebcamImage | undefined;
  replaySubject = new ReplaySubject<number>(2); // Buffer size of 2
  handleImage(webcamImage:any){
    this.webcamImage=webcamImage
  } 
  ngOnInit() {

    };
}

