import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

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
              private luv2ShopFormService: Luv2ShopFormService) { }//form builder injection

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email:new FormControl('',
                              [Validators.required, 
                               Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
        }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  

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
