import { Component } from '@angular/core';
import { theme } from '../../../../../data/theme';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/shared/api/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-footer-newsletter',
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
    theme = theme;
    simplifyHomePage =  environment.simplifyHomePage;
    public basicInfoForm: FormGroup
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private toastr: ToastrService,
        private translateService: TranslateService
    ) {
        this.basicInfoForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
        });
    }

    save() {
        if (this.basicInfoForm.invalid) {
            return;
        }
        this.userService.InsertSubscribeEmail({ Email: this.basicInfoForm.value['email'] }).subscribe(p => {
            if (p > 0) {
                this.toastr.success(this.translateService.instant("Msg_SaveSuccess"));
            }
            else {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            }
        },
            error => {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            });
    }
}
