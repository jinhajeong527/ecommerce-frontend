import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { MyShopValidators } from 'src/app/validators/my-shop-validators';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;//collection of form control 및 form element or other groups
  
  //CartService 에서 받아오는 정보
  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] =[];

  shippingAddressStates: State[] =[];
  billingAddressStates: State[] =[];

  storage: Storage = sessionStorage;

  creditCardYears: number[] =[];
  creditCardMonths: number[]=[];

  constructor(private formBuilder: FormBuilder,//form builder injection
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService, //CartService에서 발행하는 최신의 토탈 price와 quantity 정보 받아오기 위함
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.riviewCartDetails();

    //read the user's eamil address from brower storage
    const theEamil = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2), 
                                   MyShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
                                 [Validators.required, 
                                  Validators.minLength(2),
                                  MyShopValidators.notOnlyWhitespace]),
        email:new FormControl(theEamil,
                              [Validators.required, 
                               Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
        }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                     MyShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                   MyShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),//드롭다운 리스트이기 때문에, required만 적용해준다.
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      MyShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                     MyShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                   MyShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),//드롭다운 리스트이기 때문에, required만 적용해준다.
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      MyShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
                                         MyShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),//16개의 숫자만
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),//3개의 숫자만
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    //populate credit card months
    //0 based month so we need to add 1 after using getMonth() method
    const startMonth: number = new Date().getMonth() +1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months "+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    //populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
    //populate the countries
    this.luv2ShopFormService.getCountiries().subscribe(
      data => {
        console.log("Retrived countries")+ JSON.stringify(data);
        this.countries = data;
      }
    );
  }

  riviewCartDetails() {
    //cartService.totalQuantity 구독
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    //cartService.totalPrice 구독
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  //이 메서드들을 html 템플릿에서 form control에 접근하기 위해서 실제로 사용하게 된다. 
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event){
    if(event.target!.checked){
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      //bug fix for states. 빌링 어드레스로 shipping Address copy시 states값 넘어가지 않았음.
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      //bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log("handling the submit button");

    if(this.checkoutFormGroup.invalid){//form validation이 invalid 하면
      this.checkoutFormGroup.markAllAsTouched();
      return;//invalid하면 이 메서드의 다른 코드들 실행시키지 않겠다는 뜻.
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    // -longway(Empty Array 만든뒤에 Looping 하는 것)
    // let orderItems: OrderItem[] = [];
    // for(let i=0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    //- shortway of doing the same thing
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        //성공했을 때
        next: response => {
          alert(`Your order has been received. Order tracking number: ${response.orderTrackingNumber}`);
        
        //카트 비우기
        this.resetCart();
        },
        //에러 발생했을 때
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }
  //주문 완료 후에 카트 리셋하기
  resetCart() {
    //cart data reset
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form 
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    //선택된 년도가 현재 년도와 일치하는지를 확인한다.
    let startMonth: number;
    if(currentYear===selectedYear){
      startMonth = new Date().getMonth() +1;//everything is zero based for month
    }else{
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {//passing shipping address either billing address..
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;//이건 꼭 rest api 부를 필요는 없음. 디버깅 목적.
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName =='shippingAddress'){
            this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }
        //select first item by default. state 값 디폴트 옵션값 설정.
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }
}
