import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { ProductsList } from '../interfaces/list';
import { SerializedFilterValues } from '../interfaces/filter';


export interface ListOptions {
    page?: number;
    limit?: number;
    sort?: string;
    filterValues?: SerializedFilterValues;
}

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    constructor(
        private http: HttpClient,
    ) { }

  
}
