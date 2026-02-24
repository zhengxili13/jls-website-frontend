import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { Product, Product1 } from '../interfaces/product';
import { map, takeUntil, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../api/product.service';

interface WishlistData {
    items: Product[];
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService implements OnDestroy {
    private data: WishlistData = {
        items: []
    };

    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
    private onAddingSubject$: Subject<number> = new Subject();

    readonly items$: Observable<Product[]> = this.itemsSubject$.pipe(takeUntil(this.destroy$));
    readonly count$: Observable<number> = this.itemsSubject$.pipe(map(items => items.length));
    readonly onAdding$: Observable<number> = this.onAddingSubject$.asObservable();

    public numberOfFavoirteProduct$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public FavoirteProductList$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: any,
        private productService: ProductService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
        }
    }

    addOrRemove(productId: number, IsFavorite: boolean): Observable<void> {
        const numberOfFavoirteProduct = this.numberOfFavoirteProduct$.value;
        let FavoirteProductList = [...this.FavoirteProductList$.value];

        if (IsFavorite) {
            this.onAddingSubject$.next(productId);
            if (!FavoirteProductList.includes(productId)) {
                this.numberOfFavoirteProduct$.next(numberOfFavoirteProduct + 1);
                FavoirteProductList.push(productId);
                this.FavoirteProductList$.next(FavoirteProductList);
            }
        } else {
            if (FavoirteProductList.includes(productId)) {
                this.numberOfFavoirteProduct$.next(numberOfFavoirteProduct - 1);
                FavoirteProductList = FavoirteProductList.filter(p => p !== productId);
                this.FavoirteProductList$.next(FavoirteProductList);
            }
        }

        return this.productService.AddIntoProductFavoriteList({
            UserId: localStorage.getItem('userId'),
            ProductId: productId,
            IsFavorite: IsFavorite
        });
    }

    loadUserFavoriteList(): void {
        const userId = localStorage.getItem('userId');
        const lang = localStorage.getItem('lang');

        if (userId) {
            this.productService.GetFavoriteListByUserId({ UserId: userId, Lang: lang })
                .pipe(take(1), takeUntil(this.destroy$))
                .subscribe(result => {
                    if (result?.length) {
                        const listProductId = result.map((p: any) => p.ProductId);
                        this.FavoirteProductList$.next(listProductId);
                        this.numberOfFavoirteProduct$.next(result.length);
                    }
                });
        }
    }

    remove(product: Product): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            const index = this.data.items.findIndex(item => item.id === product.id);

            if (index !== -1) {
                this.data.items.splice(index, 1);
                this.save();
            }
        }));
    }

    private save(): void {
        localStorage.setItem('wishlistItems', JSON.stringify(this.data.items));
        this.itemsSubject$.next(this.data.items);
    }

    private load(): void {
        const items = localStorage.getItem('wishlistItems');

        if (items) {
            this.data.items = JSON.parse(items);
            this.itemsSubject$.next(this.data.items);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
