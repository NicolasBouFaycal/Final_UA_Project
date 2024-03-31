import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const paymentGuard: CanActivateFn = (route, state) => {
  var day = localStorage.getItem("Day");
  var price = localStorage.getItem("Price");
  var planId = localStorage.getItem("PlanId");
  var router = inject(Router);
  if(day != null && price != null && planId != null  ){
    return true;
  }else{
    router.navigate(['/main/user-management/plan']);
    return false;
  }
};
