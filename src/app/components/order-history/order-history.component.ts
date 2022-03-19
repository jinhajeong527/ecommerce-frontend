import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }
  handleOrderHistory() {
    //read the user's email address from browser 
    //userEmail은 Login Status Component에서 저장한 key이다.
    const theEamil = JSON.parse(this.storage.getItem('userEmail'));

    //retrieve data from the service
    this.orderHistoryService.getOrderHistory(theEamil).subscribe(
      data => {
        //Server를 통해 REST API로부터 가져온 데이터가 된다. 
        this.orderHistoryList = data._embedded.orders;
      }
    );
  }

}
