import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Product, Product1 } from '../interfaces/product';
import { CartItem } from '../interfaces/cart-item';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { StoreService } from './store.service';

interface CartTotal {
    title: string;
    price: number;
    type: 'shipping' | 'fee' | 'tax' | 'other';
}

interface CartData {
    items: CartItem[];
    quantity: number;
    subtotal: number;
    totals: CartTotal[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private data: CartData = {
        items: [],
        quantity: 0,
        subtotal: 0,
        totals: [],
        total: 0
    };

    private itemsSubject$: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.data.items);
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.quantity);
    private subtotalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.subtotal);
    private totalsSubject$: BehaviorSubject<CartTotal[]> = new BehaviorSubject(this.data.totals);
    private totalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.total);
    private onAddingSubject$: Subject<Product1> = new Subject();

    get items(): ReadonlyArray<CartItem> {
        return this.data.items;
    }

    get quantity(): number {
        return this.data.quantity;
    }

    readonly items$: Observable<CartItem[]> = this.itemsSubject$.asObservable();
    readonly quantity$: Observable<number> = this.quantitySubject$.asObservable();
    readonly subtotal$: Observable<number> = this.subtotalSubject$.asObservable();
    readonly totals$: Observable<CartTotal[]> = this.totalsSubject$.asObservable();
    readonly total$: Observable<number> = this.totalSubject$.asObservable();

    readonly onAdding$: Observable<Product1> = this.onAddingSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: any,
        private storeService: StoreService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
            this.calc();
        }
    }

    add(product: Product1, quantity: number, options: { name: string; value: string }[] = []): Observable<CartItem> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.onAddingSubject$.next(product);

            let item = this.items.find(eachItem => {
                if (eachItem.product.ProductId !== product.ProductId) {
                    return false;
                }
                return true;
            });

            // No neededs
           // quantity = product.MinQuantity > quantity ? product.MinQuantity : quantity;

            if (item) {
                item.quantity = item.quantity +quantity;
            } else {
                item = { product, quantity };

                this.data.items.push(item);
            }

            this.save();
            this.calc();

            return item;
        }));
    }

    addMultiple(productList: any[]){
        
        if(productList!=null && productList.length >0 ){
            productList.map(x=>{
                var product = x.product;
                var quantity = x.quantity;

                let item = this.items.find(eachItem => {
                   return eachItem.product.ProductId == product.ProductId;
                });

                if (item) {
                    item.quantity = item.quantity + quantity;
                } else {
                    item = { product, quantity };
                    this.data.items.push(item);
                }

                this.onAddingSubject$.next(product);
            });

            this.save();
            this.calc();
        }
    }

    update(updates: { item: CartItem, quantity: number }[]): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            updates.forEach(update => {
                const item = this.items.find(eachItem => eachItem === update.item);

                if (item) {
                    item.quantity = update.quantity;
                }
            });

            this.save();
            this.calc();
        }));
    }

    remove(item: CartItem): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.data.items = this.data.items.filter(eachItem => eachItem !== item);

            this.save();
            this.calc();
        }));
    }

    clear() {
        this.data.items = this.data.items.filter(p=>p.quantity<=0);

        this.save();
        this.calc();
    }

    private calc(): void {


        this.storeService.taxRate.subscribe(result => {
            let quantity = 0;
            let subtotal = 0;

            this.data.items.forEach(item => {
                quantity += item.quantity;
                subtotal += item.product.Price * item.quantity * item.product.QuantityPerBox;
            });

            const totals: CartTotal[] = [];

            totals.push({
                title: 'dropcart.Shipping',
                price: 0,
                type: 'shipping'
            });
            /* todo get from server side */
            totals.push({
                title: 'dropcart.Tax',
                price: subtotal * result * 0.01,
                type: 'tax'
            });

            const total = subtotal + totals.reduce((acc, eachTotal) => acc + eachTotal.price, 0);

            this.data.quantity = quantity;
            this.data.subtotal = subtotal;
            this.data.totals = totals;
            this.data.total = total;

            this.itemsSubject$.next(this.data.items);
            this.quantitySubject$.next(this.data.quantity);
            this.subtotalSubject$.next(this.data.subtotal);
            this.totalsSubject$.next(this.data.totals);
            this.totalSubject$.next(this.data.total);
        });

    }

    private save(): void {
        localStorage.setItem('cartItems', JSON.stringify(this.data.items));
    }

    private load(): void {
        const items = localStorage.getItem('cartItems');

        if (items) {
            this.data.items = JSON.parse(items);
        }
    }
}
