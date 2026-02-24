import { Component, OnDestroy, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, NavigationEnd, ParamMap } from '@angular/router';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageCategoryService } from '../../services/page-category.service';
import { PageCategoryService1 } from '../../services/page-category1.service';
import { Link } from '../../../../shared/interfaces/link';
import { RootService } from '../../../../shared/services/root.service';
import { of, Subject, timer, from } from 'rxjs';
import { debounce, mergeMap, takeUntil, flatMap, tap, switchMap, first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ShopService } from '../../../../shared/api/shop.service';
import { parseFilterValue } from '../../../../shared/helpers/filter';
import { ProductService } from 'src/app/shared/api/product.service';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
    selector: 'app-grid',
    templateUrl: './page-category.component.html',
    styleUrls: ['./page-category.component.scss'],
    providers: [
        { provide: PageCategoryService, useClass: PageCategoryService },
        { provide: ShopSidebarService, useClass: ShopSidebarService },
        { provide: PageCategoryService1, useClass: PageCategoryService1 }
    ]
})
export class PageCategoryComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject<void>();
    private destroyRef = inject(DestroyRef);

    columns: 3 | 4 | 5 = 3;
    viewMode: 'grid' | 'grid-with-features' | 'list' = 'grid';
    sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    breadcrumbs: Link[] = [];
    pageHeader: string = '';

    constructor(
        private root: RootService,
        private router: Router,
        private route: ActivatedRoute,
        private pageService1: PageCategoryService1,
        private productService: ProductService,
        private translateService: TranslateService,
        public storeService: StoreService
    ) {
    }

    ngOnInit(): void {
        this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
            this.breadcrumbs = [
                { label: 'Page d\'accueil', url: this.root.home() },
                { label: 'Catégories', url: this.root.shop() },
            ];

            // If categorySlug is undefined then this is a root catalog page.
            if (!this.getCategorySlug()) {
                this.pageHeader = 'Catégories';
            } else {
                this.pageHeader = data['category']?.name || 'Catégories';

                this.breadcrumbs = this.breadcrumbs.concat([
                    ...(data['category']?.parents || []).map(
                        (parent: any) => ({ label: parent.name, url: this.root.category(parent) })
                    ),
                    { label: data['category']?.name, url: this.root.category(data['category']) },
                ]);
            }

            /* Build category page */
            this.columns = 'columns' in data ? data['columns'] : this.columns;
            this.viewMode = 'viewMode' in data ? data['viewMode'] : this.viewMode;
            this.sidebarPosition = 'sidebarPosition' in data ? data['sidebarPosition'] : this.sidebarPosition;
        });

        this.pageService1.optionsChange$.pipe(
            mergeMap(() => {
                // this.updateUrl();
                this.pageService1.setIsLoading(true);

                const criteria = this.pageService1.options;
                criteria.Lang = this.translateService.currentLang || localStorage.getItem('lang') || 'fr';

                return this.productService.AdvancedProductSearchClient(
                    criteria
                ).pipe(
                    takeUntil(this.pageService1.optionsChange$)
                );
            }),
            takeUntil(this.destroy$),
        ).subscribe(list => {
            const formatedData = {
                items: list.List,
                TotalCount: list.TotalCount
            };

            this.pageService1.setList(formatedData);
            this.pageService1.setIsLoading(false);
        });

        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
            const criteria = this.pageService1.options;

            const categoryShortLabel = params.get('CategoryLabel');
            if (categoryShortLabel === "MainCategory") {
                criteria.MainCategory = parseInt(params.get('ReferenceItemId') || '0', 10);
                criteria.SecondCategory = null;
            } else if (categoryShortLabel === "SecondCategory") {
                criteria.SecondCategory = parseInt(params.get('ReferenceItemId') || '0', 10);
                criteria.MainCategory = null;
            }

            const searchText = params.get('SearchText');
            if (searchText != null) {
                criteria.SearchText = searchText;
            }

            const orderby = params.get('Orderby');
            if (orderby != null) {
                criteria.OrderBy = orderby;
            }

            /* Resert page to 0 when 1 of 3 criteria has been changed */
            if (searchText != null || categoryShortLabel != null) {
                criteria.Begin = 0;
            }

            const begin = params.get('Begin');
            if (begin != null) {
                criteria.Begin = parseInt(begin, 10);
            }

            const step = params.get('Step');
            if (step != null) {
                criteria.Step = parseInt(step, 10);
            }

            this.pageService1.setOptions(criteria, true);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getCategorySlug(): string | null {
        return this.route.snapshot.params['categorySlug'] || this.route.snapshot.data['categorySlug'] || null;
    }
}
