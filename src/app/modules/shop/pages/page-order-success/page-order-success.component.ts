import { Component } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { RootService } from '../../../../shared/services/root.service';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
    selector: 'app-page-order-success',
    templateUrl: './page-order-success.component.html',
    styleUrls: ['./page-order-success.component.scss']
})
export class PageOrderSuccessComponent {
    order: any;
    taxRate: number = 0;

    constructor(
        public root: RootService,
        private route: ActivatedRoute,
        public storeService: StoreService
    ) {
        this.route.data.subscribe(data => {
            this.order = data.initInfo;
        });

    }

    ngOnInit(): void {
        this.storeService.taxRate.subscribe(p => this.taxRate = p);
    }
}
