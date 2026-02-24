import { Component } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { MessageService } from 'src/app/shared/api/message.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contact-us',
    templateUrl: './page-contact-us.component.html',
    styleUrls: ['./page-contact-us.component.scss']
})
export class PageContactUsComponent {

    public MessageForm: FormGroup;
    public loading: boolean = false;
    public showErrorMessage: boolean = false;
    constructor(
        public storeService: StoreService,
        public messageService: MessageService,
        public formBuilder: FormBuilder,
        public translateService: TranslateService,
        private toastr: ToastrService
    ) {
        this.MessageForm = this.formBuilder.group({
            Name: [''],
            Email: ['', Validators.required],
            Title: ['', Validators.required],
            Body: ['']
        });

        this.MessageForm.valueChanges.subscribe(p => {
            if (this.MessageForm.invalid) {
                this.showErrorMessage = true;
            }
            else {
                this.showErrorMessage = false;
            }
        })
    }

    submitMessage() {
        if (this.MessageForm.invalid) {
            this.showErrorMessage = true;
            return;
        }
        this.loading = false;
        this.messageService.GetReferenceItemsByCategoryLabels({
            Message: {
                SenderName: this.MessageForm.value['Name'],
                SenderEmail: this.MessageForm.value['Email'],
                Title: this.MessageForm.value['Title'],
                Body: this.MessageForm.value['Body'],
            }
        }).subscribe(p => {
            if (p > 0) {
                this.toastr.success(this.translateService.instant("Msg_SaveSuccess"));
            }
            else {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            }
            this.loading = false;
        },
            error => {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            })
    }
}
