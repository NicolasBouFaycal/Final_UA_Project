import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';

export const userGuard: CanActivateFn = (route, state) => {
  var decodeToken=inject(DecodeTokenService)
  var userLogedIn=decodeToken.getUserId();
  var router=inject(Router);
  if(userLogedIn != null){
    return true;
  }
  else{
    router.navigate(['/main/map']);
    return false;
  }
};
