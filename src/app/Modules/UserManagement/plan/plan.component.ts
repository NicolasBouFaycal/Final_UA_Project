import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../Services/plan.service';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent {

  constructor(private router: Router,private planService:PlanService){}
  
  public goToPayment(day:any,money:any){
    this.planService.setSelectedPlan(day,money);
    this.router.navigate(['/main/user-management/payment']);
  }
}
