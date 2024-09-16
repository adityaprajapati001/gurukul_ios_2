import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  userdata: any;
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userdata = localStorage.getItem('auth-token')
    if (localStorage.getItem('auth-token')) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}