import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { FaceRecognitionService } from '../services/face-recognition.service';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-check-passengers',
  templateUrl: './check-passengers.component.html',
  styleUrls: ['./check-passengers.component.scss'],

})
export class CheckPassengersComponent implements OnInit,OnDestroy {
  public template:any;
  public passegerState:any;
  public products!: any;
  public passengersInfo:any

  private listenToPassegersInBus:Subscription=new Subscription();
  private watchId:any;
  private checkpassenger!:Subscription;
  
  constructor(private productService: ProductService,private _facerecog:FaceRecognitionService,private _decodeToken:DecodeTokenService,private router:Router,private _http:HttpClient,private sharedService: SharedService){}

  ngOnInit(): void {
   this.listenToUserInBusInfo();
    
      this.template = 'info';
     this.asyncCheckPassenger();
  }

  ngOnDestroy(): void {
    this.listenToPassegersInBus.unsubscribe();
  }

  public successError(){ 
    var userId=parseInt(this._decodeToken.getUserId());
    var numberOfPassengers={
      passengerId:localStorage.getItem("passengerId"),
      busUserId:userId
    }
    var user={
      userId:userId
    }
    this._http.post("https://localhost:7103/api/Buses/updateUserVerification",user).subscribe((response:any)=>{
      if(response.message){
        localStorage.setItem("openCam","true");
        this.asyncCheckPassenger();
      }
    });
    if(localStorage.getItem("passengerId") != null){
      this._http.post("https://localhost:7103/api/Buses/updateNumberOfPassenger",numberOfPassengers).subscribe(()=>{
        localStorage.removeItem("passengerId")
      });

    }
  }

  public getSeverity (product: Product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
  };

  private asyncCheckPassenger(){
    this.checkpassenger = interval(2000)
    .subscribe(() => {
      this.getPassengerLocalStorage();
    });
  }
  private listenToUserInBusInfo(){
    this.listenToPassegersInBus = interval(2000)
    .subscribe(() => {
      this.getUserInBusInfo();
    });
  }

  private getUserInBusInfo(){
    this.productService.getCurrentPassengersInBus().then((data:any) => (this.products = data));
  }

  private getPassengerLocalStorage(){
    var busUserId=parseInt(this._decodeToken.getUserId());
    if(localStorage.getItem("passengerId") != null){
      this._http.get<any>(`https://localhost:7103/api/Buses/checkPassengerEnterLeave?busUserId=${busUserId}&passengerId=${parseInt(localStorage.getItem("passengerId")!)}`).subscribe((response:any)=>{
      if(response.message != false){
        if(response.message.busVerifyRecognition=="verified"){
          this.passegerState = response.message.enterLeaveEmpty;
          this.template = response.message.busVerifyRecognition
          this.checkpassenger.unsubscribe();
        }else if(response.message.busVerifyRecognition=="error"){
          this.passegerState = "Continue"
          this.template = response.message.busVerifyRecognition
          this.checkpassenger.unsubscribe();
        }
        else{
          this.template = response.message.busVerifyRecognition
        }
      }
    });
    }else{
      this._http.get<any>(`https://localhost:7103/api/Buses/isUserVerified?userId=${busUserId}`).subscribe((response:any)=>{
        this.template = response.message
      })
    }
  }
}
