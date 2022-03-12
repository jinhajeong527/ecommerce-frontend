import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import * as OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config'//okta config file import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true, //proof key for code exchange
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
   }

  ngOnInit(): void {
    this.oktaSignin.remove(); //이전의 element 지운다.
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, //render element with given id
      // 여기에 적어준 이름은 login.component.html에 있는 div tag id와 동일해야 한다.
      (response) => {
        if(response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error) => {
        throw error;
      }
    );
  }

}
