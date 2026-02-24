import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';
// import { ModalModule } from 'ngx-bootstrap/modal';

// directives
import { ClickDirective } from './directives/click.directive';
import { CollapseContentDirective, CollapseDirective, CollapseItemDirective } from './directives/collapse.directive';
import { DepartmentsAreaDirective } from './directives/departments-area.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { FakeSlidesDirective } from './directives/fake-slides.directive';
import { OutsideTouchClickDirective } from './directives/outside-touch-click.directive';
import { OwlPreventClickDirective } from './directives/owl-prevent-click.directive';
import { TouchClickDirective } from './directives/touch-click.directive';

// components
import { AlertComponent } from './components/alert/alert.component';
import { IconComponent } from './components/icon/icon.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { ProductComponent } from './components/product/product.component';
import { QuickviewComponent } from './components/quickview/quickview.component';
import { RatingComponent } from './components/rating/rating.component';

// pipes
import { ColorTypePipe } from './pipes/color-type.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCard1Component } from './components/product-card1/product-card1.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';


import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from './components/chat/chat.component';
import { A11yModule } from '@angular/cdk/a11y';


@NgModule({
    declarations: [
        // directives
        ClickDirective,
        CollapseContentDirective,
        CollapseDirective,
        CollapseItemDirective,
        DepartmentsAreaDirective,
        DropdownDirective,
        FakeSlidesDirective,
        OutsideTouchClickDirective,
        OwlPreventClickDirective,
        TouchClickDirective,
        // components
        AlertComponent,
        IconComponent,
        InputNumberComponent,
        LoadingBarComponent,
        PageHeaderComponent,
        PaginationComponent,
        PostCardComponent,
        ProductCard1Component,
        ProductComponent,
        QuickviewComponent,
        RatingComponent,
        ChatComponent,
        // pipes
        CurrencyFormatPipe,
        ColorTypePipe,
        ConfirmDialogComponent
    ],
    imports: [
        A11yModule,
        MatDialogModule,

        MatFormFieldModule,
        MatButtonModule,
        TranslateModule,
        // modules (angular)
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        // modules (third-party)
        CarouselModule
    ],
    exports: [
        // directives
        ClickDirective,
        CollapseContentDirective,
        CollapseDirective,
        CollapseItemDirective,
        DepartmentsAreaDirective,
        DropdownDirective,
        FakeSlidesDirective,
        OutsideTouchClickDirective,
        OwlPreventClickDirective,
        TouchClickDirective,
        // components
        AlertComponent,
        IconComponent,
        InputNumberComponent,
        LoadingBarComponent,
        PageHeaderComponent,
        PaginationComponent,
        PostCardComponent,
        ProductCard1Component,
        ProductComponent,
        QuickviewComponent,
        RatingComponent,
        // pipes
        ColorTypePipe,
        CurrencyFormatPipe,
        ChatComponent
    ]
})
export class SharedModule { }
