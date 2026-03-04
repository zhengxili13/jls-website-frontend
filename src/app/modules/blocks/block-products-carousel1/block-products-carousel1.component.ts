import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Product, Product1 } from '../../../shared/interfaces/product';
import { BlockHeaderGroup } from '../../../shared/interfaces/block-header-group';
import { DirectionService } from '../../../shared/services/direction.service';

@Component({
    selector: 'app-block-products-carousel1',
    templateUrl: './block-products-carousel1.component.html',
    styleUrls: ['./block-products-carousel1.component.scss']
})
export class BlockProductsCarousel1Component implements OnChanges {
    @Input() header: string;
    @Input() layout: 'grid-4' | 'grid-4-sm' | 'grid-5' | 'horizontal' = 'grid-4';
    @Input() rows = 1;
    @Input() products: Product1[] = [];
    @Input() groups: BlockHeaderGroup[] = [];
    @Input() withSidebar = false;
    @Input() loading = false;

    @Output() groupChange: EventEmitter<BlockHeaderGroup> = new EventEmitter();

    columns: Product1[][] = [];

    carouselDefaultOptions: any = {
        items: 4,
        margin: 14,
        nav: false,
        dots: false,
        loop: true,
        stagePadding: 1,
        rtl: this.direction.isRTL()
    };

    carouselOptionsByLayout: any = {
        'grid-4': {
            responsive: {
                1110: { items: 4, margin: 14 },
                930: { items: 4, margin: 10 },
                690: { items: 3, margin: 10 },
                400: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        },
        'grid-4-sm': {
            responsive: {
                820: { items: 4, margin: 14 },
                640: { items: 3, margin: 10 },
                400: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        },
        'grid-5': {
            responsive: {
                1110: { items: 5, margin: 12 },
                930: { items: 4, margin: 10 },
                690: { items: 3, margin: 10 },
                400: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        },
        horizontal: {
            items: 3,
            responsive: {
                1110: { items: 3, margin: 14 },
                930: { items: 3, margin: 10 },
                690: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        }
    };

    private _carouselOptions: any;

    get carouselOptions(): any {
        if (!this._carouselOptions) {
            this._carouselOptions = Object.assign({}, this.carouselDefaultOptions, this.carouselOptionsByLayout[this.layout]);
        }
        return this._carouselOptions;
    }

    constructor(
        private direction: DirectionService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['products'] || changes['rows'] || changes['layout']) {
            this.columns = [];
            this._carouselOptions = null; // Reset options when layout changes

            if (this.products && Array.isArray(this.products)) {
                const rows = Math.max(1, Number(this.rows) || 1);
                for (let i = 0; i < this.products.length; i += rows) {
                    this.columns.push(this.products.slice(i, i + rows));
                }
            }
        }
    }
}
