import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-page-delivery-info',
  templateUrl: './page-delivery-info.component.html',
  styleUrls: ['./page-delivery-info.component.scss']
})
export class PageDeliveryInfoComponent implements OnInit {

  constructor(public storeService: StoreService) { }

  ngOnInit(): void {
  }

}
