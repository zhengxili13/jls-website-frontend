import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/api/user.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap, map, first } from 'rxjs/operators';


@Component({
    selector: 'app-registre',
    templateUrl: './page-registre.component.html',
    styleUrls: ['./page-registre.component.scss']
})
export class PageRegistreComponent {
    public loading: boolean = false;
    basicInfoForm: any;
    entrepriseForm: any;
    addressForm: any;

    constructor(private loginService: LoginService,
        private toastr: ToastrService,
        private router: Router,
        public formBuilder: FormBuilder,
        private translateService: TranslateService,
        private userService: UserService) {

        this.basicInfoForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email]), this.userNameUniqueValidator()],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
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

    confirmPassword() {
        let password = this.basicInfoForm.get('password').value;
        let confirmPassword = this.basicInfoForm.get('confirmPassword').value;
        return password != confirmPassword;
    }



    userNameUniqueValidator() {
        return (control: FormControl): any => {
            //进入管道进行串行操作
            //valueChanges表示字段值变更才触发操作
            return control.valueChanges.pipe(
                //同valueChanges，不写也可
                distinctUntilChanged(),
                //防抖时间，单位毫秒
                debounceTime(1000),
                //调用服务，参数可写可不写，如果写的话变成如下形式
                //switchMap((val) => this.registerService.isUserNameExist(val))
                switchMap(() => this.userService.CheckUserIsAlreadyExistAsync({ Username: control.value })),
                //对返回值进行处理，null表示正确，对象表示错误
                map(res => res == true ? { duplicate: true } : null),
                //每次验证的结果是唯一的，截断流
                first()
            );
        }
    }

    isAlreadyExists(): boolean {
        return this.basicInfoForm.get('email').hasError('duplicate');
    }

    registre() {
        if (this.basicInfoForm.valid && this.entrepriseForm.valid && this.addressForm.valid && !this.confirmPassword()) {

            var registreInfo = {
                Email: this.basicInfoForm.value['email'],
                Password: btoa(this.basicInfoForm.value['password']),
                Siret: this.entrepriseForm.value['siret'],
                EntrepriseName: this.entrepriseForm.value['entrepriseName'],
                PhoneNumber: this.entrepriseForm.value['phoneNumber'],
                FacturationAdress: this.addressForm.value,
                ShipmentAdress: this.addressForm.value
            }
            this.loading = true;
            this.userService.Register(registreInfo) // 填写url的参数
                .subscribe(
                    f => {
                        if (f.Success) {
                            // todo add message and redirecte to email sended page
                            //this.navCtrl.setRoot('RegistreSuccedPage', { email: f.DataExt, page: 'RegistrePage' });

                            this.router.navigate(['account/email'], { queryParams: { Email: f.DataExt , Type: 'Registre'} });
                        } else {
                            this.toastr.error(this.translateService.instant("Msg_Error"));

                        }
                        this.loading = false;
                    },
                    error => {
                        this.toastr.error(this.translateService.instant("Msg_Error"));
                        this.loading = false;
                    });
        }
        else {
            this.toastr.error(this.translateService.instant("Msg_SomeErrorInForm"));
        }

    }


    get basicInfoFormCtrl() { return this.basicInfoForm.controls; }
    get entrepriseFormCtrl() { return this.entrepriseForm.controls; }
    get addressFormCtrl() { return this.addressForm.controls; }

}
