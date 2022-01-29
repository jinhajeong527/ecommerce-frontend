import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';//short for reactive javascript
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //지금은 스프링부트 백엔드 하드코딩 해주지만 나중엔 변경할 것이다.
  // ?size=100 이렇게 불러오는 데이터 수 정할 수 있지만
  //현재는 이렇게 두고 나중에 페이지네이션 기능 추가할 것.
  private baseUrl = 'http://localhost:8181/api/products';
  private categoryUrl =' http://localhost:8181/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> { 
    //제품 아이디에 기반하여 URL을 빌드해야 한다.
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  //페이지네이션에 기반하여 상품 리스트 불러오기
  getProductListPaginate(thePage:number, 
                         thePageSize:number, 
                         theCategoryId: number): Observable<GetResponseProducts> {//Product[]가 아니고, 수정한 인터페이스에 접근함에 유의하자.
    //need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl); 
  }
  //이거는 Observable을 리턴한다는 것에 주의하자.
  // 스프링 데이터 레스트로 부터의 제이슨 데이타를 Product array와 맵핑한다.
  getProductList(theCategoryId: number): Observable<Product[]> {
    //카테고리 아이디에 기반하여 URL 빌드해야 한다.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
    
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage:number, 
                        thePageSize:number, 
                        theKeyword: string): Observable<GetResponseProducts> {//Product[]가 아니고, 수정한 인터페이스에 접근함에 유의하자.
    //need to build URL based on keywork, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl); 
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products));
      //리스폰스는 제이슨 파일 통째로 온 그 형식 전부를 생각하면 되고
      // 거기서 _embedded.products 이렇게 타고 들어가서 제품 리스트만 얻어온다.
      //실제로 검색해보면 _embedded key 값 볼 수 있다.
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
      );
  }
}

interface GetResponseProducts {
  //위에는 Observable을 리턴하고, 여기서 
  //Unwraps the JSON from Spring Data REST _embedded entry
  _embedded:{
    products: Product[];
  },
  page: {
    size: number, //size of this page
    totalElements: number, //total count
    totalPages: number, //total page available
    number: number //current page number
  }
}

interface GetResponseProductCategory {//위에는 Observable을 리턴하고, 여기서 
  //Unwraps the JSON from Spring Data REST _embedded entry
  _embedded: {
    productCategory: ProductCategory[];
  }
}
