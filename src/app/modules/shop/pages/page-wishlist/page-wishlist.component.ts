import { Component } from '@angular/core';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { Product, Product1 } from '../../../../shared/interfaces/product';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/api/product.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { environment } from 'src/environments/environment';
declare const Configuration: any;
@Component({
    selector: 'app-wishlist',
    templateUrl: './page-wishlist.component.html',
    styleUrls: ['./page-wishlist.component.scss']
})
export class PageWishlistComponent {
    public favoirteList : Product1[];
    hideRatingModule = environment.hideRatingModule;
    
    public host: string = Configuration.SERVER_API_URL;
    
    addingToCart: boolean = false;
    removingFromWishList : boolean = false;
    constructor(
        private route: ActivatedRoute,
        public root: RootService,
        public wishlist: WishlistService,
        public cart: CartService,
        public productService: ProductService,
        public storeService: StoreService
    ) {
        this.route.data.subscribe(data => {
            this.favoirteList = data.favoriteList;

        });

    }

    addToCart(product: Product1): void {

        if (this.addingToCart) {
            return;
        }

        this.addingToCart = true;
        this.cart.add(product, 1).subscribe({
            complete: () => {
                this.addingToCart = false;
            }
        });
    }

    remove(product: Product1): void {
        if (this.removingFromWishList) {
            return;
        }

        this.removingFromWishList = true;
        this.wishlist.addOrRemove(product.ProductId,false ).subscribe({
            complete: () => {
                this.removingFromWishList = false;
                this.refreshData();
            }
        });
    }

    refreshData(): void {
        this.productService.GetFavoriteListByUserId({
            UserId: localStorage.getItem('userId'),
            Lang: localStorage.getItem('lang')
        }).subscribe(p=>this.favoirteList = p);
    }
}
