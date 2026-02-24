import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-block-banner',
    templateUrl: './block-banner.component.html',
    styleUrls: ['./block-banner.component.scss']
})
export class BlockBannerComponent {
    simplifyHomePage =  environment.simplifyHomePage;
    constructor() { }
}
