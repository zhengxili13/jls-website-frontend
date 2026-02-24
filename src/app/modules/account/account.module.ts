import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// modules
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';

// components
import { LayoutComponent } from './components/layout/layout.component';

// pages
import { PageAddressesListComponent } from './pages/page-addresses-list/page-addresses-list.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageOrdersListComponent } from './pages/page-orders-list/page-orders-list.component';
import { PagePasswordComponent } from './pages/page-password/page-password.component';
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PageOrderDetailsComponent } from './pages/page-order-details/page-order-details.component';
import { PageEditAddressComponent } from './pages/page-edit-address/page-edit-address.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { AddressesListComponent } from './components/address-list/addresses-list.component';
import { PageEmailSendedComponent } from './pages/page-email-sended/page-email-sended.component';

import { MatStepperModule } from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { PageRegistreComponent } from './pages/page-registre/page-registre.component';
import { PageResetPasswordComponent } from './pages/page-reset-password/page-reset-password.component';
import { PageChatComponent } from './pages/page-chat/page-chat.component';
import { ChatService } from 'src/app/shared/api/chat.service';
@NgModule({
    declarations: [
        // components
        LayoutComponent,
        // pages
        PageAddressesListComponent,
        PageDashboardComponent,
        PageLoginComponent,
        PageRegistreComponent,
        PageOrdersListComponent,
        PagePasswordComponent,
        PageProfileComponent,
        PageOrderDetailsComponent,
        PageEditAddressComponent,
        AddressesListComponent,
        PageEmailSendedComponent,
        PageResetPasswordComponent,
        PageChatComponent
    ],
    imports: [
        TranslateModule,
        // modules (angular)
        CommonModule,
        // modules
        AccountRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule
    ],
    exports: [
        AddressesListComponent
    ],
    providers:[
        ChatService
    ]
})
export class AccountModule { }
