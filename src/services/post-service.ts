import {Injectable} from "@angular/core";
import {POSTS} from "./mock-posts";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize} from "rxjs/operators";
import {AttachementClass} from "../Data/attachement.interface";
import {ComposeUploadService} from "./compose-upload";

let feedUrl = 'intaliq.novway.com/api/v1/activities';
let likeUrl = 'intaliq.novway.com/api/v1/core/likes';
let commentUrl = 'intaliq.novway.com/api/v1/core/comments';
let composePhotoUrl ='intaliq.novway.com/api/v1/albums/compose_upload';
let param = '?';
let param_delimiter = '&';
@Injectable()
export class PostService {
  private posts: any;
  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;
  private fields = 'owner,id,content,attachments,timestamp,is_liked,can_like,total_like,user_liked,' +
    'can_comment,total_comment,comments,can_delete,can_share,type';
  private composeUploadData : any;
  private photoUpload : any;

  constructor(public http : HttpClient, private composeUploadService : ComposeUploadService) {
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
  getAllFeed(limit:number = 10,maxId?){
    return new Promise((resolve, reject )=>{


      this.http.get(feedUrl+param+'access_token='+this.accessToken+'&limit='+limit+'&maxid='+maxId+param_delimiter+'fields='+this.fields)
        .subscribe( res =>{
          resolve(res);
          console.log(res);
        }, (err)=>{
          reject(err);
        });


    });
  }
  getAllFeedV2(){
    return this.http.get(feedUrl+param+'access_token='+this.accessToken+param_delimiter+'fields='+this.fields)
  }

  getUserFeed(userId){
    return new Promise((resolve, reject )=>{


      this.http.get(feedUrl+param+'access_token='+this.accessToken+param_delimiter+'fields='+this.fields+
        '&subject_type=user'+'&subject_id='+userId)
        .subscribe( res =>{
          resolve(res);
          console.log(res);
        }, (err)=>{
          reject(err);
        });


    });
  }
  getFeed(feed_id){
    return new Promise((resolve, reject )=>{


      this.http.get(feedUrl+'/'+feed_id+param+'access_token='+this.accessToken+param_delimiter+'fields='+this.fields)
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
  postNewActivity(postBody,withAttachment : boolean, attachment : AttachementClass,subject_type?,subject_id?){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      if(withAttachment){
         this.composeUploadService.composeUploadPhoto(attachment.Filedata).then(data=>{
           this.composeUploadData = JSON.parse(data['response']);

         }).then(()=> {
             this.http.post(feedUrl + param + 'access_token=' + this.accessToken + param_delimiter + 'body=' + postBody.bodyText
               +param_delimiter+'subject_type='+subject_type+'&subject_id='+subject_id+'&attachment[type]=photo&attachment[photo_id]='
               +this.composeUploadData.data.photo_id,{headers}).subscribe(res=>{
               resolve(res);
             },err=>{
                reject(err);
               })

           }
         )


      }else {

        this.http.post(feedUrl + param + 'access_token=' + this.accessToken + param_delimiter +
          'subject_type='+subject_type+'&subject_id='+subject_id+'&body=' + postBody.bodyText
          , {headers}).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      }
    },);

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

     /****************************************COMMENTAIRES***********************************/

    commentActivity(post,comment){
      return new Promise((resolve,reject)=>{
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        this.http.post(commentUrl+param+'access_token='+this.accessToken+param_delimiter+'item_id='+post.id+
          '&item_type='+post.type+'&body='+comment.body,{headers}).subscribe(data=>{
          resolve(data);
        },err=>{
          reject(err);
        })
      });
    }

    deleteComment(comment,post){
       return new Promise((resolve,reject)=>{
         this.http.delete(commentUrl+param+'access_token='+this.accessToken+param_delimiter+'item_id='+post.id+
           '&item_type='+post.type+'&comment_id='+comment.id).subscribe(data=>{
             resolve(data);
         },err=>{
             reject(err);
         })
       });
    }

    getComents(item_type,item_id){
      return new Promise((resolve, reject )=>{


        this.http.get(commentUrl+param+'access_token='+this.accessToken+param_delimiter+'item_id='+item_id+
        '&item_type='+item_type+'&fields='+this.fields)
          .subscribe( res =>{
            resolve(res);
            console.log(res);
          }, (err)=>{
            reject(err);
          });


      });
    }


  /****************************************SHARING***********************************/

  shareActivity(item_type,item_id,body){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(feedUrl+'/share'+param+'access_token='+this.accessToken+'&item_id='+item_id+
        '&item_type='+item_type+'&body='+body,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  ///////////////////////////////////////////////////////////

  postPhoto(imageData){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');


        this.composeUploadService.uploadPhoto(imageData).then(data=>{
          this.photoUpload = JSON.parse(data['response']);
          console.log((this.photoUpload).data.photo_id);

        }).then(()=> {
            this.http.post(feedUrl + param + 'access_token=' + this.accessToken +
              '&attachment[type]=photo&attachment[photo_id]='+this.photoUpload.data.photo_id,{headers}).subscribe(res=>{

              console.log('POST'+res);
              resolve(res);
            },err=>{
              console.log('ERR'+JSON.stringify(err));
              reject(err);
            })

          }
        )},);
  }
}
