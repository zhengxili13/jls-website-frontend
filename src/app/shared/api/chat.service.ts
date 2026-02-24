import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
declare const Configuration: any;

@Injectable()
export class ChatService {
    public host: string = Configuration.SERVER_API_URL;

    private apiUrlMessageHub = this.host + 'MessageHub'
    private apiUrlGetNoReadedDialogClient = this.host + 'api/User/GetNoReadedDialogClient';
    private apiUrlGetChatDialog = this.host + 'api/User/GetChatDialog';
    private apiUrlUpdateReadedDialog = this.host + 'api/User/UpdateReadedDialog';


    messageReceived = new EventEmitter<Message>();
    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor(private http: HttpClient) {
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    GetNoReadedDialogClient(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetNoReadedDialogClient, { params });
    }

    UpdateReadedDialog(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlUpdateReadedDialog, { params });
    }

    GetChatDialog(criteria): Observable<any> {
        let params = new HttpParams({ fromObject: criteria });
        return this.http.get(this.apiUrlGetChatDialog, { params });
    }

    sendMessage(message: Message) {
        this._hubConnection.invoke('NewMessage', message);
    }

    private createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(this.apiUrlMessageHub)
            .build();
    }

    private startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                setTimeout(function () { this.startConnection(); }, 5000);
            });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('MessageReceived', (data: any) => {
            var uniqueID = parseInt(localStorage.getItem('userId'));
            if (data.clientuniqueid !== uniqueID && data.toUser == uniqueID) {
                this.messageReceived.emit(data);
            }

        });
    }
}    