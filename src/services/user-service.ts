import {Injectable} from "@angular/core";
import {USERS} from "./mock-users";
import {HttpClient} from "@angular/common/http";

let membersUrl = 'intaliq.novway.com/api/v1/users/';
let param = '?';
let param_delimiter = '&';
let userInfoFields ='id,title,about_me,aim,birthdate,block_status,can_comment,can_send_message,can_view,' +
  'email,facebook,first_name,friend_status,gender_label,imgs,last_name,locale,locale_label,timezone,' +
  'timezone_label,total_friend,total_mutual_friend,total_photo,twitter ,username,website';

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

  getAuthorizedUser(){
     return new Promise((resolve,reject)=>{
       this.http.get(membersUrl+'me'+param+'access_token='+this.accessToken).subscribe(res=>{
         resolve(res);

       },err=>{
         reject(err);
       })
     });
  }

  getUserInfo(userId){
    return new Promise((resolve,reject)=>{
      this.http.get(membersUrl+userId+param+'access_token='+this.accessToken+'&fields='+userInfoFields).subscribe(res=>{
        resolve(res);

      },err=>{
        reject(err);
      })
    });
  }
}
