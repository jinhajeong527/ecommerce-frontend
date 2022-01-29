import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';

const routes: Routes = [
   //제품 리스트 보여주는 화면에 카테고리 이름도 넣기 위해서 수정되었다.
  { path: 'category/:id/:name', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  //키워드로 제품 검색하기
  { path: 'search/:keyword', component: ProductListComponent },
 
 
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo:'/products', pathMatch: 'full'},
  { path: '**', redirectTo:'/products', pathMatch:'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent
  ],
  imports: [
    RouterModule.forRoot(routes),//**나중에 한번더 살펴보기
    BrowserModule,
    HttpClientModule,
    NgbModule//ng-bootstrap
  ],
  providers: [ProductService],//can inject that given service by doing so
  bootstrap: [AppComponent]
})
export class AppModule { }
