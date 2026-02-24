import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service';
import { mobileMenu } from '../../../../../data/mobile-menu';
import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { LoginService } from 'src/app/login.service';

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnDestroy, OnInit {
    private destroy$: Subject<void> = new Subject<void>();

    isOpen = false;
    links: MobileMenuItem[] = mobileMenu;

    public categories: any[] = [];
    constructor(public mobilemenu: MobileMenuService,
        public translateService: TranslateService,
        public loginService: LoginService,
        public storeService: StoreService) { }

    ngOnInit(): void {
        this.mobilemenu.isOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => this.isOpen = isOpen);
        this.storeService.categoryList.subscribe(result => {
            this.categories = result.sort((a, b) => b.SecondCategory.length - a.SecondCategory.length);
            if (this.links != null && this.links.length > 0) {
                this.links.map(p => {
                    if (p.code != null && p.code == "catalog" && this.categories != null && this.categories.length > 0) {
                        p.children = [];
                        this.categories.map(x => p.children.push({
                            type: 'link',
                            label: x.Label,
                            url: '/shop/catalog',
                            params: { CategoryLabel: x.CategoryShortLabel, ReferenceItemId: x.Id }
                        }));
                    }
                });
            }
        });

        this.loginService.loginStatus.subscribe(p => {
            if (p == true) {
                this.links.map(x => {
                    if (x.code != null && x.code == 'shop') {
                        x.children.push({ type: 'link', label: 'mobileMenu.Wishlist', url: '/shop/wishlist', code: 'wishlist' });
                    }
                })
            }
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onItemClick(event: MobileMenuItem): void {
        if (event.type === 'link') {
            this.mobilemenu.close();
        }

        if (event.data && event.data.language) {
            localStorage.setItem('lang', event.data.language);
            this.translateService.currentLang = event.data.language;
            this.translateService.setDefaultLang(event.data.language);
            // todo reload complete page now, reload only data for the futher
            window.location.reload();
        }
    }
}
