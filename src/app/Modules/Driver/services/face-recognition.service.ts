import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
  private userId:any;
  constructor() { }

  public setFaceUserRecognised(userId:any){
    this.userId=userId;
  }

  public getFaceUserRecognised(){
    return this.userId;
  }
}
