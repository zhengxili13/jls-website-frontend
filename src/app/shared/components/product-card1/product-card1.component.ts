import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product, ProductAttribute, Product1 } from '../../interfaces/product';
import { WishlistService } from '../../services/wishlist.service';
import { QuickviewService } from '../../services/quickview.service';
import { RootService } from '../../services/root.service';
import { CurrencyService } from '../../services/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { LoginService } from 'src/app/login.service';
import { environment } from 'src/environments/environment';
declare const Configuration: any;
@Component({
    selector: 'app-product-card1',
    templateUrl: './product-card1.component.html',
    styleUrls: ['./product-card1.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard1Component implements OnInit, OnDestroy, OnChanges {
    private destroy$: Subject<void> = new Subject();

    public host: string = Configuration.SERVER_API_URL;
    
    public quantity:number = 1;

    hideRatingModule = environment.hideRatingModule;
    
    @Input() product: any;
    @Input() layout: 'grid-sm'|'grid-nl'|'grid-lg'|'list'|'horizontal'|null = null;

    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;
    showingQuickview = false;
    featuredAttributes: ProductAttribute[] = [];

    isAddedToWishList : boolean = false;
    
    constructor(
        private cd: ChangeDetectorRef,
        public root: RootService,
        public cart: CartService,
        public wishlist: WishlistService,
        public quickview: QuickviewService,
        public currency: CurrencyService,
        public storeService: StoreService,
        public loginService: LoginService
    ) { 
       
    }

    ngOnInit(): void {
        this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.cd.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('product' in changes) {
            //this.featuredAttributes = !this.product ? [] : this.product.attributes.filter(x => x.featured);
        }
    }

    addToCart(): void {
        if (this.addingToCart) {
            return;
        }
        this.addingToCart = true;
        this.cart.add(this.product, this.quantity).subscribe({
            complete: () => {
                this.addingToCart = false;
                this.cd.markForCheck();
            }
        });
    }

    addToWishlist(): void {
        if (this.addingToWishlist) {
            return;
        }
        // #cc3333;
        this.addingToWishlist = true;
        this.wishlist.addOrRemove(this.product.ProductId,true).subscribe({// todo change
            complete: () => {
                this.isAddedToWishList = true;
                this.addingToWishlist = false;
                this.cd.markForCheck();
            }
        });
    }

    showQuickview(): void {
        if (this.showingQuickview) {
            return;
        }

        this.showingQuickview = true;
        this.quickview.show(this.product).subscribe({
            complete: () => {
                this.showingQuickview = false;
                this.cd.markForCheck();
            }
        });
    }
}
