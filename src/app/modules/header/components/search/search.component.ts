import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {

    public searchText: string;
    constructor(public router: Router) { }

    keyEnter(){
        this.router.navigate(['/shop/catalog'],{queryParams: {SearchText: this.searchText}});
    }
}
