import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

declare const Configuration: any;

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    public loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    private baseUrlToken: string = Configuration.SERVER_API_URL + 'api/Token/Auth';
    constructor(
        @Inject(PLATFORM_ID)
        private platformId: any,
        protected router: Router,
        private httpClient: HttpClient,
        private toastr: ToastrService
        // public translateService: TranslateService
    ) {
        if (isPlatformBrowser(this.platformId)) {

        }
    }

    login(email: string, password: string): Observable<any> {

        const encroyptPassword = btoa(password);

        const criteria = {
            UserName: email,
            password: encroyptPassword,
            GrantType: 'password'
        };
        return this.httpClient.post<any>(this.baseUrlToken, criteria);
    }

    logout() {
        // Set Loginstatus to false and delete saved jwt cookie
        this.loginStatus.next(false);
        var lang = localStorage.getItem('lang');
        localStorage.clear();
        localStorage.setItem('lang', lang);
        this.router.navigate(['']);
        return;

    }


    // Method to get new refresh token
    getNewRefreshToken(): Observable<any> {
        const username = localStorage.getItem('username');
        const refreshToken = localStorage.getItem('refreshToken');
        const grantType = "refresh_token";

        return this.httpClient.post<any>(this.baseUrlToken, { username, refreshToken, grantType }).pipe(
            map(result => {
                if (result && result.authToken.token) {
                    this.loginStatus.next(true);
                    localStorage.setItem('loginStatus', '1');
                    localStorage.setItem('jwt', result.authToken.token);
                    localStorage.setItem('username', result.authToken.username);
                    localStorage.setItem('expiration', result.authToken.expiration);
                    localStorage.setItem('userRole', result.authToken.roles);
                    localStorage.setItem('refreshToken', result.authToken.refresh_token);
                    localStorage.setItem('entrepriseName', result.authToken.entrepriseName);
                }
                return <any>result;

            }, catchError(err => {
                this.logout();
                return throwError(err);
            }))
        );

    }


    checkLoginStatus(): boolean {

        var loginCookie = localStorage.getItem("loginStatus");

        if (loginCookie == "1") {
            if (localStorage.getItem('jwt') != null || localStorage.getItem('jwt') != undefined) {
                return true;
            }
        }
        return false;
    }

}
