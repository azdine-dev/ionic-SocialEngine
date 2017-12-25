import {Injectable} from "@angular/core";
import {POSTS} from "./mock-posts";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize} from "rxjs/operators";

let feedUrl = 'intaliq.novway.com/api/v1/activities';
let likeUrl = 'intaliq.novway.com/api/v1/core/likes';
let composePhotoUrl ='intaliq.novway.com/api/v1/albums/compose_upload';
let param = '?';
let param_delimiter = '&';
@Injectable()
export class PostService {
  private posts: any;
  private accessToken = localStorage.getItem('token');
  private fields = 'owner,id,content,attachments,timestamp,is_liked,can_like,total_like,user_liked,' +
    'can_comment,total_comment,comments,can_delete,can_share,type ';

  constructor(public http : HttpClient) {
    this.posts = POSTS;
  }
  getAll() {
    return this.posts;
  }

  getItem(id) {
    for (var i = 0; i < this.posts.length; i++) {
      if (this.posts[i].id === parseInt(id)) {
        return this.posts[i];
      }
    }
    return null;
  }
  getAllFeed(){
    return new Promise((resolve, reject )=>{


      this.http.get(feedUrl+param+'access_token='+this.accessToken+param_delimiter+'fields='+this.fields)
        .subscribe( res =>{
          resolve(res);
          console.log(res);
        }, (err)=>{
          reject(err);
        });


    });

  }
  likePost(item_id,item_type){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post(likeUrl+param+'access_token='+this.accessToken+param_delimiter+'item_id='+item_id+param_delimiter+
        'item_type='+item_type,headers).subscribe(res=>{
          resolve(res);
      },err =>{
          reject(err);
      })

    });
  }
  unlikePost(item_id,item_type) {
    return new Promise((resolve, reject) => {

      this.http.delete(likeUrl + param + 'access_token=' + this.accessToken + param_delimiter + 'item_id=' + item_id + param_delimiter +
        'item_type=' + item_type).subscribe(res => {
          resolve(res);
      }, err => {
          reject(err);
      })

    });
  }
  deletePost(post){
    return new Promise((resolve,reject)=>{
       this.http.delete(feedUrl+'/'+post.id+param + 'access_token=' + this.accessToken).subscribe(res =>{
         resolve(res);
       },err =>{
         reject(err);
       });
    })
  }
  postNewActivity(postBody){

    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      this.http.post(feedUrl+param+'access_token='+this.accessToken+param_delimiter+'body='+postBody.body
        ,{headers}).subscribe(res=>{
          resolve(res);
      },err =>{
          reject(err);
        })

    });
  }

    composeUpload(formData : FormData){
      return new Promise((resolve,reject)=>{
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        this.http.post(composePhotoUrl+param+'access_token='+this.accessToken
          ,formData).subscribe(ok =>console.log(ok),
          err=>{
            console.log(JSON.stringify(err));
          });

      });
    }

  remove(item) {
    this.posts.splice(this.posts.indexOf(item), 1);
  }

}
