import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';//short for reactive javascript

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //지금은 스프링부트 백엔드 하드코딩 해주지만 나중엔 변경할 것이다.
  private baseUrl ='http://localhost:8181/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductList(): Observable<Product[]> {
    //observable 리턴한다.
    // 스프링 데이터 레스트로 부터의 제이슨 데이타를 Product array와 맵핑한다.
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
      //리스폰스는 제이슨 파일 통째로 온 그 형식 전부를 생각하면 되고
      // 거기서 _embedded.products 이렇게 타고 들어가서 제품 리스트만 얻어온다.
    )
  }
}

interface GetResponse{
  //Unwraps the JSON from Spring Data REST _embedded entry
  _embedded:{
    products: Product[];
  }
}
