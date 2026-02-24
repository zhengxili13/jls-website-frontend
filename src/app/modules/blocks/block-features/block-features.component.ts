import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-block-features',
    templateUrl: './block-features.component.html',
    styleUrls: ['./block-features.component.scss']
})
export class BlockFeaturesComponent {
    @Input() layout: 'classic'|'boxed' = 'classic';
    simplifyHomePage =  environment.simplifyHomePage;
    constructor() { }
}
