import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubject = new Subject<any>();
  private imageSubject = new Subject<string>();  
  private startWebCamSubject = new Subject<string>();
  private showVerifiedErrorPassenger=new Subject<Boolean>();

  data$ = this.dataSubject.asObservable();
  image$ = this.imageSubject.asObservable();
  startWebCam$ = this.startWebCamSubject.asObservable();
  showVerifiedErrorPassenger$= this.showVerifiedErrorPassenger.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
  setImage(imageData: string) {
    this.imageSubject.next(imageData);
  }

  startWebCam(){
    this.startWebCamSubject.next("true");
  }

  passengerSubscriptionSuccess(){
    this.showVerifiedErrorPassenger.next(true);
  }

  passengerSubscriptionError(){
    this.showVerifiedErrorPassenger.next(false);
  }

  
}
