import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/api/user.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap, map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-registre',
    templateUrl: './page-registre.component.html',
    styleUrls: ['./page-registre.component.scss']
})
export class PageRegistreComponent implements OnInit {
    public loading: boolean = false;
    basicInfoForm: FormGroup;
    entrepriseForm: FormGroup;
    addressForm: FormGroup;

    constructor(
        private loginService: LoginService,
        private toastr: ToastrService,
        private router: Router,
        public formBuilder: FormBuilder,
        private translateService: TranslateService,
        private userService: UserService
    ) {
        this.basicInfoForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email], [this.userNameUniqueValidator()]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        });

        this.entrepriseForm = this.formBuilder.group({
            entrepriseName: ['', Validators.required],
            siret: ['', Validators.required],
            phoneNumber: ['', Validators.required]
        });

        this.addressForm = this.formBuilder.group({
            Id: ['0'],
            FirstLineAddress: ['', Validators.required],
            SecondLineAddress: [''],
            City: ['', Validators.required],
            Country: ['', Validators.required],
            ZipCode: ['', Validators.required],
            ContactTelephone: ['', Validators.required],
            ContactFax: [''],
            ContactFirstName: [''],
            ContactLastName: ['']
        });
    }

    ngOnInit(): void {
    }

    confirmPassword(): boolean {
        const password = this.basicInfoForm.get('password')?.value;
        const confirmPassword = this.basicInfoForm.get('confirmPassword')?.value;
        return password !== confirmPassword;
    }

    userNameUniqueValidator() {
        return (control: FormControl): Observable<any> => {
            return control.valueChanges.pipe(
                distinctUntilChanged(),
                debounceTime(1000),
                switchMap(() => this.userService.CheckUserIsAlreadyExistAsync({ Username: control.value })),
                map(res => res === true ? { duplicate: true } : null),
                first()
            );
        };
    }

    isAlreadyExists(): boolean {
        return !!this.basicInfoForm.get('email')?.hasError('duplicate');
    }

    registre(): void {
        if (this.basicInfoForm.valid && this.entrepriseForm.valid && this.addressForm.valid && !this.confirmPassword()) {

            const registreInfo = {
                Email: this.basicInfoForm.get('email')?.value,
                Password: btoa(this.basicInfoForm.get('password')?.value),
                Siret: this.entrepriseForm.get('siret')?.value,
                EntrepriseName: this.entrepriseForm.get('entrepriseName')?.value,
                PhoneNumber: this.entrepriseForm.get('phoneNumber')?.value,
                FacturationAdress: this.addressForm.value,
                ShipmentAdress: this.addressForm.value
            };

            this.loading = true;
            this.userService.Register(registreInfo).subscribe({
                next: (f) => {
                    if (f.Success) {
                        this.router.navigate(['account/email'], { queryParams: { Email: f.DataExt, Type: 'Registre' } });
                    } else {
                        this.toastr.error(this.translateService.instant("Msg_Error"));
                    }
                    this.loading = false;
                },
                error: (error) => {
                    this.toastr.error(this.translateService.instant("Msg_Error"));
                    this.loading = false;
                }
            });
        } else {
            this.toastr.error(this.translateService.instant("Msg_SomeErrorInForm"));
        }
    }

    get basicInfoFormCtrl() { return this.basicInfoForm.controls; }
    get entrepriseFormCtrl() { return this.entrepriseForm.controls; }
    get addressFormCtrl() { return this.addressForm.controls; }
}
