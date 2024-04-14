import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http:HttpClient ,private _decodeToken:DecodeTokenService) { }

  public getCurrentPassengersInBus(): Promise<Product[]> {
    var userId=parseInt(this._decodeToken.getUserId());

    return new Promise((resolve, reject) => {
      this._http.get<any>(`https://localhost:7103/api/Buses/currentUsersInBus?userId=${userId}`).subscribe(
          (response: any) => {
              if(response.message != "empty" && response.message != "bus not found"){
                  resolve(response.message);
                }
          },
          (error: any) => {
              console.error('Error fetching products:', error);
              reject(error); // Reject the promise with the error
          }
      );
  });
  }

  public getHistoryBus(): Promise<Product[]> {
    var userId=parseInt(this._decodeToken.getUserId());

    return new Promise((resolve, reject) => {
      this._http.get<any>(`https://localhost:7103/api/Buses/busHistory?userId=${userId}`).subscribe(
          (response: any) => {
              if(response.message != "empty" && response.message != "bus not found"){
                  resolve(response.message);
                }
          },
          (error: any) => {
              console.error('Error fetching products:', error);
              reject(error); // Reject the promise with the error
          }
      );
  });
  }
}
