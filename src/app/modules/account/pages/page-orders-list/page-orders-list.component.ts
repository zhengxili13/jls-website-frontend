import { Component } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-page-orders-list',
    templateUrl: './page-orders-list.component.html',
    styleUrls: ['./page-orders-list.component.sass']
})
export class PageOrdersListComponent {
    public orders: any[] = [];

    constructor(public route: ActivatedRoute) {
        this.route.data.subscribe(data => {
            this.orders = data.initInfo;
        });
    }
}
