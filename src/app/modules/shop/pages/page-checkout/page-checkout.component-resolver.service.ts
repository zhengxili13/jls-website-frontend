import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { RootService } from 'src/app/shared/services/root.service';
import { OrderService } from 'src/app/shared/api/order.service';
import { UserService } from 'src/app/shared/api/user.service';


@Injectable({
    providedIn: 'root'
})
export class PageCheckoutResolverService implements Resolve<any> {
    constructor(
        private root: RootService,
        private router: Router,
        private orderService: OrderService,
        private translateService: TranslateService,
        private userService: UserService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        var lang = localStorage.getItem('lang');
        if (lang == null) {
            localStorage.setItem('lang', this.translateService.defaultLang);
        }

        return forkJoin(this.userService.GetUserFacturationAdress({ UserId: localStorage.getItem('userId') }),
            this.userService.GetUserShippingAdress({
                UserId: localStorage.getItem('userId')
            })).pipe(
                catchError(error => {
                    if (error instanceof HttpErrorResponse && error.status === 404) {
                        this.router.navigate([this.root.notFound()]).then();
                    }

                    return EMPTY;
                })
            );

    }
}
