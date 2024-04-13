import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { DecodeTokenService } from '../Services/decode-token.service';
import { Router } from '@angular/router';

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(private decodeToken:DecodeTokenService,private _http:HttpClient,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var token = localStorage.getItem("accessToken")!;
     // Check if token exists
     if (token) {
      // Decode the token to get the expiration time
      const tokenPayload = this.decodeToken.decodeToken(token);
      const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds

      // Check if token has expired
      if (expirationTime < Date.now()) {
         this.decodeToken.refreshToken();
      }
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }else if(request.url.includes('/login')){
      return next.handle(request);
    }else if(request.url.includes('/register')){
      return next.handle(request);
    }else if(request.url.includes('/buses')){
      return next.handle(request);
    }else if(request.url.includes('/busRouteInfo')){
      return next.handle(request);
    }else if(request.url.includes('/specificBusDetails')){
      return next.handle(request);
    }else if(request.url.includes('/routes')){
      return next.handle(request);
    }else{
      return throwError("No token found");
    }
  }
}
