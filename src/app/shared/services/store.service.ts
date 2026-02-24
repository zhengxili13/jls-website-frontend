import { Injectable } from '@angular/core';
import { ReferenceService } from '../api/reference.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Product1 } from '../interfaces/product';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    address = '';
    email = '';
    phone = '';
    hours = '';
    fax = '';

    public categoryList = new BehaviorSubject<any[]>([]);
    public storeInfo = new BehaviorSubject<any[]>([]);
    public taxRate = new BehaviorSubject<number>(0);
    public mainPageProductInfo = new BehaviorSubject<any[]>([]);
    public slideList = new BehaviorSubject<any[]>([]);
    public shippingInfo = new BehaviorSubject<string>('');

    public visitedReferenceIds = new BehaviorSubject<number[]>([]);
    public referenceCategoryList = new BehaviorSubject<any[]>([]);
    public numberOfFavoritProduct = new BehaviorSubject<number>(0);

    /* Only one progress bar in application */
    public showHideProgressBar$ = new BehaviorSubject<boolean>(false);

    constructor(
        referenceService: ReferenceService,
        translateService: TranslateService
    ) {
        this.loadVisitedReferenceIds();
        // todo add into a global service, change when we change language
        this.storeInfo.subscribe(result => {
            if (result?.length) {
                this.address = result.find(p => p.Code === "StoreInfo_Address")?.Label || '';
                this.email = result.find(p => p.Code === "StoreInfo_Email")?.Label || '';
                this.phone = result.find(p => p.Code === "StoreInfo_Telephone")?.Label || '';
                this.hours = result.find(p => p.Code === "StoreInfo_Hour")?.Label || '';
                this.fax = result.find(p => p.Code === "StoreInfo_Fax")?.Label || '';
            }
        });
    }

    /* Format product discount information */
    formatProductPromotionInfo(product: any) {
        if (product?.PreviousPrice != null && product.PreviousPrice > product.Price) {
            return {
                previousPrice: product.PreviousPrice,
                discountPerCent: -Math.ceil((1 - product.Price / product.PreviousPrice) * 100)
            };
        }
        return null;
    }

    /* TODO place into share function */
    calculCommentAverageNote(commentList: any[]): number {
        if (!commentList?.length) {
            return 5;
        }

        const sum = commentList.reduce((acc, current) => acc + current.Level, 0);
        return sum / commentList.length;
    }

    private loadVisitedReferenceIds(): void {
        const items = localStorage.getItem('visitedReferenceIds');
        if (items) {
            this.visitedReferenceIds.next(JSON.parse(items));
        }
    }

    public addVisitedReferenceIds(referenceId: number): void {
        const itemStringy = localStorage.getItem('visitedReferenceIds');
        const items: number[] = itemStringy ? JSON.parse(itemStringy) : [];

        if (!items.includes(referenceId)) {
            if (items.length >= 10) {
                items.shift();
            }
            items.push(referenceId);
        }

        localStorage.setItem('visitedReferenceIds', JSON.stringify(items));
        this.visitedReferenceIds.next(items);
    }
}
