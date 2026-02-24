import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Product } from '../../../shared/interfaces/product';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { RootService } from '../../../shared/services/root.service';
import { ShopService } from '../../../shared/api/shop.service';
import { ProductService } from 'src/app/shared/api/product.service';

@Injectable({
    providedIn: 'root'
})
export class ProductResolverService implements Resolve<Product> {
    constructor(
        private root: RootService,
        private router: Router,
        private shop: ShopService,
        private productService: ProductService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
        const ProductId = route.queryParams.ProductId;

        return this.productService.GetProductById({
            ProductId: ProductId,
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
