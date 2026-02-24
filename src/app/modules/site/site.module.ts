import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';

// modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { SiteRoutingModule } from './site-routing.module';

// pages
import { PageAboutUsComponent } from './pages/page-about-us/page-about-us.component';
import { PageContactUsComponent } from './pages/page-contact-us/page-contact-us.component';
import { PageTermsComponent } from './pages/page-terms/page-terms.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { PageDeliveryInfoComponent } from './pages/page-delivery-info/page-delivery-info.component';

@NgModule({
    declarations: [
        // pages
        PageAboutUsComponent,
        PageContactUsComponent,
        PageTermsComponent,
        PageDeliveryInfoComponent,
    ],
    imports: [
        TranslateModule,
        // modules (angular)
        CommonModule,
        // modules (third-party)
        CarouselModule,
        // modules
        BlocksModule,
        SharedModule,
        SiteRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgxLoadingModule.forRoot({}),
    ]
})
export class SiteModule { }
