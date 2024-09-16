import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ADMIN_TOKEN_KEY = 'admin-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public admintoken:string
  constructor() {}

  public getAdminToken(){
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }
  public saveAdminToken(token: string): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public logOut(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('first_time_refresh');
  }
}
