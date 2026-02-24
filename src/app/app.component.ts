import { Component, Inject, NgZone, OnInit, PLATFORM_ID, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { WishlistService } from './shared/services/wishlist.service';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { CurrencyService } from './shared/services/currency.service';
import { filter, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router,
        private toastr: ToastrService,
        private cart: CartService,
        private wishlist: WishlistService,
        private zone: NgZone,
        private scroller: ViewportScroller,
        private currency: CurrencyService,
        private translate: TranslateService
    ) {
        const lang = localStorage.getItem('lang') || 'fr';
        this.translate.currentLang = lang;
        this.translate.setDefaultLang(lang);

        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.router.events.pipe(
                    filter(event => event instanceof NavigationEnd),
                    first()
                ).subscribe(() => {
                    const preloader = document.querySelector('.site-preloader');
                    if (preloader) {
                        preloader.addEventListener('transitionend', (event: Event) => {
                            if ((event as TransitionEvent).propertyName === 'opacity') {
                                preloader.remove();
                            }
                        });
                        preloader.classList.add('site-preloader__fade');
                    }
                });
            });
        }
    }

    ngOnInit(): void {
        // properties of the CurrencyFormatOptions interface fully complies
        // with the arguments of the built-in pipe "currency"
        // https://angular.io/api/common/CurrencyPipe
        this.currency.options = {
            code: 'EUR',
            display: 'symbol',
            digitsInfo: '1.2-2',
            locale: 'fr-FR'
        };

        this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.scroller.scrollToPosition([0, 0]);
            }
        });

        this.cart.onAdding$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(product => {
            this.toastr.success(this.translate.instant("page-cart.Product") + " " + product.Label + " " + this.translate.instant("component.AddedToCart"));
        });

        this.wishlist.onAdding$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.toastr.success(this.translate.instant("page-cart.Product") + " " + this.translate.instant("component.AddedToWishList"));
        });
    }
}
