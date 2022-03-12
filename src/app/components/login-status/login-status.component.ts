import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated?: boolean = false;
  userFullName?: string;
  //최신 버전 OktaAuth를 사용할 경우 아래와 같이 의존성 주입해주어야 한다.
  //OktaAuthService만 인젝트 해주면 안된다. 
  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes

    this.oktaAuthService.authState$.subscribe(

      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }

    );
  }
  getUserDetails() {

    if (this.isAuthenticated) {
      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (result) => {
          this.userFullName = result.name;
        }
      );
    }
  }
  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
  }

}






