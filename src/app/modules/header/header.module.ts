import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { SharedModule } from '../../shared/shared.module';

// components
import { AccountMenuComponent } from './components/account-menu/account-menu.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { DropcartComponent } from './components/dropcart/dropcart.component';
import { HeaderComponent } from './header.component';
import { IndicatorComponent } from './components/indicator/indicator.component';
import { LinksComponent } from './components/links/links.component';
import { MegamenuComponent } from './components/megamenu/megamenu.component';
import { MenuCategoryComponent } from './components/menuCategory/menuCategory.component';
import { NavComponent } from './components/nav/nav.component';
import { SearchComponent } from './components/search/search.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon'

@NgModule({
    declarations: [
        // components
        MenuComponent,
        AccountMenuComponent,
        DepartmentsComponent,
        DropcartComponent,
        HeaderComponent,
        IndicatorComponent,
        LinksComponent,
        MegamenuComponent,
        MenuCategoryComponent,
        NavComponent,
        SearchComponent,
        TopbarComponent,
    ],
    imports: [
        TranslateModule,
        // modules (angular)
        CommonModule,
        RouterModule,
        // modules
        SharedModule,
        FormsModule,
        MatIconModule
    ],
    exports: [
        // components
        HeaderComponent
    ]
})
export class HeaderModule { }
