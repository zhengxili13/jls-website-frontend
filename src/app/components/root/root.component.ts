import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
    selector: 'app-main',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent {
    headerLayout: 'classic' | 'compact';
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public storeService: StoreService,
        public wishListService: WishlistService
    ) {

        this.route.data.subscribe(data => {
            this.headerLayout = data.headerLayout;
            storeService.storeInfo.next(data.initInfo[0].filter(p => p.ReferenceCategoryLabel == 'StoreInfomation'));
            var taxRate = data.initInfo[0].find(p => p.ReferenceCategoryLabel == 'TaxRate');
            if (taxRate != null && taxRate.Value != null) {
                storeService.taxRate.next(taxRate.Value);
            }

            var shippingMessage = data.initInfo[0].find(p => p.ReferenceCategoryLabel == 'InAppMessage' && p.Code == 'ShippingMessage');
            if (shippingMessage != null && shippingMessage.Label != null) {
                this.storeService.shippingInfo.next(shippingMessage.Label);
            }

            storeService.categoryList.next(data.initInfo[1]);
            storeService.slideList.next(data.initInfo[2]);
            storeService.referenceCategoryList.next(data.initInfo[3].ReferenceCategoryList);
        });

        this.wishListService.loadUserFavoriteList();
    }
}
