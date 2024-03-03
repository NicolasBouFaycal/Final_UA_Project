import { Component, OnInit } from '@angular/core';
import { PlanService } from '../Services/plan.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  day:any;
  money:any;
  paymentRequest!: google.payments.api.PaymentDataRequest; // Remove the initial assignment

  constructor(private planService:PlanService){
  }
  ngOnInit(): void {
    this.day=this.planService.getPlanDay()
    this.money=this.planService.getPlanMoney();
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
    console.log('load payment data', eventDetail.detail);
  }
  onPaymentDataAuthorized:google.payments.api.PaymentAuthorizedHandler=(
    paymentData
  )=>{
    console.log('payment authorized',paymentData);
    return{
      transactionState:'SUCCESS'
    };
  }
  onError=(event:ErrorEvent):void=>{
    console.error('error',event.error);
  }
}
