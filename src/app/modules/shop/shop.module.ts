import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';

// modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';
import { WidgetsModule } from '../widgets/widgets.module';

// components
import { ProductsViewComponent } from './components/products-view/products-view.component';
import { ProductTabsComponent } from './components/product-tabs/product-tabs.component';
import { ShopSidebarComponent } from './components/shop-sidebar/shop-sidebar.component';

// pages
import { PageCartComponent } from './pages/page-cart/page-cart.component';
import { PageCategoryComponent } from './pages/page-category/page-category.component';
import { PageCheckoutComponent } from './pages/page-checkout/page-checkout.component';
import { PageProductComponent } from './pages/page-product/page-product.component';
import { PageWishlistComponent } from './pages/page-wishlist/page-wishlist.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';
import { PageOrderSuccessComponent } from './pages/page-order-success/page-order-success.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccountModule } from '../account/account.module';
import { NgxLoadingModule } from 'ngx-loading';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { PageCategoryService1 } from './services/page-category1.service';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        // components
        ProductsViewComponent,
        ProductTabsComponent,
        ShopSidebarComponent,
        // pages
        PageCartComponent,
        PageCategoryComponent,
        PageCheckoutComponent,
        PageProductComponent,
        PageWishlistComponent,
        ProductSidebarComponent,
        PageOrderSuccessComponent
    ],
    imports: [
        TranslateModule,
        // modules (angular)
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // modules (third-party)
        CarouselModule,
        // modules
        BlocksModule,
        SharedModule,
        ShopRoutingModule,
        WidgetsModule,
        AccountModule,
        MatProgressBarModule,
        NgxLoadingModule.forRoot({}),
        MatIconModule
    ],
    providers: [
        
    ]
})
export class ShopModule { }
