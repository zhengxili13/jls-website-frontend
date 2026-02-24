import { Component, Input } from '@angular/core';
import { Product1 } from 'src/app/shared/interfaces/product';

@Component({
    selector: 'app-block-products',
    templateUrl: './block-products.component.html',
    styleUrls: ['./block-products.component.scss']
})
export class BlockProductsComponent {
    @Input() header: string;
    @Input() layout: 'large-first' | 'large-last' | 'none' = 'large-first';
    @Input() products: Product1[] = [];
    @Input() badgeTitle:string;
    @Input() orderby: string;
    get large(): any {
        if (this.products != null) {
            if (this.layout === 'large-first' && this.products.length > 0) {
                return this.products[0];
            } else if (this.layout === 'large-last' && this.products.length > 6) {
                return this.products[6];
            }
        }

        return null;
    }

    get smalls(): any[] {
        if (this.products != null) {
            if (this.layout === 'large-first') {
                return this.products.slice(1, 10);
            } else {
                return this.products.slice(0, 12);
            }
        }
        return [];
    }

    constructor() { }
}
