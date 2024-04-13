import { Component, OnInit } from '@angular/core';
import { PlanService } from '../Services/plan.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';
import { DecodeTokenService } from 'src/app/Core/Services/decode-token.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  day:any;
  money:any;
  planId:any;
  paymentRequest!: google.payments.api.PaymentDataRequest; // Remove the initial assignment
  public header: string="";
  public content: string="";
  public visible: boolean=false;

  constructor(private _decodeToken:DecodeTokenService,private loaderService: LoaderService,private confirmationService: ConfirmationService,private planService:PlanService,private router:Router,private _http:HttpClient){
  this.loaderService.show();
  }
  ngOnInit(): void {
    this.loaderService.hide();
    this.day=localStorage.getItem('Day');
    this.money=localStorage.getItem('Price');
    this.planId=localStorage.getItem('PlanId');

    this.initializePaymentRequest();
  }

  initializePaymentRequest(): void {
    this.paymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId'
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: this.money.toString(), 
        currencyCode: 'USD',
        countryCode: 'LB'
      },
      callbackIntents: ['PAYMENT_AUTHORIZATION']
    };
  }
  onLoadPaymentData = (event: Event): void => {
    const eventDetail = event as CustomEvent<google.payments.api.PaymentData>;
    //console.log('load payment data', eventDetail.detail);
  }
  onPaymentDataAuthorized:google.payments.api.PaymentAuthorizedHandler=(
    paymentData
  )=>{
    if(paymentData){
      let subscribe={
        UserId:this._decodeToken.getUserId(),
        PlansId:this.planId,
        ExpiryDate:this.calculateExpiryDate(this.day)
      }
      this.loaderService.show();
      this._http.post<any>('https://localhost:7103/api/Users/subscribe', subscribe).subscribe((response:any) => {
        if(response.message == true ){
          this.loaderService.hide();
          this.confirm1("Attention","Plan registered Succesfully");
        }
        else{
          this.loaderService.hide();
          this.showDialog("Attention","Something went wrong please try again");
        }
      });      
    }
    return{
      transactionState:'SUCCESS'
    };
  }
  onError=(event:ErrorEvent):void=>{
    this.showDialog("Alert","Payment Failed");

    console.error('error',event.error);
  }

  public goBack(){
    localStorage.removeItem('Day');
    localStorage.removeItem('Price');
    localStorage.removeItem('PlanId');
    this.router.navigate(['/main/user-management/plan']);
  }
  
  private showDialog(header:string,content:string) {
    this.header=header;
    this.content=content;
    this.visible = true;
  }

  calculateExpiryDate(days: number): string {
    const currentDate = new Date(); // Current date
    const expiryDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000); // Adding days

    const day = expiryDate.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0'); // Get month (months are zero-based) and pad with zero if needed
    const year = expiryDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  confirm1(header:string,message:string) {
    this.confirmationService.confirm({
        message: message,
        header: header,
        icon: "",
        accept: () => {
          localStorage.removeItem('Day');
          localStorage.removeItem('Price');
          localStorage.removeItem('PlanId');
    
          this.router.navigate(['/main/map']);        },
        reject: () => {
            
        }
    });
  }

}
