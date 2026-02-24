import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { RootService } from 'src/app/shared/services/root.service';
import { ReferenceService } from 'src/app/shared/api/reference.service';
import { ProductService } from 'src/app/shared/api/product.service';

@Injectable({
    providedIn: 'root'
})
export class RootResolverService implements Resolve<any> {
    constructor(
        private root: RootService,
        private router: Router,
        private referenceService: ReferenceService,
        private productService: ProductService,
        private translateService: TranslateService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        let lang = localStorage.getItem('lang');

        if (!lang) {
            lang = this.translateService.defaultLang || 'fr';
            localStorage.setItem('lang', lang);
        }

        return forkJoin([
            this.referenceService.GetReferenceItemsByCategoryLabels({
                Lang: lang,
                ShortLabels: ['StoreInfomation', 'TaxRate', 'InAppMessage']
            }),
            this.productService.GetCategoryForWebSite({
                NumberOfCateogry: -1,
                Lang: lang
            }),
            this.referenceService.GetWbesiteslides(),
            this.referenceService.GetAllCategoryList()
        ]).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 404) {
                    this.router.navigate([this.root.notFound()]).then();
                }

                return EMPTY;
            })
        );
    }
}
