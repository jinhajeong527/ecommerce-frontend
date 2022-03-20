import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    //Only add an access token for secured endpoints
    const securedEndPoints = ['http://localhost:8181/api/orders'];

    if(securedEndPoints.some(url => request.urlWithParams.includes(url))) {
      //get access token
      //비동기 호출. 비동기 콜이 끝날 때까지 await를 작성해주었기 때문에 기다리게 된다. 
      const accessToken = await this.oktaAuth.getAccessToken();

      //clone the request and aadd new header with access token
      request = request.clone({ //직접적으로 바꿀 수 없기 때문에 클론한다.
        setHeaders: {
          Authorization: 'Bearer '+ accessToken
        }
      });
    }
    // return next.handle(request).toPromise(); 는 deprecated되었다. 
    return await lastValueFrom(next.handle(request));
  }
}
