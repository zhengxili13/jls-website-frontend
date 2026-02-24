import { Component } from '@angular/core';
import { LoginService } from 'src/app/login.service';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.sass']
})
export class LayoutComponent {
    links: {label: string; url: string, type?: string, params?: any}[] = [
        {label: 'Header.links.Dashboard', url: './dashboard'},
        {label: 'Header.links.EditProfile', url: './profile'},
        {label: 'Header.links.OrderHistory', url: './orders'},
        {label: 'Header.links.AddressBook', url: './addresses'},
        {label: 'Header.links.EditAddress', url: './address' , params:{Type:'facturationAdress'}},
        {label: 'Header.links.ChangePassword', url: './password'},
        {label: 'Logout', url: './login', type:'logout'}
    ];

    constructor(private loginService: LoginService) { }

    logout(){
        this.loginService.logout();
    }
}
