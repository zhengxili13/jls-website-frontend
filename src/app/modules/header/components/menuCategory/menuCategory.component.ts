import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { DirectionService } from '../../../../shared/services/direction.service';
import { Category } from 'src/app/shared/interfaces/selfDefinedIntefaces/Category';

@Component({
    selector: 'app-category-menu',
    templateUrl: './menuCategory.component.html',
    styleUrls: ['./menuCategory.component.scss']
})
export class MenuCategoryComponent implements AfterViewChecked {
    @Input() layout: 'classic' | 'topbar' = 'classic';
    @Input() items: Category[] = [];

    @Output() itemClick: EventEmitter<Category> = new EventEmitter<Category>();

    @ViewChild('menuElement') elementRef!: ElementRef;
    @ViewChildren('submenuElement') submenuElements!: QueryList<ElementRef>;
    @ViewChildren('itemElement') itemElements!: QueryList<ElementRef>;

    hoveredItem: Category | null = null;
    reCalcSubmenuPosition = false;

    get element(): HTMLDivElement {
        return this.elementRef.nativeElement;
    }

    constructor(
        private direction: DirectionService
    ) { }

    onItemMouseEnter(item: Category): void {
        if (this.hoveredItem !== item) {
            this.hoveredItem = item;
        }
    }

    onMouseLeave(): void {
        this.hoveredItem = null;
    }

    onTouchClick(event: Event, item: Category): void {
        if (event.cancelable) {
            if (this.hoveredItem && this.hoveredItem === item) {
                return;
            }
        }
    }

    onSubItemClick(item: Category): void {
        this.hoveredItem = null;
        this.itemClick.emit(item);
    }

    ngAfterViewChecked(): void {
        if (!this.reCalcSubmenuPosition) {
            return;
        }

        this.reCalcSubmenuPosition = false;

        const itemElement = this.getCurrentItemElement();
        const submenuElement = this.getCurrentSubmenuElement();

        if (!itemElement || !submenuElement) {
            return;
        }

        const menuRect = this.element.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();
        const submenuRect = submenuElement.getBoundingClientRect();

        const viewportHeight = window.innerHeight;
        const paddingY = 20;
        const paddingBottom = Math.min(viewportHeight - itemRect.bottom, paddingY);
        const maxHeight = viewportHeight - paddingY - paddingBottom;

        submenuElement.style.maxHeight = `${maxHeight}px`;

        const submenuHeight = submenuElement.getBoundingClientRect().height;
        const position = Math.min(
            Math.max(
                itemRect.top - menuRect.top,
                0
            ),
            (viewportHeight - paddingBottom - submenuHeight) - menuRect.top
        );

        submenuElement.style.top = `${position}px`;

        if (this.direction.isRTL()) {
            const submenuLeft = menuRect.left - submenuRect.width;
            submenuElement.classList.toggle('menu__submenu--reverse', submenuLeft < 0);
        } else {
            const submenuRight = menuRect.left + menuRect.width + submenuRect.width;
            submenuElement.classList.toggle('menu__submenu--reverse', submenuRight > document.body.clientWidth);
        }
    }

    getCurrentItemElement(): HTMLDivElement | null {
        if (!this.hoveredItem) {
            return null;
        }

        const index = this.items.indexOf(this.hoveredItem);
        const elements = this.itemElements.toArray();

        if (index === -1 || !elements[index]) {
            return null;
        }

        return elements[index].nativeElement as HTMLDivElement;
    }

    getCurrentSubmenuElement(): HTMLDivElement | null {
        if (!this.hoveredItem?.CategoryId) {
            return null;
        }

        let submenuIndex = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item === this.hoveredItem) {
                break;
            }
            if (item.CategoryId) {
                submenuIndex++;
            }
        }

        const elements = this.submenuElements.toArray();
        if (submenuIndex === -1 || !elements[submenuIndex]) {
            return null;
        }

        return elements[submenuIndex].nativeElement as HTMLDivElement;
    }
}
