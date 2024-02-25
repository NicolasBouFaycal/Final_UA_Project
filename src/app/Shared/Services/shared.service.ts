import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubject = new Subject<any>();
  private imageSubject = new Subject<string>();
  data$ = this.dataSubject.asObservable();
  image$ = this.imageSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
  setImage(imageData: string) {
    this.imageSubject.next(imageData);
  }
}
