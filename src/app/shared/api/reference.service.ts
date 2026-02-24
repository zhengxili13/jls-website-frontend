import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
declare const Configuration: any;
@Injectable({
    providedIn: 'root'
})
export class ReferenceService {
    public host: string = Configuration.SERVER_API_URL;
    constructor(
        private http: HttpClient,
    ) { }

    private apiUrlGetReferenceItemsByCategoryLabels = this.host + 'api/Reference/GetReferenceItemsByCategoryLabels';
    private apiUrlGetWbesiteslides = this.host + 'api/Reference/GetWbesiteslides';
    private apiUrlGetAllCategoryList = this.host + 'api/Reference/GetAllCategoryList';

    GetReferenceItemsByCategoryLabels(criteria): Observable<any> {
        return this.http.post(this.apiUrlGetReferenceItemsByCategoryLabels, criteria);
    }
    GetWbesiteslides(): Observable<any> {
        return this.http.get(this.apiUrlGetWbesiteslides);
    }

    GetAllCategoryList(): Observable<any> {
        const criteria: any = { step: 0, begin: 0 };
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetAllCategoryList, { params });
    }
}
