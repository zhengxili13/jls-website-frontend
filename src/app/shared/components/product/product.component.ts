import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Product, ProductDetail1, Product1 } from '../../interfaces/product';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { FormControl } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PhotoSwipeService } from '../../services/photo-swipe.service';
import { DirectionService } from '../../services/direction.service';
import { environment } from 'src/environments/environment';
import { StoreService } from '../../services/store.service';
import { LoginService } from 'src/app/login.service';
declare const Configuration: any;
interface ProductImage {
    Id: string;
    Path: string;
    active: boolean;
}

export type Layout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    public dataProduct: ProductDetail1;
    private dataLayout: Layout = 'standard';

    hideRatingModule = environment.hideRatingModule;

    public host: string = Configuration.SERVER_API_URL;

    showGallery = true;
    showGalleryTimeout: number;

    public isAddedToWishList: boolean = false;


    public quantity: number = 0;

    @ViewChild('featuredCarousel', { read: CarouselComponent }) featuredCarousel: CarouselComponent;
    @ViewChild('thumbnailsCarousel', { read: CarouselComponent }) thumbnailsCarousel: CarouselComponent;
    @ViewChildren('imageElement', { read: ElementRef }) imageElements: QueryList<ElementRef>;

    @Input() set layout(value: Layout) {
        this.dataLayout = value;

        if (isPlatformBrowser(this.platformId)) {
            // this dirty hack is needed to re-initialize the gallery after changing the layout
            clearTimeout(this.showGalleryTimeout);
            this.showGallery = false;
            this.showGalleryTimeout = window.setTimeout(() => {
                this.showGallery = true;
            }, 0);
        }
    }
    get layout(): Layout {
        return this.dataLayout;
    }

    @Input() set product(value: ProductDetail1) {
        this.dataProduct = value;
        this.images = value ? this.dataProduct.ImagesPath : [];
        this.quantity = value.MinQuantity;
    }
    get product(): ProductDetail1 {
        return this.dataProduct;
    }

    images: ProductImage[] = [];

    carouselOptions: OwlOptions = {
        dots: false,
        autoplay: false,
        responsive: {
            0: { items: 1 }
        },
        rtl: this.direction.isRTL()
    };

    thumbnailsCarouselOptions: OwlOptions = {
        dots: false,
        autoplay: false,
        margin: 10,
        items: 5,
        responsive: {
            480: { items: 5 },
            380: { items: 4 },
            0: { items: 3 }
        },
        rtl: this.direction.isRTL()
    };



    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private cart: CartService,
        private wishlist: WishlistService,
        private photoSwipe: PhotoSwipeService,
        private direction: DirectionService,
        public storeService: StoreService,
        public loginService: LoginService,
        public location: Location
    ) { }

    ngOnInit(): void {
        if (this.layout !== 'quickview' && isPlatformBrowser(this.platformId)) {
            this.photoSwipe.load().subscribe();
        }
    }

    setActiveImage(image: ProductImage): void {
        this.images.forEach(eachImage => eachImage.active = eachImage === image);
    }

    featuredCarouselTranslated(event: SlidesOutputData): void {
        if (event.slides.length) {
            const activeImageId = event.slides[0].id;

            this.images.forEach(eachImage => eachImage.active = eachImage.Id === activeImageId);

            if (!this.thumbnailsCarousel.slidesData.find(slide => slide.id === event.slides[0].id && slide.isActive)) {
                this.thumbnailsCarousel.to(event.slides[0].id);
            }
        }
    }

    returnToPreviousPage(): void {
        this.location.back()
    }


    addToCart(): void {
        if (!this.addingToCart && this.product && this.quantity > 0) {
            this.addingToCart = true;
            const product = this.product as unknown as Product1
            this.cart.add(product, this.quantity).subscribe({ complete: () => this.addingToCart = false });
        }
    }

    addToWishlist(): void {
        if (!this.addingToWishlist && this.product) {
            this.addingToWishlist = true;
            // todo
            this.wishlist.addOrRemove(this.product.ProductId, true).subscribe({ complete: () => { this.addingToWishlist = false; this.isAddedToWishList = true; } });
        }
    }

    addToCompare(): void {
        if (!this.addingToCompare && this.product) {
            this.addingToCompare = true;
            //todo
            //this.compare.add(this.product).subscribe({complete: () => this.addingToCompare = false});
        }
    }

    getIndexDependOnDir(index) {
        // we need to invert index id direction === 'rtl' because photoswipe do not support rtl
        if (this.direction.isRTL()) {
            return this.images.length - 1 - index;
        }

        return index;
    }

    openPhotoSwipe(event: MouseEvent, image: ProductImage): void {
        if (this.layout !== 'quickview') {
            event.preventDefault();

            const images = this.images.map(eachImage => {
                return {
                    src: this.host + eachImage.Path,
                    msrc: this.host + eachImage.Path,
                    w: 700,
                    h: 700
                };
            });

            if (this.direction.isRTL()) {
                images.reverse();
            }

            const options = {
                getThumbBoundsFn: index => {
                    const imageElements = this.imageElements.toArray();
                    const dirDependentIndex = this.getIndexDependOnDir(index);

                    if (!imageElements[dirDependentIndex]) {
                        return null;
                    }

                    const imageElement = imageElements[dirDependentIndex].nativeElement;
                    const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                    const rect = imageElement.getBoundingClientRect();

                    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                },
                index: this.getIndexDependOnDir(this.images.indexOf(image)),
                bgOpacity: .9,
                history: false
            };

            this.photoSwipe.open(images, options).subscribe(galleryRef => {
                galleryRef.listen('beforeChange', () => {
                    this.featuredCarousel.to(this.images[this.getIndexDependOnDir(galleryRef.getCurrentIndex())].Id);
                });
            });
        }
    }
}
