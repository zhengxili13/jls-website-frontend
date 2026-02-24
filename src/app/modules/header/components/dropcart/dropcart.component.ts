import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { CartItem } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';
import { LoginService } from 'src/app/login.service';
import { environment } from 'src/environments/environment';
declare const Configuration: any;
@Component({
    selector: 'app-header-dropcart',
    templateUrl: './dropcart.component.html',
    styleUrls: ['./dropcart.component.scss']
})
export class DropcartComponent {
    removedItems: CartItem[] = [];

    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    public host: string = Configuration.SERVER_API_URL;
    
    constructor(
        public cart: CartService,
        public root: RootService,
        public loginService: LoginService
    ) { }

    remove(item: CartItem): void {
        if (this.removedItems.includes(item)) {
            return;
        }

        this.removedItems.push(item);
        this.cart.remove(item).subscribe({complete: () => this.removedItems = this.removedItems.filter(eachItem => eachItem !== item)});
    }
}
