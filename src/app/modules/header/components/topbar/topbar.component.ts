import { Component } from '@angular/core';
import { CurrencyService } from '../../../../shared/services/currency.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/login.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-header-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

    simplifyHomePage =  environment.simplifyHomePage;
    languages = [
        {name: 'English', image: 'united-states', code:'en'},
        {name: 'Français',  image: 'france', code:'fr'},
        {name: '中文',  image: 'china', code:'cn'}
    ];

    currencies = [
        {name: '€ Euro',           url: '', code: 'EUR', symbol: '€'}
    ];

    public logined : boolean = false;
    constructor(
        public currencyService: CurrencyService,
        public translateService: TranslateService,
        public loginService: LoginService
    ) {

        loginService.loginStatus.subscribe(p=>this.logined = p);
     }

    setCurrency(currency): void {
        this.currencyService.options = {
            code: currency.code,
            display: currency.symbol,
        };
    }

    setLanguage(language): void {
        localStorage.setItem('lang',language.code);
        this.translateService.currentLang = language.code;
        this.translateService.setDefaultLang(language.code);
        // todo reload complete page now, reload only data for the futher
        window.location.reload();
    }
}
