import { Component, Input, OnInit } from '@angular/core';
import { ProductFeaturesSection, ProductDetail1 } from '../../../../shared/interfaces/product';
import { Review } from '../../../../shared/interfaces/review';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-product-tabs',
    templateUrl: './product-tabs.component.html',
    styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent implements OnInit {

    hideRatingModule = environment.hideRatingModule;

    private dataProduct: ProductDetail1;

    @Input() withSidebar = false;
    @Input() tab: 'description' | 'specification' | 'reviews' = 'description';

    @Input() product;

    constructor(public translateService: TranslateService) {
    }

    ngOnInit(): void {
    }

    getInformationList() {
        let list = [];
        Object.keys(this.product).map(key => {
            switch (key) {
                case 'MainCategoryLabel':
                    list.push({
                        Label: this.translateService.instant('product.MainCategoryLabel'),
                        Value: this.product[key],
                        Order: 0
                    });
                    break;
                case 'SecondCategoryLabel':
                    list.push({
                        Label: this.translateService.instant('product.SecondCategoryLabel'),
                        Value: this.product[key],
                        Order: 1
                    });
                    break;
                case 'ReferenceCode':
                    list.push({
                        Label: this.translateService.instant('product.reference'),
                        Value: this.product[key],
                        Order: 3
                    });
                    break;

                case 'QuantityPerParcel':
                    if (this.product[key] != null) {
                        list.push({
                            Label: this.translateService.instant('product.QuantityPerParcel'),
                            Value: this.product[key] + ' PCS',
                            Order: 4
                        });
                    }
                    break;

                case 'QuantityPerBox':
                    if (this.product.QuantityPerParcel != null) {
                        list.push({
                            Label: this.translateService.instant('product.QuantityPerBox'),
                            Value: this.product[key] + ' PCS',
                            Order: 5
                        });
                    }
                    else {
                        list.push({
                            Label: this.translateService.instant('product.QuantityPerParcel'),
                            Value: this.product[key] + ' PCS',
                            Order: 5
                        });
                    }
                    break;

                case 'Color':
                    list.push({
                        Label: this.translateService.instant('product.Color'),
                        Value: this.product[key],
                        Order: 6
                    });
                    break;
                case 'Material':
                    list.push({
                        Label: this.translateService.instant('product.Material'),
                        Value: this.product[key],
                        Order: 7
                    });
                    break;


                case 'Size':
                    list.push({
                        Label: this.translateService.instant('product.Size'),
                        Value: this.product[key],
                        Order: 8
                    });
                    break;
                case 'Forme':
                    list.push({
                        Label: this.translateService.instant('product.Forme'),
                        Value: this.product[key],
                        Order: 9
                    });
                    break;
            }
        });
        return list.sort((a,b)=>a.Order-b.Order);
    }
}
