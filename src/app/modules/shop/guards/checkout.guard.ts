import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../../shared/services/cart.service';
import { map } from 'rxjs/operators';
import { LoginService } from 'src/app/login.service';

@Injectable({
    providedIn: 'root'
})
export class CheckoutGuard implements CanActivate  {
    constructor(
        private cart: CartService,
        private router: Router,
        private loginService: LoginService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.cart.quantity$.pipe(map(quantity => {
            if (quantity && this.loginService.loginStatus.value == true) {
                return true;
            }
            this.router.navigateByUrl('/account/login').then();

            return false;
        }));
    }
}
