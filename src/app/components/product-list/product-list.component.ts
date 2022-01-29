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
  
  products: Product[] =[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string ='Books';//추가
  searchMode: boolean = false;

  //페이지네이션을 위한 프로퍼티를 추가한다.
  thePageNumber: number = 1;
  thePageSize: number = 5;//디폴트 값과 일치시킨다.
  theTotalElements: number = 0;
  
  previousKeyword: string = null;

  
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
    // 전과는 다른 키워드가 있으면, thePageNumber를 1로 setting 한다.
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);


    //now search for the products using keyword...
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               theKeyword)
                                               .subscribe(this.processResult());
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
    /*
    Check if we have a diff category than prev
    Note: Angular will reuse a component if it is currently being viewed
    우리 만약에 전과 다른 카테고리 아이디가 있다면, 페이지 넘버를 다시 1으로 돌려야 한다.
    that's the rational for adding this code.
    */
   if(this.previousCategoryId != this.currentCategoryId){
     this.thePageNumber = 1;
   }
   this.previousCategoryId = this.currentCategoryId;
   
   console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
   


    //method는 subscribe 하는 순간에 invoke 된다.
    this.productService.getProductListPaginate(this.thePageNumber-1,//여기는 1 base, spring boot 는 0 베이스 이다.
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());

  }

  processResult() {//GetResponseProducts를 통해 가져온 데이터를 프로세싱 한다.
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;//Spring Data REST: pages are 0 based
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  updatePageSize(pageSize: number){
    console.log(pageSize);
    this.thePageSize = pageSize;
    this.thePageNumber = 1;//reset
    this.listProducts();
  }

}
