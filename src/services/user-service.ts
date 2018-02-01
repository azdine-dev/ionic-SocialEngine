import {forwardRef, Inject, Injectable} from "@angular/core";
import {USERS} from "./mock-users";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileTransfer} from "@ionic-native/file-transfer";
import {ComposeUploadService} from "./compose-upload";

let membersUrl = 'intaliq.novway.com/api/v1/users/';
let param = '?';
let param_delimiter = '&';
let userInfoFields ='id,title,about_me,aim,birthdate,block_status,can_comment,can_send_message,can_view,' +
  'email,facebook,first_name,friend_status,gender_label,imgs,last_name,locale,locale_label,timezone,' +
  'timezone_label,total_friend,total_mutual_friend,total_photo,twitter,username,website';
let refrechToken = localStorage.getItem('refresh_token');
let accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;

@Injectable()
export class UserService {
  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;
  private users;
  private composeUploadData;

  constructor(public http: HttpClient,public composeUploadService : ComposeUploadService) {
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

  getAllMembers(keyword,limit?,page?) {
    return new Promise((resolve, reject) => {

      this.http.get(membersUrl + param + 'access_token=' + this.accessToken+'&keywords='+keyword+'&fields='+userInfoFields+'&limit='+limit+'&page='+page)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });


    });

  }

  getAuthorizedUser() {
    return new Promise((resolve, reject) => {
      this.http.get(membersUrl + 'me' + param + 'access_token=' + this.accessToken + '&fields=' + userInfoFields).subscribe(res => {
        resolve(res);

      }, err => {
        reject(err);
      })
    });
  }

  getUserInfo(userId) {
    return new Promise((resolve, reject) => {
      this.http.get(membersUrl + userId + param + 'access_token=' + this.accessToken + '&fields=' + userInfoFields).subscribe(res => {
        resolve(res);

      }, err => {
        reject(err);
      })
    });
  }

  unBlockUsesr(userId) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.delete(membersUrl + 'block/'+userId + param + 'access_token=' + this.accessToken
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }

  blockUsesr(userId) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(membersUrl + 'block' + param + 'access_token=' + this.accessToken + '&id=' + userId
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }


  makeProfilePicture(photoId) {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(membersUrl + 'me/external_photo' + param + 'access_token=' + this.accessToken + '&photo_id=' + photoId
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });

  }
  updateProfilePicture(imageData){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return new Promise((resolve,reject)=>{
      this.composeUploadService.composeUploadPhoto(imageData).then(res=> {
        this.composeUploadData = JSON.parse(res['response']);
        console.log(this.composeUploadData,'HHHHHHHH');
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
      });
  }

  getUserFriends(userId){
    return new Promise((resolve, reject) => {
      this.http.get(membersUrl + userId + '/friends'+param + 'access_token=' + this.accessToken + '&fields=' + userInfoFields).subscribe(res => {
        resolve(res);

      }, err => {
        reject(err);
      })
    });
  }

  sendFriendRequest(userId){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(membersUrl + 'friends' + param + 'access_token=' + this.accessToken + '&user_id=' + userId
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }
   cancelFriendRequest(userId){
     return new Promise((resolve, reject) => {
       let headers = new HttpHeaders();
       headers.append('Content-Type', 'multipart/form-data');
       this.http.post(membersUrl + 'friends_cancel' + param + 'access_token=' + this.accessToken + '&user_id=' + userId
         , {headers}).subscribe(data => {
         resolve(data);
       }, err => {
         reject(err);
       })
     });
   }
  removeFromFriendsList(userId){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.delete(membersUrl +'friends'+ param + 'access_token=' + this.accessToken+'&user_id=' + userId
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }
  approuveFriendRequest(userId){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(membersUrl + 'friends_confirm' + param + 'access_token=' + this.accessToken + '&user_id=' + userId
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }

  ignoreFriendRequest(userId){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(membersUrl + 'friends_ignore' + param + 'access_token=' + this.accessToken + '&user_id=' + userId
        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }

  filterUsers(keyword){
    return new Promise((resolve, reject) => {
      this.http.get(membersUrl +param + 'access_token=' + this.accessToken + '&keywords='+keyword+'&fields=' + userInfoFields).subscribe(res => {
        resolve(res);

      }, err => {
        reject(err);
      })
    });
  }
}


