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
export class PageOrderDetailsResolverService implements Resolve<any> {
    constructor(
        private root: RootService,
        private router: Router,
        private orderService: OrderService,
        private translateService: TranslateService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        var orderId = route.queryParams.OrderId;
        if(orderId==null){
            this.router.navigate([this.root.notFound()]).then();
        }
        return this.orderService.GetOrdersListByOrderId({
            Lang: localStorage.getItem('lang'),
            OrderId: orderId
        }).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 404) {
                    this.router.navigate([this.root.notFound()]).then();
                }

                return EMPTY;
            })
        );
    }
}
