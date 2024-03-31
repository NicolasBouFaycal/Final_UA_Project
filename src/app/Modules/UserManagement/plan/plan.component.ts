import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../Services/plan.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  public plans:any;
  private subscriptionId:any;
  public header: string = "";
  public content: string = "";
  public visible: boolean = false;

  constructor(private loaderService: LoaderService,private confirmationService: ConfirmationService,private _http:HttpClient,private router: Router,private planService:PlanService){
    this.loaderService.show();
    this.LoadPlans();
  }

  ngOnInit(): void {
    this.loaderService.hide();
  }
  
  public goToPayment(day:any,money:any,planId:any){
    
    let params = new HttpParams()
      .set('userId', parseInt(localStorage.getItem("userId")!));
    this.loaderService.show();
    this._http.get<any>('https://localhost:7103/api/Plans/checkPlanIfExist',{params}).subscribe((response:any) => {
      if(response.message){
        this.loaderService.hide();
        let message = `Already Subscribed to plan: 
                    - Day : ${response.message.day}
                    - Price: ${response.message.price}$
                    - ExpiryDate: ${response.message.expiryDate}
                    Would you like to remove it for a new Subscription?`;
        this.subscriptionId = response.message.subscriptionId
        this.confirm1("Attention",message,money,day,planId);
      }else{
        this.loaderService.hide();
        localStorage.setItem('Price', money);
        localStorage.setItem('Day', day);
        localStorage.setItem('PlanId', planId);
        this.planService.setSelectedPlan(day,money,planId);
        this.router.navigate(['/main/user-management/payment']);
      }
    });
  }

  public goBack(){
    this.router.navigate(['/main/map']);
  }

  private LoadPlans(){
    this.loaderService.show();
    this._http.get("https://localhost:7103/api/Plans/plans").subscribe((response:any)=>{
      this.plans= response.message;
      this.loaderService.hide();
    });
  }

  private confirm1(header:string,message:string,money:any=null,day:any=null,planId:any=null) {
    this.confirmationService.confirm({
        message: message,
        header: header,
        icon: "",
        accept: () => {

          let params = new HttpParams()
          .set('subscriptionId', this.subscriptionId);
          this.loaderService.show();
          this._http.get<any>('https://localhost:7103/api/Plans/removeExistingSubscription',{params}).subscribe((response:any) => {
            if(response.message){
              this.loaderService.hide();
              localStorage.setItem('Price', money);
              localStorage.setItem('Day', day);
              localStorage.setItem('PlanId', planId);
              this.planService.setSelectedPlan(day,money,planId);
              this.router.navigate(['/main/user-management/payment']);
            }else{
              this.loaderService.hide();
              this.showDialog("Attention","Something went wrong when trying to remove subscription")
            }
          });
        },
        reject: () => {
          this.router.navigate(['/main/map']);
        }
    });
  }
  private showDialog(header:string,content:string) {
    this.header=header;
    this.content=content;
    this.visible = true;
  }
}
