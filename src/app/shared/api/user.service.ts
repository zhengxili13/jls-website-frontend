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
export class UserService {
    public host: string = Configuration.SERVER_API_URL;
    constructor(
        private http: HttpClient,
    ) { }

    private apiUrlGetUserDefaultShippingAdress = this.host + 'api/Adress/GetUserDefaultShippingAdress';

    private apiUrlGetUserShippingAdress = this.host + 'api/Adress/GetUserShippingAdress';

    private apiUrlGetUserFacturationAdress = this.host + 'api/Adress/GetUserFacturationAdress';

    private apiUrlCreateOrUpdateAdress = this.host + 'api/Adress/CreateOrUpdateAdress';

    private apiUrlGetAddressById = this.host + 'api/Adress/GetAddressById';

    private apiUrlGetUserById = this.host + 'api/User/GetUserById';

    private apiUrlUpdateUserInfo = this.host + 'api/User/UpdateUserInfo';

    private apiUrlRemoveShippingAddress = this.host + 'api/Adress/RemoveShippingAddress';

    private apiUrlUpdatePassword = this.host + 'api/User/UpdatePassword';

    private apiUrlSendPasswordResetLink = this.host + 'api/Account/SendPasswordResetLink';

    private apiUrlRegistre = this.host + 'api/Account/Register';

    private apiUrlCheckUserIsAlreadyExistAsync = this.host + 'api/User/CheckUserIsAlreadyExistAsync';

    private apiUrlInsertSubscribeEmail = this.host + 'api/User/InsertSubscribeEmail';

    private apiUrlResetPassword = this.host + 'api/Account/ResetPassword';

    Register(criteria): Observable<any> {
        return this.http.post(this.apiUrlRegistre, criteria);
    }

    ResetPassword(criteria): Observable<any> {
        return this.http.post(this.apiUrlResetPassword, criteria);
    }


    CheckUserIsAlreadyExistAsync(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlCheckUserIsAlreadyExistAsync, { params });
    }

    InsertSubscribeEmail(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlInsertSubscribeEmail, { params });
    }

    GetUserDefaultShippingAdress(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetUserDefaultShippingAdress, { params }).pipe(map((p: any) => p.Data));
    }

    SendPasswordResetLink(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlSendPasswordResetLink, { params });
    }

    RemoveShippingAddress(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlRemoveShippingAddress, { params });
    }

    GetUserShippingAdress(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetUserShippingAdress, { params }).pipe(map((p: any) => p.Data));
    }

    GetUserFacturationAdress(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetUserFacturationAdress, { params }).pipe(map((p: any) => p.Data));
    }

    CreateOrUpdateAdress(criteria): Observable<any> {
        return this.http.post(this.apiUrlCreateOrUpdateAdress, criteria);
    }

    GetAddressById(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetAddressById, { params }).pipe(map((p: any) => p.Data));
    }


    GetUserById(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetUserById, { params });
    }

    UpdateUserInfo(criteria): Observable<any> {
        return this.http.post(this.apiUrlUpdateUserInfo, criteria);
    }

    UpdatePassword(criteria): Observable<any> {
        return this.http.post(this.apiUrlUpdatePassword, criteria);
    }

}
