import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Address } from '../../../../shared/interfaces/address';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/shared/api/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app--addresses-list',
    templateUrl: './addresses-list.component.html',
    styleUrls: ['./addresses-list.component.sass']
})
export class AddressesListComponent {
    @Input() returnUrl: string;
    @Input() addresses: any[] = [];
    @Input() disableRemove: boolean = false;
    @Input() selectAddress: boolean = false;
    @Output() change: EventEmitter<number> = new EventEmitter<number>();

    constructor(public route: ActivatedRoute, public storeService: StoreService, public addressService: UserService,
        private toastr: ToastrService, public userService: UserService) {

    }

    ngOnInit(){
        if(this.addresses.length>0){
            let defaultAddress = this.addresses.find(p=>p.IsDefaultAdress);
            if(defaultAddress == null){
                defaultAddress = this.addresses[0];
            }
            this.selectAddressEvent(defaultAddress);
        }
    }

    selectAddressEvent(address: any) {
        this.addresses.map(p => p.selected = null);
        address.selected = true;

        this.change.emit(address.Id);
    }


    remove(Id: number) {
        if (this.addresses.length > 1) {
            this.addressService.RemoveShippingAddress({ AddressId: Id }).subscribe(result => {
                if (result > 0) {
                    this.toastr.success('Save successfully') // todo translate
                    this.refreshData();
                }
                else {
                    this.toastr.error("Some error is occured");
                }
            },
                error => {

                });
        }
    }

    refreshData() {
        this.userService.GetUserShippingAdress({
            UserId: localStorage.getItem('userId')
        }).subscribe(p => this.addresses = p);
    }
}
