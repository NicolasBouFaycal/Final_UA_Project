import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-check-passengers',
  templateUrl: './check-passengers.component.html',
  styleUrls: ['./check-passengers.component.scss']
})
export class CheckPassengersComponent implements OnInit {
  public template:any;
  public activateDeactivate!:string;

  private watchId:any;
  private checkpassenger!:Subscription;
  
  constructor(private _http:HttpClient,private sharedService: SharedService){ }

  ngOnInit(): void {
    var userId=parseInt(localStorage.getItem("userId")!);
    this._http.get<any>(`https://localhost:7103/api/Buses/busActiveState?userId=${userId}`).subscribe((response:any)=>{
      if(response.message != false){
        this.activateDeactivate="Deactivate";
      }else{
        this.activateDeactivate="Activate";
      }
    });
      this.template = 'info';
     this.asyncCheckPassenger();
  }
  public successError(){
    var userId=parseInt(localStorage.getItem("userId")!);
    var user={
      userId:userId
    }
    this._http.post("https://localhost:7103/api/Buses/updateUserVerification",user).subscribe((response:any)=>{
      if(response.message){
        localStorage.setItem("openCam","true");
        this.asyncCheckPassenger();
      }
    });
    this._http.post("https://localhost:7103/api/Buses/updateNumberOfPassenger",user).subscribe();
  }
  
  public activateDeactivateBtn(){
    var userId=parseInt(localStorage.getItem("userId")!);
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
        console.log(this.watchId)
        navigator.geolocation.clearWatch(this.watchId)
      }
    });
    });

  }

  private asyncCheckPassenger(){
    this.checkpassenger = interval(2000)
    .subscribe(() => {
      this.getPassengerLocalStorage();
    });
  }

  private getPassengerLocalStorage(){
    var userId=parseInt(localStorage.getItem("userId")!);
    this._http.get<any>(`https://localhost:7103/api/Buses/isUserVerified?userId=${userId}`).subscribe((response:any)=>{
      if(response.message != false){
        if(response.message=="verified" || response.message=="error"){
          this.template = response.message
          this.checkpassenger.unsubscribe();
        }else{
          this.template = response.message
        }
      }
    });
  }
}
