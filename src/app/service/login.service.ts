import { Product } from 'src/app/interfaces/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RequestServiceService } from './request.service';
import jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn = false;
  constructor(private requestService: RequestServiceService, private http: HttpClient) { }

  login(email: string, password: string) {
    // make request with body with form data
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return this.http.post<{ message: string, jwt: string }>(this.requestService.url + 'login', formData).pipe(map((data: { message: string, jwt: string }) => {
      if (data.message === 'User login successfully') {
        this.loggedIn = true;
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('expiry', (jwt_decode(data.jwt) as { exp: string }).exp);
      }
      return data.message;
    }));
  }
  getUser(): User {
    var user = localStorage.getItem('jwt');
    if (user === null) {
      // return null object
      return { email: '', iat: 0, exp: 0, firstName: '', surname: '', admin: false };
    }
    console.log(jwt_decode(user));

    return jwt_decode(user);
  }
  isUserAdmin(): boolean {
    return this.getUser().admin;
  }
  getExpiration() {
    const expiration = localStorage.getItem('expiry');
    if (expiration !== null) {
      return parseInt(expiration);
    }
    return 0;
  }

  isLoggedIn() {
    if (this.getExpiration() === null) {
      return false;
    }
    if (new Date().getTime() / 1000 > this.getExpiration()) {
      this.disconnect();
    }
    return new Date().getTime() / 1000 < this.getExpiration();
  }
  disconnect() {
    this.loggedIn = false;
    localStorage.removeItem('jwt');
    localStorage.removeItem('expiry');

  }


  getMissingProduct() {
    return this.http.get<Product[]>(this.requestService.url + 'getMissingProducts').pipe(map((data: Product[]) => {
      return data;
    }));
  }
}
