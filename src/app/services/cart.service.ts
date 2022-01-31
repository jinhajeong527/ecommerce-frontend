import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  //서브젝트는 오브저버블의 섭클래스이며, 우리 코드에서 이벤트 퍼블리쉬를 위해 사용할 수 있다.
  //모든 섭스크라이버들에게 이벤트가 보내질 것.
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(theCartItem: CartItem){
    
    //이미 카트에 선택한 아이템이 있는지를 체크한다.
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;
    //Type 'undefined' is not assignable to type 'CartItem'.
    //You can now use the non-null assertion operator
    //It tells TypeScript that even though something looks like it could be null, 
    //it can trust you that it's not: ! 붙여주기..

    if(this.cartItems.length > 0) {
      //첫번째로 찾은거 리턴하고, 못찾으면 undefined 리턴한다.
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      /*find(): Returns the value of the first element in the array 
        where predicate is true, and undefined otherwise.
      */
     //아이템 찾았는지 체크한다. (길이 0 아니고, 언디파인이 아닐 때 true)
     alreadyExistsInCart = (existingCartItem != undefined);
    }
    if(alreadyExistsInCart) {
      //퀀티티를 늘려준다.
      existingCartItem.quantity++;
    } else {
      //그게 아니라면 그냥 배열에 추가시키면 된다.
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number =0;
    let totalQuantityValue: number = 0;
    //for문 사용해서 다 합친다.
    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new value ...all subscribers will receive the new data
    //next 각각 마다 이벤트 발행하므로 여기서 총 두개의 이벤트를 발행하게 되는 것이다 for totalPrice, totalQuantity
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity *  tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);//only show two digits after decimal
    console.log('----------');
  }
}
