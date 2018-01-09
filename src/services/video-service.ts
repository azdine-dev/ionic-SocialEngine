import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

let videoUrl = 'intaliq.novway.com/api/v1/videos/';
let fields = 'id,title,description,duration,thumb,owner,date,total_comment,' +
  'total_like,total_view,total_vote,rating,is_rated,status,video_type,video_src,category,tags,can_edit,can_delete,can_embed';
let readVideoFields = 'id,video_type,video_src,description';
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

  getEmbedVideo(video_id){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+video_id+'/embed'+param+'access_token='+this.accessToken).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  postVido(videoData){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post(videoUrl+param+'access_token='+this.accessToken+param_delimiter,headers).subscribe(res=>{
        resolve(res);
      },err =>{
        reject(err);
      })

    });
  }

  composeUploadVideo(video_type,video_url){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post(videoUrl+'compose_upload'+param+'access_token='+this.accessToken+'&type='+video_type+'&uri='+video_url,headers).subscribe(res=>{
        resolve(res);
      },err =>{
        reject(err);
      })

    });
  }
}
