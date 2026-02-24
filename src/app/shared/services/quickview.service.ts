import { Injectable, OnDestroy } from '@angular/core';
import { Product, Product1 } from '../interfaces/product';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ProductService } from '../api/product.service';

@Injectable({
    providedIn: 'root'
})
export class QuickviewService implements OnDestroy {
    private destroy$: Subject<void> = new Subject();
    private showSubject$: Subject<Product> = new Subject();

    show$: Observable<Product> = this.showSubject$.pipe(takeUntil(this.destroy$));

    constructor(public productService: ProductService) { }

    show(product: Product1): Observable<void> {
        const userId = localStorage.getItem('userId');
        const lang = localStorage.getItem('lang');

        const criteria: any = {
            ProductId: product.ProductId,
            Lang: lang
        };

        if (userId) {
            criteria.UserId = userId;
        }

        return this.productService.GetProductById(criteria).pipe(map((result) => {
            this.showSubject$.next(result);
        }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
