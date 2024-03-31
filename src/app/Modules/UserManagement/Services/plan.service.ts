import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  day:any;
  money:any;
  planId:any;
  constructor() { }

  public setSelectedPlan(day:any,money:any,planId:any){
    this.day = day;
    this.money = money;
    this.planId = planId;
  }
  public getPlanDay(){
    return this.day
  }
  public getPlanMoney(){
    return this.money
  }

  public getPlanId(){
    return this.planId;
  }
}
