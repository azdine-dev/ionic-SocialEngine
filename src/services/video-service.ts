import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

let videoUrl = 'http://intaliq.novway.com/api/v1/videos/';
let fields = 'id,title,is_liked,can_share,can_comment,can_delete,can_like,description,duration,thumb,owner,date,total_comment,' +
  'total_like,total_view,total_vote,rating,is_rated,status,video_type,video_src,category,tags,can_edit,can_delete,can_embed';
let readVideoFields = 'id,title,description,video_type,video_src,description,thumb,total_like,total_view,total_vote,rating,is_rated,status,';
let param = '?';
let param_delimiter = '&';

@Injectable()
export class VideoService {
  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;
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

  getAllVideos(keywords,userId:string="",page?,limit?){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+param+'access_token='+this.accessToken+'&keywords='+keywords+'&page='+page+'&limit='+limit+
        '&user_id='+userId+'&fields='+fields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  deleteVideo(videoId){
    return new Promise((resolve, reject) => {

      this.http.delete(videoUrl +videoId+ param + 'access_token=' + this.accessToken).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })

    });
  }
  getUserVideos(userId,page,limit:number=5){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+param+'access_token='+this.accessToken+
        '&user_id='+userId+'&page='+page+'&limit='+limit+'&fields='+readVideoFields).subscribe(data=>{
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
  getVideoInformation(video_type,video_url){
    return new Promise((resolve,reject)=>{
      this.http.get(videoUrl+'info'+param+'access_token='+this.accessToken+'&type='+video_type+'&uri='+video_url).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }


  postVideo(videoData){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      this.http.post(videoUrl+param+'access_token='+this.accessToken+'&title='+videoData.title+'&type='+videoData.type+
        '&url='+videoData.url+'&description='+videoData.description+'&auth_view='+videoData.auth_view
        +'&auth_comment='+videoData.auth_comment, headers).subscribe(res=>{
        resolve(res);
      },err =>{
        reject(err);
      })

    });
  }

  likeVideo(){

  }


}
