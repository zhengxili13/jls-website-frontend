import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/shared/api/chat.service';
import { Message } from 'src/app/shared/models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
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
