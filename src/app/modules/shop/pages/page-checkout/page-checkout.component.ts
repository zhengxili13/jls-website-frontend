import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RootService } from '../../../../shared/services/root.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from 'src/app/shared/api/order.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './page-checkout.component.html',
    styleUrls: ['./page-checkout.component.scss']
})
export class PageCheckoutComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();
    public loading = false;

    public setSameAddress: boolean = false;

    public orderCriteria: any = {
        ShippingAdressId: 0,
        FacturationAdressId: 0,
        UserId: localStorage.getItem('userId'),
        References: [],
        ClientRemark: null,
        AcceptCondition: false
    };

    public facturationAddress: any = {};
    public shippingAddress: any[] = [];
    constructor(
        public root: RootService,
        public cart: CartService,
        private route: ActivatedRoute,
        private router: Router,
        public storeService: StoreService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private orderService: OrderService
    ) {

        this.route.data.subscribe(data => {
            this.facturationAddress = data.initInfo[0];
            this.orderCriteria.FacturationAdressId = this.facturationAddress.Id;
            this.shippingAddress = data.initInfo[1];
        });

        this.cart.items$.subscribe(p => {
            p.map(x => {
                this.orderCriteria.References.push(
                    {
                        ReferenceId: x.product.ReferenceId,
                        Quantity: x.quantity
                    }
                );
            })

        })
    }

    ngOnInit(): void {
        this.cart.quantity$.pipe(takeUntil(this.destroy$)).subscribe(quantity => {
            if (!quantity) {
                this.router.navigate(['../cart'], { relativeTo: this.route }).then();
            }
        });
    }

    selectedAddressChange(event: number) {
        this.orderCriteria.ShippingAdressId = event;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ValideOrder():void {
        // Set shipping address as facturation address 
        if(this.setSameAddress==true &&  this.orderCriteria!=null && this.orderCriteria.ShippingAdressId!=null){
            this.orderCriteria.FacturationAdressId = this.orderCriteria.ShippingAdressId
        }

        // Save
        if (this.orderCriteria.ShippingAdressId != null && this.orderCriteria.ShippingAdressId > 0
            && this.orderCriteria.FacturationAdressId != null && this.orderCriteria.FacturationAdressId > 0
            && this.orderCriteria.UserId != null && this.orderCriteria.UserId > 0
            && this.orderCriteria.References != null && this.orderCriteria.References.length > 0
            && this.orderCriteria.AcceptCondition != null && this.orderCriteria.AcceptCondition == true) {
            this.loading = true;
            this.orderService.SaveOrder(this.orderCriteria).subscribe(result => {
                if (result > 0) {
                    this.toastr.success(this.translateService.instant('Msg_OrdePassedSuccess'));

                    this.cart.clear();
                    this.router.navigate(['../shop/cart/checkout/success', result]);
                }
                else {
                    this.toastr.error(this.translateService.instant('Msg_Error'));
                }
                this.loading = false;
            },
                error => {
                    this.toastr.error(this.translateService.instant('Msg_Error'));
                })
        }
        else {
            if (this.orderCriteria.ShippingAdressId == null || this.orderCriteria.ShippingAdressId <= 0) {
                this.toastr.error(this.translateService.instant('page-checkout.NoAddressAvailable'));
            }
            else if (this.orderCriteria.References == null || this.orderCriteria.References.length <= 0) {
                this.toastr.error(this.translateService.instant('Msg_Error'));
                this.router.navigate(['/']);
            }
            else if (this.orderCriteria.AcceptCondition == null || this.orderCriteria.AcceptCondition == false) {
                this.toastr.error(this.translateService.instant('page-checkout.CheckCondition'));
            }
            else if (this.orderCriteria.FacturationAdressId == null || this.orderCriteria.FacturationAdressId <= 0) {
                this.toastr.error(this.translateService.instant('Msg_Error'));
                this.router.navigate(['/']);
            }
            else if (this.orderCriteria.UserId == null || this.orderCriteria.UserId <= 0) {
                this.toastr.error(this.translateService.instant('Msg_Error'));
                this.router.navigate(['/']);
            }
        }
    }
}
