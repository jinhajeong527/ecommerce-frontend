import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl ='http://localhost:8181/api/countries';
  private statesUrl ='http://localhost:8181/api/states';

  constructor(private httpClient: HttpClient) { }
  //months, years를 위한 메서드를 추가한다.
  getCountiries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{
    //search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

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

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}
interface GetResponseStates {
  _embedded: {
    states: State[]; 
  }
}



