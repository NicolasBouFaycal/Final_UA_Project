import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  var userLogedIn=localStorage.getItem("userId");
  var router=inject(Router);
  if(userLogedIn != null){
    return true;
  }
  else{
    router.navigate(['/main/map']);
    return false;
  }
};
