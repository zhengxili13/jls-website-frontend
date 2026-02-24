import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageOrdersListComponent } from './pages/page-orders-list/page-orders-list.component';
import { PageAddressesListComponent } from './pages/page-addresses-list/page-addresses-list.component';
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PagePasswordComponent } from './pages/page-password/page-password.component';
import { PageOrderDetailsComponent } from './pages/page-order-details/page-order-details.component';
import { PageEditAddressComponent } from './pages/page-edit-address/page-edit-address.component';
import { PageDashboardResolverService } from './pages/page-dashboard/page-dashboard.component-resolver.service';
import { PageProfileResolverService } from './pages/page-profile/page-profile.component-resolver.service';
import { PageOrderListResolverService } from './pages/page-orders-list/page-orders-list.component-resolver.service';
import { PageOrderDetailsResolverService } from './pages/page-order-details/page-orders-details.component-resolver.service';
import { PageAddressesListResolverService } from './pages/page-addresses-list/page-addresses-list.component-resolver.service';
import { PageEditAddressResolverService } from './pages/page-edit-address/page-edit-address.component-resolver.service';
import { AuthGuard } from 'src/app/auth.guard';
import { PageEmailSendedComponent } from './pages/page-email-sended/page-email-sended.component';
import { PageRegistreComponent } from './pages/page-registre/page-registre.component';
import { PageResetPasswordComponent } from './pages/page-reset-password/page-reset-password.component';
import { PageChatComponent } from './pages/page-chat/page-chat.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: PageDashboardComponent,
                resolve: { // 此处使用resolve
                    initInfo: PageDashboardResolverService
                },
            },
            {
                path: 'profile',
                component: PageProfileComponent,
                resolve: {
                    initInfo: PageProfileResolverService
                }
            },
            {
                path: 'addresses',
                component: PageAddressesListComponent,
                resolve: {
                    initInfo: PageAddressesListResolverService
                }
            },
            {
                path: 'address',
                component: PageEditAddressComponent,
                resolve: {
                    initInfo: PageEditAddressResolverService
                },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'orders',
                component: PageOrdersListComponent,
                resolve: {
                    initInfo: PageOrderListResolverService
                }
            },
            {
                path: 'order',
                component: PageOrderDetailsComponent,
                resolve: {
                    initInfo: PageOrderDetailsResolverService
                }
            },
            {
                path: 'password',
                component: PagePasswordComponent
            }
        ]
    },
    {
        path: 'login',
        component: PageLoginComponent
    },
    {
        path: 'registre',
        component: PageRegistreComponent
    },
    {
        path: 'email',
        component: PageEmailSendedComponent
    },
    {
        path: 'resetPassword',
        component: PageResetPasswordComponent
    },
    {
        path:'chat',
        component:PageChatComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
