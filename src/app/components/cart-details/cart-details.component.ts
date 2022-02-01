import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  constructor(private cartService: CartService) { }//카트 서비스 인젝트 한다.
  //카트 서비스 구독하다가 퍼블리쉬 하면, 섭스크라이브해서 해당 컴포넌트에 값 반영할 것.

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    //get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //cart totalPrice를 섭스크라이브 한다.
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //cart totalQuantity를 섭스크라이브 한다.
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  
    //카트 totalPrice, totalQuantity를 계산한다.
    this.cartService.computeCartTotals();

  }
  //플러스 버튼 누르면 개수가 추가되도록 하는 메서드.
  incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem: CartItem) {
      this.cartService.decrementQuantity(theCartItem);
  }
  remove(theCartItem: CartItem){
    this.cartService.remove(theCartItem);
  }

}
