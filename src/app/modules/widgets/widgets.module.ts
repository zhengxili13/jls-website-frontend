import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// modules (third-party)
import { NgxSliderModule } from '@angular-slider/ngx-slider';

// modules
import { SharedModule } from '../../shared/shared.module';

// widgets
import { WidgetCategoriesComponent } from './widget-categories/widget-categories.component';
import { WidgetFiltersComponent } from './widget-filters/widget-filters.component';
import { WidgetProductsComponent } from './widget-products/widget-products.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        // widgets
        WidgetCategoriesComponent,
        WidgetFiltersComponent,
        WidgetProductsComponent
    ],
    imports: [
        // modules (angular)
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // modules (third-party)
        NgxSliderModule,
        // modules
        SharedModule,
        TranslateModule
    ],
    exports: [
        // widgets
        WidgetCategoriesComponent,
        WidgetFiltersComponent,
        WidgetProductsComponent
    ],
    providers: [
        DatePipe
    ]
})
export class WidgetsModule { }
