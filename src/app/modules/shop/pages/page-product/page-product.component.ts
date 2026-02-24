import { Component, OnInit } from '@angular/core';
import { Product, ProductDetail1 } from '../../../../shared/interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/shared/api/product.service';
import { map } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import { PageCategoryService } from '../../services/page-category.service';
import { PageCategoryService1 } from '../../services/page-category1.service';

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
    relatedProducts$: Observable<Product[]>;

    product: ProductDetail1;
    layout: 'standard'|'columnar'|'sidebar' = 'standard';
    sidebarPosition: 'start'|'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        public storeService: StoreService,
        public pageCategoryService: PageCategoryService1
    ) {
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.layout = data.layout || this.layout;
            this.sidebarPosition = data.sidebarPosition || this.sidebarPosition;
            this.product = data.product;

            this.storeService.addVisitedReferenceIds(this.product.ReferenceId);
            
            /* Get similar product (Same sub categroy) */
            this.relatedProducts$ = this.productService.AdvancedProductSearchClient({
                SecondCategory: this.product.SecondCategoryId,
                Lang: localStorage.getItem('lang'),
                Begin: 0,
                Step: 10
            }).pipe(map((p: any) => p.List));
        });
    }
}
