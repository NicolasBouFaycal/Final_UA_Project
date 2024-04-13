import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {
  private jwtHelper! :JwtHelperService
  constructor(private _http:HttpClient,private router:Router) { }

  public refreshToken(){
    var token = localStorage.getItem("accessToken")!;
    if (token) {
      // Decode the token to get the expiration time
      const tokenPayload = this.decodeToken(token);
      var tokenDetails={
        Token:localStorage.getItem("refreshToken")!,
        UserName:tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        Email:tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        RoleName:tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        UserId:tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      }
      this._http.post("https://localhost:7103/api/Authentication/refreshToken",tokenDetails).subscribe((response:any)=>{
        if(response.message == false){
          throwError("Something went wrong");
        }else if(response.message == "/main/authentication/login"){
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          this.router.navigate(["/main/authentication/login"]);
        }else{
          localStorage.setItem("accessToken",response.message.accessToken);
          localStorage.setItem("refreshToken",response.message.Token);
        }
      });
    }
  }

  public decodeToken(token: string): any {
    try {
      const accessToken = token;
      const helper = new JwtHelperService();
      return helper.decodeToken(accessToken);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  public getUserId(){
    var accessToken=localStorage.getItem("accessToken")!;
    var decodeToken = this.decodeToken(accessToken);
    if(decodeToken != null){
      return decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']

    }
  }
}
