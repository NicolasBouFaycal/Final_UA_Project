import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public role!:number;
  constructor() { }
  public setLogedUser(roleNumber:number){
    this.role = roleNumber;
  }
  public getLogedUser(){
    return this.role;
  }
}
