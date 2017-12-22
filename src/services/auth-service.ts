import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Headers} from "@angular/http";
import { Injectable } from '@angular/core';

let client_id = 'tmyfu3Hg5nua08I';
let response_type = 'code';
let scope = 'basic';
let apiUrl = 'intaliq.novway.com/api/v1/oauth/token';
  '&client_id='+client_id;



@Injectable()
export class AuthServiceProvider {
  constructor(public http: HttpClient) {

  }
  login(credentials) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');




      this.http.post(apiUrl, (credentials), {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  register(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post(apiUrl+'guest/signup', JSON.stringify(data), {headers: headers})
        .subscribe(res => {
          // resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  logout(){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('X-Auth-Token', localStorage.getItem('token'));

      this.http.post(apiUrl+'logout', {}, {headers: headers})
        .subscribe(res => {
          localStorage.clear();
        }, (err) => {
          reject(err);
        });
    });
  }
}
