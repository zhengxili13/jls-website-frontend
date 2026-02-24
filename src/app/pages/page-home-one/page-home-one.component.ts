import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { Product } from '../../shared/interfaces/product';
import { BlockHeaderGroup } from '../../shared/interfaces/block-header-group';
import { takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { ProductService } from 'src/app/shared/api/product.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

interface ProductsCarouselGroup extends BlockHeaderGroup {
    products$: Observable<Product[]>;
}

interface ProductsCarouselData {
    abort$: Subject<void>;
    loading: boolean;
    products: Product[];
    groups: ProductsCarouselGroup[];
}

@Component({
    selector: 'app-home',
    templateUrl: './page-home-one.component.html',
    styleUrls: ['./page-home-one.component.scss']
})
export class PageHomeOneComponent implements OnInit, OnDestroy {

    simplifyHomePage = environment.simplifyHomePage;

    destroy$: Subject<void> = new Subject<void>();

    popularCategories$: any[];

    columnTopRated$!: Observable<Product[]>;
    columnSpecialOffers$!: Observable<Product[]>;
    columnBestsellers$!: Observable<Product[]>;

    featuredProducts!: ProductsCarouselData;
    latestProducts!: ProductsCarouselData;

    constructor(
        public route: ActivatedRoute,
        public storeService: StoreService,
        public productService: ProductService,
        public translateService: TranslateService
    ) {
    }

    ngOnInit(): void {
        // Load short data
        this.columnTopRated$ = this.productService.GetProductListByNote({
            Lang: this.translateService.currentLang,
            Begin: 0,
            Step: 3
        });
        this.columnSpecialOffers$ = this.productService.GetProductByPrice({
            Lang: this.translateService.currentLang,
            Begin: 0,
            Step: 3
        });
        this.columnBestsellers$ = this.productService.GetProductListBySalesPerformance({
            Lang: this.translateService.currentLang,
            Begin: 0,
            Step: 3
        });

        this.popularCategories$ = this.formatMegaMenu();

        /* Not needed for jls version */
        if (!this.simplifyHomePage) {
            const featuredCategoryList = this.storeService.categoryList.value.slice(0, 4);
            const featuredGroups: ProductsCarouselGroup[] = [];

            featuredGroups.push({
                name: "All",
                current: true,
                products$: this.productService.GetProductByPrice({
                    Lang: this.translateService.currentLang,
                    Begin: 0,
                    Step: 8
                })
            });

            featuredCategoryList.forEach(element => {
                featuredGroups.push({
                    name: element.Label,
                    current: false,
                    products$: this.productService.GetProductByPrice({
                        MainCategoryId: element.Id,
                        Lang: this.translateService.currentLang,
                        Begin: 0,
                        Step: 8
                    }),
                });
            });

            this.featuredProducts = {
                abort$: new Subject<void>(),
                loading: false,
                products: [],
                groups: featuredGroups
            };
            this.groupChange(this.featuredProducts, this.featuredProducts.groups[0]);


            const latestCategoryList = this.storeService.categoryList.value.slice(0, 4);
            const latestGroups: ProductsCarouselGroup[] = [];

            latestGroups.push({
                name: "All",
                current: true,
                products$: this.productService.GetProductListByPublishDate({
                    Lang: this.translateService.currentLang,
                    Begin: 0,
                    Step: 8
                })
            });

            latestCategoryList.forEach(element => {
                latestGroups.push({
                    name: element.Label,
                    current: false,
                    products$: this.productService.GetProductListByPublishDate({
                        MainCategoryId: element.Id,
                        Lang: this.translateService.currentLang,
                        Begin: 0,
                        Step: 8
                    }),
                });
            });

            this.latestProducts = {
                abort$: new Subject<void>(),
                loading: false,
                products: [],
                groups: latestGroups
            };
            this.groupChange1(this.latestProducts, this.latestProducts.groups[0]);
        }
    }


    formatMegaMenu(): any[] {
        const targetedCategory = this.storeService.categoryList.value.sort((a, b) => b.SecondCategory.length - a.SecondCategory.length);
        targetedCategory.filter(p => p.SecondCategory.length > 0);
        // Show all category for jls 
        //targetedCategory = targetedCategory.slice(0, 6);
        return targetedCategory;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    groupChange(carousel: ProductsCarouselData, group: BlockHeaderGroup): void {
        carousel.loading = true;
        carousel.abort$.next();

        (group as ProductsCarouselGroup).products$.pipe(
            tap(() => carousel.loading = false),
            takeUntil(merge(this.destroy$, carousel.abort$)),
        ).subscribe(x => { carousel.products = x });
    }


    groupChange1(carousel: ProductsCarouselData, group: any): void {
        carousel.loading = true;
        carousel.abort$.next();

        group.products$.pipe(
            tap(() => carousel.loading = false),
            takeUntil(merge(this.destroy$, carousel.abort$)),
        ).subscribe((x: Product[]) => { carousel.products = x; });
    }
}
