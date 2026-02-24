import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router) {

    
  }

  canActivate(){
    var token = localStorage.getItem('jwt');
    var refreshToken = localStorage.getItem('refreshToken');

    if(token==null || refreshToken==null){
      this.router.navigate(['account/login']);
    }
    return token!=null && refreshToken!=null;
}
  
}
