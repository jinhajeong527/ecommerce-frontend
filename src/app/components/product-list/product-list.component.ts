import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;//추가
  searchMode: boolean;

  //ProductService inject 
  constructor(private productService: ProductService,
              private route: ActivatedRoute//useful for accessing route parameters
              //프로덕트 리스트 컴포넌트에 라우트 심어준다.
    ) { }

  ngOnInit(): void {//시작할 때, 라우트가 listProduct 구독하도록 한다.
    this.route.paramMap.subscribe(() =>{
        this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    //now search for the products using keyword...
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts(){
    //check if "id" parameter is available..
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" param string. convert string to a number useing "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
      //라우터 링크에 의해 전달된 네임 파라미터를 읽을 것이다.
    } else {
      //when catogory id is avalable 기본 카테고리 1로 세팅한다.
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    //method는 subscribe 하는 순간에 invoke 된다..
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )

  }

}
