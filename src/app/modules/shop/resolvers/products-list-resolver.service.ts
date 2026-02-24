import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { ProductsList } from '../../../shared/interfaces/list';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { RootService } from '../../../shared/services/root.service';
import { ListOptions, ShopService } from '../../../shared/api/shop.service';
import { ProductService } from 'src/app/shared/api/product.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Injectable({
    providedIn: 'root'
})
export class ProductsListResolverService implements Resolve<ProductsList> {
    constructor(
        private root: RootService,
        private router: Router,
        private shop: ShopService,
        private productService: ProductService,
        public storeService: StoreService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsList> {
        var criteria: any = {
            Begin: 0,
            Step: 12,
            Lang: localStorage.getItem('lang')
        };

        var categoryShortLabel = route.queryParams.CategoryLabel;
        var searchText = route.queryParams.SearchText;
        if (categoryShortLabel != null && categoryShortLabel == "MainCategory") {
            criteria.MainCategory = route.queryParams.ReferenceItemId
        }
        else if (categoryShortLabel != null && categoryShortLabel == "SecondCategory") {
            criteria.SecondCategory = route.queryParams.ReferenceItemId
        }

        if(searchText!=null){
            criteria.SearchText = searchText;
        }

        return this.productService.AdvancedProductSearchClient(criteria).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 404) {
                    this.router.navigate([this.root.notFound()]).then();
                }

                return EMPTY;
            })
        );
    }
}
