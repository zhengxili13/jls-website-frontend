import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { QuickviewService } from '../../services/quickview.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../interfaces/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-quickview',
    templateUrl: './quickview.component.html',
    styleUrls: ['./quickview.component.scss']
})
export class QuickviewComponent implements AfterViewInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    @ViewChild('modal', { read: TemplateRef }) template: TemplateRef<any>;

    modalRef: MatDialogRef<any>;
    product: Product;

    constructor(
        private quickview: QuickviewService,
        private dialog: MatDialog
    ) { }

    ngAfterViewInit(): void {
        this.quickview.show$.pipe(takeUntil(this.destroy$)).subscribe(product => {
            if (this.modalRef) {
                this.modalRef.close();
            }

            this.product = product;
            this.modalRef = this.dialog.open(this.template, {
                width: '1140px',
                panelClass: 'modal-dialog-centered'
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
