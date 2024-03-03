import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  day:any;
  money:any
  constructor() { }

  public setSelectedPlan(day:any,money:any){
    this.day=day;
    this.money=money;
  }
  public getPlanDay(){
    return this.day
  }
  public getPlanMoney(){
    return this.money
  }
}
