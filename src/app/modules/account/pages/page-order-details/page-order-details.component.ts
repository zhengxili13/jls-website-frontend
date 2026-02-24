import { Component, TemplateRef } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/shared/api/product.service';
import { CartService } from 'src/app/shared/services/cart.service';


declare const Configuration: any;

@Component({
    selector: 'app-page-order-details',
    templateUrl: './page-order-details.component.html',
    styleUrls: ['./page-order-details.component.scss']
})
export class PageOrderDetailsComponent {
    order: any = {};
    taxRate: number = 0;
    modalRef: MatDialogRef<any>;

    public host: string = Configuration.SERVER_API_URL;
    constructor(
        public route: ActivatedRoute,
        public storeService: StoreService,
        public dialog: MatDialog,
        public productService: ProductService,
        public cartService: CartService,
        public router: Router
    ) {
        this.route.data.subscribe(data => {
            this.order = data.initInfo;
        });
    }
    ngOnInit(): void {
        this.storeService.taxRate.subscribe(p => this.taxRate = p);
    }

    copyCommande(template: TemplateRef<any>) {
        this.modalRef = this.dialog.open(template, { width: '300px' });
    }
    confirm(): void {
        // TODO do the confirm job
        if (this.order != null && this.order.ProductList != null && this.order.ProductList.length > 0) {
            var referenceIds = this.order.ProductList.map(p => p.ReferenceId);
            this.productService.GetProductInfoByReferenceIds({
                Lang: localStorage.getItem('lang'),
                ReferenceIds: referenceIds
            }).subscribe(result => {
                if (result != null && result.length > 0) {
                    var formatCartList = [];
                    result.map(x => {
                        var product = this.order.ProductList.find(p => p.ReferenceId == x.ReferenceId);
                        if (product != null && product.Quantity != null && product.Quantity > 0) {
                            formatCartList.push({
                                product: x,
                                quantity: product.Quantity
                            });
                        }
                    });

                    if (formatCartList.length > 0) {
                        this.cartService.addMultiple(formatCartList);
                    }
                }
                this.modalRef.close();
                this.router.navigate(['/shop/cart']);

            });
        }
    }
}
