import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';

export const driverGuard: CanActivateFn = (route, state) => {
  var decodeToken=inject(DecodeTokenService)
  var userLogedIn=decodeToken.getUserId();
  var router=inject(Router);
  var http=inject(HttpClient);
  if(userLogedIn == null){
    router.navigate(['/main/map']);
    return false
  }else{
    return http.get<string>(`https://localhost:7103/api/Users/userRole?userId=${userLogedIn}`)
    .pipe(
      map((response:any) => response.message === 'Driver'), // Map response to boolean
      tap(isDriver => {
        if (!isDriver) {
          router.navigate(['/main/map']);
        }
      }),
      catchError(() => {
        // Handle errors from the HTTP request
        console.error('Error checking user role:', Error);
        return of(false); // Return false on error
      })
    );
  }
};
