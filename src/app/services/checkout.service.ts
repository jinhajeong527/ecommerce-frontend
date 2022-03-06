import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  //Spring Boot REST endpoint로의 url을 작성해준다.
  private purchaseUrl = 'http://localhost:8181/api/checkout/purchase';

  //HTTP client injection
  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase) : Observable<any> {
    
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);

  }
}
