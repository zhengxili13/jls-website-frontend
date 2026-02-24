import { Component, OnInit, TemplateRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class PageOrderDetailsComponent implements OnInit {
    order: any = {};
    taxRate: number = 0;
    modalRef?: MatDialogRef<any>;

    public host: string = Configuration?.SERVER_API_URL || '';
    private destroyRef = inject(DestroyRef);

    constructor(
        public route: ActivatedRoute,
        public storeService: StoreService,
        public dialog: MatDialog,
        public productService: ProductService,
        public cartService: CartService,
        public router: Router
    ) {
        this.route.data.pipe(takeUntilDestroyed()).subscribe(data => {
            this.order = data['initInfo'] || {};
        });
    }

    ngOnInit(): void {
        this.storeService.taxRate.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => {
            this.taxRate = p;
        });
    }

    copyCommande(template: TemplateRef<any>): void {
        this.modalRef = this.dialog.open(template, { width: '300px' });
    }

    confirm(): void {
        // Prepare cart format list and handle confirmation
        if (!this.order?.ProductList?.length) {
            return;
        }

        const referenceIds = this.order.ProductList.map((p: any) => p.ReferenceId);

        this.productService.GetProductInfoByReferenceIds({
            Lang: localStorage.getItem('lang') || 'en',
            ReferenceIds: referenceIds
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
            if (result?.length) {
                const formatCartList: any[] = [];

                result.forEach((x: any) => {
                    const product = this.order.ProductList.find((p: any) => p.ReferenceId === x.ReferenceId);
                    if (product?.Quantity > 0) {
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

            this.modalRef?.close();
            this.router.navigate(['/shop/cart']);
        });
    }
}
