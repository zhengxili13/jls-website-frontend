import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageCategoryService } from '../../services/page-category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageCategoryService1 } from '../../services/page-category1.service';

export type Layout = 'grid' | 'grid-with-features' | 'list';

@Component({
    selector: 'app-products-view',
    templateUrl: './products-view.component.html',
    styleUrls: ['./products-view.component.scss']
})
export class ProductsViewComponent implements OnInit, OnDestroy {
    @Input() layout: Layout = 'grid';
    @Input() grid: 'grid-3-sidebar' | 'grid-4-full' | 'grid-5-full' = 'grid-3-sidebar';
    @Input() offcanvas: 'always' | 'mobile' = 'mobile';

    destroy$: Subject<void> = new Subject<void>();

    listOptionsForm: FormGroup;
    filtersCount = 0;

    constructor(
        private fb: FormBuilder,
        public sidebar: ShopSidebarService,
        public pageService: PageCategoryService,
        public pageService1: PageCategoryService1,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        /* Bind the form */
        this.listOptionsForm = this.fb.group({
            CurrentPage: this.fb.control(this.pageService1.Begin+1),
            Begin: this.fb.control(this.pageService1.Begin),
            Step: this.fb.control(this.pageService1.Step),
            OrderBy: this.fb.control(this.pageService1.OrderBy || 'Default'),
        });


        // When OrderBy changed, current page will reset to 1
        this.listOptionsForm.get("OrderBy").valueChanges.subscribe(value=>{
 
            this.listOptionsForm.get("CurrentPage").setValue(1,{
                emitEvent: false
            })
        });
        /* Bind the change of Begin, Step, OrderBy */
        this.listOptionsForm.valueChanges.subscribe(value => {
            value.Begin = value.CurrentPage - 1;

            // Save all changes(Begin, Step, OrderBy) in url
            this.router.navigate(
            [], 
            {
                relativeTo: this.activatedRoute,
                queryParams: {
                    Orderby: value.OrderBy, 
                    Begin: value.Begin,
                    Step: value.Step
                }, 
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });

            //this.pageService1.updateOptions(value);
        });
        this.pageService1.optionsChange$.subscribe(reuslt=>{
            this.listOptionsForm.patchValue({
                CurrentPage: reuslt.Begin!=null ? reuslt.Begin +1 : this.listOptionsForm.value.CurrentPage
            }, {emitEvent: false, onlySelf:true})
        });

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLayout(value: Layout): void {
        this.layout = value;
    }

    resetFilters(): void {
        //todo add a function in page-category.service for the reset
        //this.pageService1.updateOptions({});
    }
}
