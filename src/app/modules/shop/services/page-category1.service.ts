import { EventEmitter, Injectable } from '@angular/core';
import { ProductsList } from '../../../shared/interfaces/list';
import { Product, Product1 } from '../../../shared/interfaces/product';
import { Filter, SerializedFilterValues } from '../../../shared/interfaces/filter';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';


export interface FilterOptions {
    Begin?: number;
    Step?: number;
    OrderBy?: string;
    SearchText?: string;
    MainCategory?: number;
    SecondCategory?: number;
    PriceIntervalLower?: number;
    PriceIntervalUpper?: number;
    MinQuantity?: number;
    Lang: string;
}
/**
 * This service serves as a mediator between the PageCategoryComponent, ProductsViewComponent and WidgetFiltersComponent components.
 */
@Injectable( {
    providedIn: 'root',
  })
export class PageCategoryService1 {

    // isLoading
    private isLoadingState = false;
    private isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoadingState);

    isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();

    // list
    private listState: any = [];
    private listSource: BehaviorSubject<any> = new BehaviorSubject<any>(this.listState);

    list$: Observable<any> = this.listSource.pipe(filter(x => x !== null));
    public pageOption = [30, 60 ];

    constructor(public storeService: StoreService) {
        this.initOptions();
    }
    // options
    // Set default value
    public optionsState: FilterOptions;

    get options(): FilterOptions {
        return this.optionsState;
    }

    optionsChange$: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();

    // getters for list
    get items(): Product1[] { return this.listState.items; }
    get TotalCount(): number { return this.listState.TotalCount; };

    get Begin(): number { return this.optionsState.Begin  };
    
    get CurrentPage(): number { return this.optionsState.Begin + 1 }; // page of the programme start from 0 not 1
    get OrderBy(): string { return this.optionsState.OrderBy };
    get Step(): number { return this.optionsState.Step };
    get TotalPage(): number { return Math.floor( this.listState.TotalCount / this.optionsState.Step) + 1 };
    get FromItems(): number { return (this.optionsState.Begin * this.optionsState.Step) + 1 };
    get ToItems(): number { return (this.listState.TotalCount < (this.optionsState.Begin + 1) * this.optionsState.Step) ? this.listState.TotalCount : (this.optionsState.Begin + 1) * this.optionsState.Step };
    // set functions
    setIsLoading(value: boolean): void {
        this.isLoadingState = value;
        this.isLoadingSource.next(value);
        this.storeService.showHideProgressBar$.next(value);
    }

    setList(list: any): void {
        this.listState = list;
        this.listSource.next(this.listState);
    }

    setOptions(options: FilterOptions, emitEvent: boolean = true): void {
        this.optionsState = options;

        if (emitEvent) {
            this.optionsChange$.emit(this.optionsState);
        }
    }

    updateOptions(options: FilterOptions, emitEvent: boolean = true): void {
        this.setOptions({ ...this.optionsState, ...options }, emitEvent);
    }

    resetAllOptions(emitEvent: boolean = true) {
        this.setOptions({
            Begin: 0,
            Step: this.pageOption[0],
            Lang: localStorage.getItem('lang'),
            OrderBy: 'Default'
        }, true);
    }

    resetPartialOptions(emitEvent: boolean = true) {
        this.setOptions({
            Begin: 0,
            Step: this.pageOption[0],
            Lang: localStorage.getItem('lang'),
            OrderBy: 'Default',
            MainCategory: this.options.MainCategory,
            SecondCategory: this.options.SecondCategory
        }, emitEvent);
    }

    initOptions() {
        if (this.optionsState == null) {
            this.optionsState = {
                Lang: localStorage.getItem('lang'),
                Begin: 0,
                Step: this.pageOption[0]
            };
        }

    }

}
