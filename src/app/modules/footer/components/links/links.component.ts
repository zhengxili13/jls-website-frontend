import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/login.service';
import { ExportService } from 'src/app/shared/api/export.service';
import { Link } from '../../../../shared/interfaces/link';

@Component({
    selector: 'app-footer-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss']
})
export class LinksComponent {
    @Input() header: string;
    @Input() links: Link[] = [];

    constructor(public exportService: ExportService, public datePipe: DatePipe, public translateService: TranslateService, public loginService: LoginService,
        private toastr: ToastrService) { }
    private searchCriteria = {
        MainCategoryReferenceId: 0,
        SecondCategoryReferenceId: [],
        Validity: true,
        ProductLabel: '',
        begin: 0,
        step: 10,
        Lang: ''
    };

    export() {
        var criteria = this.searchCriteria;
        criteria.Lang = localStorage.getItem('lang');
        this.exportService.ExportAction(
            {
                ExportType: "AdvancedProductSearchByCriteria",
                Criteria: criteria,
                Lang: localStorage.getItem('lang')
            }
        ).subscribe(result => {
            var DatetimeFormat = this.datePipe.transform(Date.now(), 'yyyy-MM-dd_HHmmss');
            this.SaveExcel(result, 'Products_' + DatetimeFormat);
        },
            error => {
                this.toastr.error(this.translateService.instant("Msg_Error"));
            });
    }

    SaveExcel(data: Blob, name: string) {
        const a = document.createElement('a');
        // tslint:disable-next-line: quotemark
        // tslint:disable-next-line: object-literal-key-quotes
        const blob = new Blob([data], { 'type': 'application/vnd.ms-excel' });
        a.href = URL.createObjectURL(blob);
        a.download = name + '.xlsx';
        a.click();
    }
}
