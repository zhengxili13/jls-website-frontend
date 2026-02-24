import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { SharedModule } from '../../shared/shared.module';

// components
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MobileLinksComponent } from './components/mobile-links/mobile-links.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        // components
        MobileHeaderComponent,
        MobileLinksComponent,
        MobileMenuComponent
    ],
    imports: [
        TranslateModule,
        // modules (angular)
        CommonModule,
        RouterModule,
        // modules
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        // components
        MobileHeaderComponent,
        MobileMenuComponent
    ]
})
export class MobileModule { }
