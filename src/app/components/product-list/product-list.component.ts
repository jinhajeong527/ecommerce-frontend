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

  //ProductService inject 
  constructor(private productService: ProductService,
              private route: ActivatedRoute//useful for accessing route parameters
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
        this.listProducts();
    });
  }

  listProducts() {

    //check if "id" parameter is available..
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" param string. convert string to a number useing "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      //when catogory id is avalable 기본 카테고리 1로 세팅한다.
      this.currentCategoryId = 1;
    }
    //method는 subscribe 하는 순간에 invoke 된다..
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
