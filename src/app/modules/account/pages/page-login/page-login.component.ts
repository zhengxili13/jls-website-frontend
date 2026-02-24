import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/api/user.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
    selector: 'app-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent {
    public email: string;
    public password: string;


    public emailToReset: string;
    public loading: boolean = false;

    constructor(private loginService: LoginService, private router: Router,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private userService: UserService,
        public wishListService: WishlistService) { }

    login() {
        this.loginService.login(this.email, this.password).subscribe(result => {
            if (result != null && result.authToken != null) {
                localStorage.setItem('loginStatus', '1');
                localStorage.setItem('jwt', result.authToken.token);
                localStorage.setItem('username', result.authToken.username);
                localStorage.setItem('userId', result.authToken.userId);
                localStorage.setItem('expiration', result.authToken.expiration);
                localStorage.setItem('userRole', result.authToken.roles);
                localStorage.setItem('refreshToken', result.authToken.refresh_token);
                localStorage.setItem('entrepriseName', result.authToken.entrepriseName);

                this.loginService.loginStatus.next(true);

                this.toastr.success(this.translateService.instant("Msg_LoginSuccess"));// todo translate

                this.wishListService.loadUserFavoriteList();
                this.router.navigate(['/account/dashboard']);
            }
            else {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            }
        },
            error => {
                var message = error.error;
                if (message.LoginError != null) {

                    this.toastr.error(this.translateService.instant(message.LoginError));
                }
                else {
                    this.toastr.error(this.translateService.instant("Msg_Error"));
                }
            });
    }

    ngOnInit(): void {
        this.loginService.loginStatus.subscribe(p => p ? this.router.navigate(['/account/dashboard']) : null);

    }

    sendEmail() {
        if (this.emailToReset != null && this.emailToReset != '') {

            this.loading = true;
            // this.navCtrl.parent.select(0); // 跳转tabs
            this.userService.SendPasswordResetLink({ username: this.emailToReset }) // 填写url的参数
                .subscribe(
                    f => {
                        if (f != null && f.Success == true) {
                            // todo redirecte to page
                            this.toastr.success(this.translateService.instant("forget-password.EmailSendSuccessfully"));
                            this.router.navigate(['account/email'], { queryParams: { Email: f.Data, Type: 'ResetPassword' } });
                        }
                        else {
                            this.toastr.error(this.translateService.instant("forget-password.AccountNotExists"));
                        }

                        this.loading = false;
                    },
                    error => {
                        this.toastr.error(this.translateService.instant("Msg_Error"));
                    });
        }

    }
}
