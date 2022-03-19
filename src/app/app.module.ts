import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
/* OktaAuth 사용하기 위한 설정 */
import { OktaAuth } from '@okta/okta-auth-js';
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard
} from '@okta/okta-angular';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const routes: Routes = [
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [ OktaAuthGuard ]},
  { path: 'members', component: MembersPageComponent, canActivate: [ OktaAuthGuard ]},//if authenticated give access to route. else, send to login page
  { path: 'login/callback', component: OktaCallbackComponent},
  { path: 'login', component: LoginComponent},
   //제품 리스트 보여주는 화면에 카테고리 이름도 넣기 위해서 수정되었다.
  { path: 'category/:id/:name', component: ProductListComponent },
  // 체크 아웃 폼
  { path: 'checkout', component: CheckoutComponent },
  // 카트 디테일
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  //키워드로 제품 검색하기
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo:'/products', pathMatch: 'full'},
  { path: '**', redirectTo:'/products', pathMatch:'full'}
];

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);

const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),//**나중에 한번더 살펴보기
    BrowserModule,
    HttpClientModule,
    NgbModule,//ng-bootstrap
    ReactiveFormsModule,
    OktaAuthModule
  ],
  
  providers: [ProductService,  { provide: OKTA_CONFIG, useValue: {oktaAuth} }],  //can inject that given service by doing so
  bootstrap: [AppComponent]                          
})
export class AppModule { }
