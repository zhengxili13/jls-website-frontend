import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/api/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.sass']
})
export class PageProfileComponent {
    public userForm: FormGroup;
    public loading: boolean = false;

    constructor(public formBuilder: FormBuilder, public route: ActivatedRoute, public userService: UserService, private translateService: TranslateService,
        private toastr: ToastrService) {


        this.userForm = this.formBuilder.group({
            EntrepriseName: ['', Validators.required],
            Siret: ['', Validators.required],
            PhoneNumber: ['', Validators.required],
        });

        this.route.data.subscribe(data => {

            this.userForm.patchValue({
                EntrepriseName: data.initInfo.EntrepriseName,
                Siret: data.initInfo.Siret,
                PhoneNumber: data.initInfo.PhoneNumber
            });
        });
    }

    saveUserInfo() {
        if (this.userForm.invalid) {
            return;
        }
        var criteria = this.userForm.value;
        criteria.UserId = localStorage.getItem('userId');
        this.loading = true;
        this.userService.UpdateUserInfo(criteria).subscribe(result => {
            this.toastr.success(this.translateService.instant("Msg_SaveSuccess")); 

            this.loading = false;
        },
        error => {
            this.toastr.error(this.translateService.instant("Msg_Error"));
        });
    }
}
