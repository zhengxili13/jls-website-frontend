import { Component, Input } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { Product, Product1 } from '../../../shared/interfaces/product';
import { RootService } from '../../../shared/services/root.service';

@Component({
    selector: 'app-widget-products',
    templateUrl: './widget-products.component.html',
    styleUrls: ['./widget-products.component.scss']
})
export class WidgetProductsComponent {
    @Input() header = '';
    @Input() products: Product1[] = [];

    constructor(public root: RootService,
        public loginService: LoginService) { }
}
