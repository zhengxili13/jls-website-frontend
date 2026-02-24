import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { mergeMap, map } from 'rxjs/operators';
declare const Configuration: any;
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    public host: string = Configuration.SERVER_API_URL;
    constructor(
        private http: HttpClient,
    ) { }

    private apiUrlGetOrdersListByUserId = this.host + 'api/Order/GetOrdersListByUserId';
    private apiUrlGetOrdersListByOrderId = this.host + 'api/Order/GetOrdersListByOrderId';
    private apiUrlSaveOrder = this.host + 'api/Order/SaveOrder';

    GetOrdersListByUserId(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetOrdersListByUserId, { params }).pipe(map((p: any) => p.Data));
    }

    GetOrdersListByOrderId(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetOrdersListByOrderId, { params }).pipe(map((p: any) => p.Data));
    }

    SaveOrder(criteria): Observable<any> {
        return this.http.post(this.apiUrlSaveOrder, criteria).pipe(map((p: any) => p.Data));
    }
}
