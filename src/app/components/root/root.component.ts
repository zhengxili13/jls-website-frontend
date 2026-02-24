import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
    selector: 'app-main',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent {
    headerLayout: 'classic' | 'compact' = 'classic';

    // Using Angular's modern destroy ref pattern for safe observables
    private destroyRef = inject(DestroyRef);

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public storeService: StoreService,
        public wishListService: WishlistService
    ) {
        this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
            this.headerLayout = data['headerLayout'];

            const initInfoZero = data['initInfo'][0] || [];
            this.storeService.storeInfo.next(initInfoZero.filter((p: any) => p.ReferenceCategoryLabel === 'StoreInfomation'));

            const taxRate = initInfoZero.find((p: any) => p.ReferenceCategoryLabel === 'TaxRate');
            if (taxRate?.Value != null) {
                this.storeService.taxRate.next(taxRate.Value);
            }

            const shippingMessage = initInfoZero.find((p: any) => p.ReferenceCategoryLabel === 'InAppMessage' && p.Code === 'ShippingMessage');
            if (shippingMessage?.Label != null) {
                this.storeService.shippingInfo.next(shippingMessage.Label);
            }

            this.storeService.categoryList.next(data['initInfo'][1]);
            this.storeService.slideList.next(data['initInfo'][2]);
            this.storeService.referenceCategoryList.next(data['initInfo'][3]?.ReferenceCategoryList || []);
        });

        this.wishListService.loadUserFavoriteList();
    }
}
