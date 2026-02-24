import { NgModule } from '@angular/core';
import { Routes, RouterModule, Data, ResolveData } from '@angular/router';
import { PageCategoryComponent } from './pages/page-category/page-category.component';
import { PageCartComponent } from './pages/page-cart/page-cart.component';
import { PageWishlistComponent } from './pages/page-wishlist/page-wishlist.component';
import { PageCheckoutComponent } from './pages/page-checkout/page-checkout.component';
import { CheckoutGuard } from './guards/checkout.guard';
import { PageProductComponent } from './pages/page-product/page-product.component';
import { ProductsListResolverService } from './resolvers/products-list-resolver.service';
import { CategoryResolverService } from './resolvers/category-resolver.service';
import { ProductResolverService } from './resolvers/product-resolver.service';
import { PageOrderSuccessComponent } from './pages/page-order-success/page-order-success.component';
import { PageCategoryService1 } from './services/page-category1.service';
import { WishListResolverService } from './resolvers/wish-list-resolver.service';
import { PageCheckoutResolverService } from './pages/page-checkout/page-checkout.component-resolver.service';
import { PageOrderSuccessResolverService } from './pages/page-order-success/page-order-success.component-resolver.service';
import { AuthGuard } from 'src/app/auth.guard';

const categoryPageData: Data = {
    // Number of products per row. Possible values: 3, 4, 5.
    columns: 3,
    // Shop view mode by default. Possible values: 'grid', 'grid-with-features', 'list'.
    viewMode: 'grid',
    // Sidebar position. Possible values: 'start', 'end'.
    // It does not matter if the value of the 'columns' parameter is not 3.
    // For LTR scripts "start" is "left" and "end" is "right".
    sidebarPosition: 'start'
};

// const categoryPageResolvers: ResolveData = {
//     categorys: CategoryResolverService,
//     products: ProductsListResolverService
// };

const routes: Routes = [
    {
        path: 'catalog',
        component: PageCategoryComponent,
        data: categoryPageData,
      //  resolve: categoryPageResolvers,
    },
    {
        // TODO REMOVE
        path: 'catalog/:categorySlug',
        component: PageCategoryComponent,
        data: categoryPageData
        // ,
        // resolve: categoryPageResolvers,
    },
    {
        // TODO REMOVE
        path: 'products',
        component: PageProductComponent,
        data: {
            // Product page layout. Possible values: 'standard', 'columnar', 'sidebar'.
            layout: 'standard',
            // Sidebar position. Possible values: 'start', 'end'.
            // It does not matter if the value of the 'layout' parameter is not 'sidebar'.
            // For LTR scripts "start" is "left" and "end" is "right".
            sidebarPosition: 'start'
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
            product: ProductResolverService
        },
    },
    {
        // TODO REMOVE
        path: 'products/:productSlug',
        component: PageProductComponent,
        data: {
            // Product page layout. Possible values: 'standard', 'columnar', 'sidebar'.
            layout: 'standard',
            // Sidebar position. Possible values: 'start', 'end'.
            // It does not matter if the value of the 'layout' parameter is not 'sidebar'.
            // For LTR scripts "start" is "left" and "end" is "right".
            sidebarPosition: 'start'
        },
        resolve: {
            product: ProductResolverService
        },
    },
    {
        path: 'cart',
        pathMatch: 'full',
        component: PageCartComponent
    },
    {
        path: 'cart/checkout',
        component: PageCheckoutComponent,
        canActivate: [CheckoutGuard],
        resolve: { // 此处使用resolve
            initInfo: PageCheckoutResolverService
        },
    },
    {
        path: 'cart/checkout/success/:id',
        component: PageOrderSuccessComponent,
        resolve:{
            initInfo: PageOrderSuccessResolverService
        }
    },
    {
        path: 'wishlist',
        component: PageWishlistComponent,
        resolve:{
            favoriteList: WishListResolverService
        },
        canActivate: [AuthGuard],
    }
    // --- END ---
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [PageCategoryService1]
})
export class ShopRoutingModule { }
