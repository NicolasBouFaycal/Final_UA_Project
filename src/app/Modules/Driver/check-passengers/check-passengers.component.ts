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
  private checkpassenger!:Subscription;
  
  constructor(private sharedService: SharedService){ }

  ngOnInit(): void {
      this.template = 'info';
     this.asyncCheckPassenger();
  }
  public successError(){
    this.template = 'info'
  }

  private asyncCheckPassenger(){
    this.checkpassenger = interval(2000)
    .subscribe(() => {
      this.getPassengerLocalStorage();
    });
  }
  private getPassengerLocalStorage(){
    var isPassenger = localStorage.getItem("passenger")
    if(isPassenger !=null){
      if(isPassenger == "true"){
        this.template="verified"
  
      }else{
        this.template = "error"
      }
      localStorage.removeItem("passenger")
    }
  }
}
