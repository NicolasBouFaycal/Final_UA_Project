import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { FaceRecognitionService } from '../services/face-recognition.service';

@Component({
  selector: 'app-header-driver',
  templateUrl: './header-driver.component.html',
  styleUrls: ['./header-driver.component.scss']
})
export class HeaderDriverComponent implements OnInit,OnDestroy{
  public activateDeactivate!:string;
  private watchId:any;

  constructor(private productService: ProductService,private _facerecog:FaceRecognitionService,private _decodeToken:DecodeTokenService,private router:Router,private _http:HttpClient,private sharedService: SharedService){}

  public ngOnInit(): void {
    var userId=parseInt(this._decodeToken.getUserId());

    this._http.get<any>(`https://localhost:7103/api/Buses/busActiveState?userId=${userId}`).subscribe((response:any)=>{
      if(response.message != false){
        this.activateDeactivate="Deactivate";
      }else{
        this.activateDeactivate="Activate";
      }
    });
  }

  public ngOnDestroy(): void {
      
  }

  public goToDashboard(){
    this.router.navigate(['/main/check_passengers']);
  }

  public goToMap(){
    this.router.navigate(['/main/map']);
  }

  public hitoryBus(){
    this.router.navigate(['/main/check_passengers/history_bus']);
  }

  public activateDeactivateBtn(){
    var userId=parseInt(this._decodeToken.getUserId());
    var user={
      userId:userId
    }
    this._http.post("https://localhost:7103/api/Buses/activateDeactivate",user).subscribe(response=>{
      this._http.get<any>(`https://localhost:7103/api/Buses/busActiveState?userId=${userId}`).subscribe((response:any)=>{
      if(response.message != false){
        this.activateDeactivate="Deactivate";
        this.watchId = navigator.geolocation.watchPosition(position => {
          var dataUser={
            userId:userId,
            longitude:position.coords.longitude,
            latitude:position.coords.latitude
          }
            this._http.post("https://localhost:7103/api/Buses/updateLongLatBus",dataUser).subscribe();
    
          });
      }else{
        this.activateDeactivate="Activate";
        navigator.geolocation.clearWatch(this.watchId)
      }
    });
    });

  }
  
}
