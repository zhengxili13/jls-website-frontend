import { Component, EventEmitter, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent {
    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    public isLogined: boolean = false;
    public username: string;
    public entrepriseName: string;
    public email: string;
    public password: string;
    constructor(
        private loginService: LoginService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loginService.loginStatus.subscribe(p => {
            this.isLogined = p
            this.username = localStorage.getItem('username');
            this.entrepriseName = localStorage.getItem('entrepriseName');
        });

    }

    helpWindow() { 
        window.open('chat', '_blank', 'location=yes,height=570,width=600,scrollbars=yes,status=yes'); 
        this.closeMenu.emit();
    } 

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

    logout() {

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: {
                Title: this.translateService.instant('Confirmation'), 
                Body: this.translateService.instant('Msg_LogoutConfirm')
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loginService.logout();
            }
        });
    }

}
