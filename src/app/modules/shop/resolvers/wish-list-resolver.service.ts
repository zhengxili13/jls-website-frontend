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
export class WishListResolverService implements Resolve<ProductsList> {
    constructor(
        private root: RootService,
        private router: Router,
        private shop: ShopService,
        private productService: ProductService,
        public storeService: StoreService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsList> {

        return this.productService.GetFavoriteListByUserId({
            UserId: localStorage.getItem('userId'),
            Lang: localStorage.getItem('lang')
        }).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 404) {
                    this.router.navigate([this.root.notFound()]).then();
                }

                return EMPTY;
            })
        );
    }
}
