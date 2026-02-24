import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router) {
  }

  canActivate(): boolean {
    const token = localStorage.getItem('jwt');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token || !refreshToken) {
      this.router.navigate(['account/login']);
      return false;
    }

    return true;
  }
}
