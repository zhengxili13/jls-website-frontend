import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { RootService } from 'src/app/shared/services/root.service';
import { OrderService } from 'src/app/shared/api/order.service';
import { UserService } from 'src/app/shared/api/user.service';


@Injectable({
    providedIn: 'root'
})
export class PageEditAddressResolverService implements Resolve<any> {
    constructor(
        private root: RootService,
        private router: Router,
        private userService: UserService,
        private translateService: TranslateService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        var type = route.queryParams.Type;
        if (type == null) {
            this.router.navigate([this.root.notFound()]).then();
        }
        else {
            if (type == "shippingAdress") {
                if (route.queryParams.AddressId > 0) {
                    var criteria = {
                        AddressId: route.queryParams.AddressId
                    }
                    return this.userService.GetAddressById(criteria).pipe(
                        catchError(error => {
                            if (error instanceof HttpErrorResponse && error.status === 404) {
                                this.router.navigate([this.root.notFound()]).then();
                            }

                            return EMPTY;
                        })
                    );
                }
                else {
                    return of({ Id: 0 });
                }

            }
            else if (type == "facturationAdress") {

                return this.userService.GetUserFacturationAdress({ UserId: localStorage.getItem('userId') }).pipe(
                    catchError(error => {
                        if (error instanceof HttpErrorResponse && error.status === 404) {
                            this.router.navigate([this.root.notFound()]).then();
                        }

                        return EMPTY;
                    })
                );
            }
        }

    }
}
