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
export class ExportService {
    public host: string = Configuration.SERVER_API_URL;
    constructor(
        private http: HttpClient,
    ) { }

    private apiUrlExportAction = this.host + 'api/Export/ExportAction';

    ExportAction(criteria): Observable<any> {
        return this.http.post(this.apiUrlExportAction, criteria);
    }

}
