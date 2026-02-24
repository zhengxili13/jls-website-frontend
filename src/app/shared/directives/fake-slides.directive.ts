import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appFakeSlides]',
    exportAs: 'appFakeSlides'
})
export class FakeSlidesDirective implements OnInit, OnChanges, OnDestroy {
    @Input() options: any;
    @Input() appFakeSlides = 0;

    slides: number[] = [];
    slidesCount = 0;

    private readonly destroy$ = new Subject<void>();
    private readonly cdr = inject(ChangeDetectorRef);

    constructor(
        private zone: NgZone,
        private el: ElementRef
    ) { }

    ngOnInit(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent(window, 'resize')
                .pipe(
                    debounceTime(150),
                    takeUntil(this.destroy$)
                )
                .subscribe(() => {
                    this.zone.run(() => {
                        this.calc();
                    });
                });
        });
        this.calc();
    }

    calc(): void {
        let newFakeSlidesCount = 0;

        if (this.options) {
            let match = -1;
            const viewport = this.el.nativeElement.querySelector('.owl-carousel')?.clientWidth || 0;
            const overwrites = this.options.responsive;

            if (overwrites) {
                for (const key in overwrites) {
                    if (Object.prototype.hasOwnProperty.call(overwrites, key)) {
                        const numKey = Number(key);
                        if (numKey <= viewport && numKey > match) {
                            match = numKey;
                        }
                    }
                }
            }

            if (match >= 0) {
                const items = overwrites[match].items;
                newFakeSlidesCount = Math.max(0, items - this.appFakeSlides);
            } else if (this.options.items) {
                newFakeSlidesCount = Math.max(0, this.options.items - this.appFakeSlides);
            }
        }

        if (this.slidesCount !== newFakeSlidesCount) {
            this.slides = Array.from({ length: newFakeSlidesCount }, (_, i) => i);
            this.slidesCount = newFakeSlidesCount;
            this.cdr.markForCheck();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['options'] || changes['appFakeSlides']) {
            this.calc();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
