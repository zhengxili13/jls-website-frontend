import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/api/user.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap, map, first } from 'rxjs/operators';
import { Message } from 'src/app/shared/models/message';
import { ChatService } from 'src/app/shared/api/chat.service';

@Component({
    selector: 'app-chat-page',
    templateUrl: './page-chat.component.html',
    styleUrls: ['./page-chat.component.scss']
})
export class PageChatComponent {
    title = 'ClientApp';
    txtMessage: string = '';
    uniqueID: number;
    messages = new Array<Message>();
    message = new Message();

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private chatService: ChatService, private _ngZone: NgZone) {
        this.subscribeToEvents();
    }
    ngOnInit(): void {
        this.uniqueID = parseInt(localStorage.getItem('userId'));

        this.chatService.GetChatDialog({
            UserId: this.uniqueID
        }).subscribe(result => {
            if (result != null && result.length > 0) {
                result.map(p => {
                    this.messages.push({
                        type: (p.FromUserId == this.uniqueID) ? 'sent' : 'received',
                        date: p.CreatedOn,
                        message: p.Body,
                        clientuniqueid: p.FromUserId
                    });
                });

            }
        })
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    sendMessage(): void {
        if (this.txtMessage) {
            this.message = new Message();
            this.message.clientuniqueid = this.uniqueID;
            this.message.type = "sent";
            this.message.message = this.txtMessage;
            this.message.date = new Date();
            this.message.fromUser = this.uniqueID;
            this.messages.push(this.message);
            this.chatService.sendMessage(this.message);
            this.txtMessage = '';
        }
    }
    private subscribeToEvents(): void {

        this.chatService.messageReceived.subscribe((message: Message) => {
            this._ngZone.run(() => {
                if (message.clientuniqueid !== this.uniqueID && message.toUser == this.uniqueID) {
                    message.type = "received";
                    this.messages.push(message);
                }
            });
        });
    }

}
