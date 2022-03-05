import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { MyShopValidators } from 'src/app/validators/my-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;//collection of form control 및 form element or other groups

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] =[];

  shippingAddressStates: State[] =[];
  billingAddressStates: State[] =[];

  creditCardYears: number[] =[];
  creditCardMonths: number[]=[];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService) { }//form builder injection

  ngOnInit(): void {

    this.riviewCartDetails();

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
        email:new FormControl('',
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
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
    console.log("shipping address country is "+this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("shipping address state is "+this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
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
