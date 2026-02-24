import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/api/user.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-reset-password',
    templateUrl: './page-reset-password.component.html',
    styleUrls: ['./page-reset-password.component.scss']
})
export class PageResetPasswordComponent {
    public loading: boolean = false;
    basicInfoForm: FormGroup;

    private token: string;
    private username: string;
    constructor(private loginService: LoginService,
        private toastr: ToastrService,
        private router: Router,
        public formBuilder: FormBuilder,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private userService: UserService) {

        this.basicInfoForm = this.formBuilder.group({
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            confirmPassword: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(param => {
            if (param.Token != null && param.Username != null) {
                this.token =param.Token.split(' ').join('+'); //encodeURIComponent(param.Token).split('%20').join('+').split('%2F').join('/');
                this.username = param.Username
            }
            else {
                this.router.navigate(['/']);
            }
        });
    }

    confirmPassword() {
        let password = this.basicInfoForm.get('password').value;
        let confirmPassword = this.basicInfoForm.get('confirmPassword').value;
        return password != confirmPassword;
    }

    resetPassword() {
        if (this.basicInfoForm.invalid) {
            return;
        }
        this.userService.ResetPassword({
            UserName: this.username,
            Password: btoa(this.basicInfoForm.get('password').value),
            ConfirmPassword: btoa(this.basicInfoForm.get('confirmPassword').value),
            Token: this.token
        }).subscribe(p => {
            if (p == true) {
                this.toastr.success(this.translateService.instant("Msg_SaveSuccess"));
                this.router.navigate(['account/login']);
            }
            else {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            }
        },
            error => {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            })
        // todo reset password service 
    }


    get basicInfoFormCtrl() { return this.basicInfoForm.controls; }

}
