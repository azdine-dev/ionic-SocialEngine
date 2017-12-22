import {Injectable} from "@angular/core";
import {USERS} from "./mock-users";
import {HttpClient} from "@angular/common/http";

let membersUrl = 'intaliq.novway.com/api/v1/users';
let param = '?';
let param_delimiter = '&';

@Injectable()
export class UserService {
  private accessToken = localStorage.getItem('token');
  private users;

  constructor(public http : HttpClient) {
    this.users = USERS;
  }
  getAll() {
    return this.users;
  }

  getItem(id) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id === parseInt(id)) {
        return this.users[i];
      }
    }
    return null;
  }

  remove(item) {
    this.users.splice(this.users.indexOf(item), 1);
  }

  getAllMembers(){
    return new Promise((resolve, reject )=>{

      this.http.get(membersUrl+param+'access_token='+this.accessToken)
        .subscribe( res =>{
          resolve(res);
          console.log(res);
        }, (err)=>{
          reject(err);
        });


    });

  }
}
