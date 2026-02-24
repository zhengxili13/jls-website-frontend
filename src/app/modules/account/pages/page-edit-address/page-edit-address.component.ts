import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/api/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-page-edit-address',
    templateUrl: './page-edit-address.component.html',
    styleUrls: ['./page-edit-address.component.scss']
})
export class PageEditAddressComponent {
    public adressForm: FormGroup;
    public loading: boolean = false;

    constructor(public route: ActivatedRoute, public router: Router, private formBuilder: FormBuilder, private userService: UserService,
        private toastr: ToastrService, private translateService: TranslateService) {

        this.adressForm = this.formBuilder.group({
            Id: [''],
            EntrepriseName: ['', Validators.required],
            ContactFirstName: [''],
            ContactLastName: [''],
            FirstLineAddress: ['', Validators.required],
            SecondLineAddress: [''],
            City: ['', Validators.required],
            Country: [''],
            ZipCode: ['', Validators.required],
            ContactTelephone: ['', Validators.required],
            ContactFax: [''],
            Provence: [''],
            IsDefaultAdress: [''],
            CreatedOn: [''],
            CreatedBy: [''],
            UpdatedOn: [''],
            UpdatedBy: ['']
        });

        this.route.data.subscribe(data => {
            // data.initInfo;
            var address = data.initInfo;
            if (address.EntrepriseName == null || address.EntrepriseName == '') {
                address.EntrepriseName = localStorage.getItem('entrepriseName');
            }
            this.adressForm.patchValue(address);
        });
    }

    save() {
        if (this.adressForm.invalid) {
            return;
        }
        this.route.queryParams.subscribe(p => {
            var criteria = {
                adress: this.adressForm.value,
                userId: localStorage.getItem('userId'),
                type: p.Type
            }
           
            this.loading = true;
            this.userService.CreateOrUpdateAdress(criteria).subscribe(result => {
                this.toastr.success(this.translateService.instant("Msg_SaveSuccess")); 
                this.loading = false;
                if(p.ReturnUrl!=null && p.ReturnUrl!=''){
                    this.router.navigateByUrl(p.ReturnUrl);
                }
            },
            error => {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            });

        });

    }
}
