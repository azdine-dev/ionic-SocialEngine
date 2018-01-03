import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

let videoUrl = 'intaliq.novway.com/api/v1/videos/';
let fields = 'id,title,description,duration,thumb,owner,date,total_comment,' +
  'total_like,total_view,total_vote,rating,is_rated,status,video_type,video_src,category,tags,can_edit,can_delete,can_embed';
let readVideoFields = 'id,video_type,video_src';
let param = '?';
let param_delimiter = '&';

@Injectable()
export class VideoService {
  private accessToken = localStorage.getItem('token');

  constructor(public http :HttpClient){

  }

  getVideo(video_id){
   return new Promise((resolve,reject)=>{
     this.http.get(videoUrl+video_id+param+'access_token='+this.accessToken+'&fields='+readVideoFields).subscribe(data=>{
       resolve(data);
     },err=>{
       reject(err);
     })
   })
  }

  getAllVideos(){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+param+'access_token='+this.accessToken+'&fields='+readVideoFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  getUserVideos(userId){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+param+'access_token='+this.accessToken+
        '&user_id='+userId+'&fields='+readVideoFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getMyVideos(){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+param+'access_token='+this.accessToken+'&fields='+readVideoFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
}
