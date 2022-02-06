import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor() { }
  //months, years를 위한 메서드를 추가한다.

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    //Month dropdown list를 위한 array 빌드
    for(let theMonth = startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }

    return of(data);

  }
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    //build an array for Year dropdown list
    //현재 년도에서 시작해서 십년 후까지 룹 돌린다.
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear ; theYear++){
      data.push(theYear);
    }

    return of(data);//to wrap an object as an Observable
  }

}



