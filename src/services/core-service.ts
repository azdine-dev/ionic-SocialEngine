import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

let coreUrl ='intaliq.novway.com/api/v1/core/'

@Injectable()
export class CoreService {

  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token') + '&refresh_token=' + this.refrechToken;

  constructor(public http: HttpClient) {

  }

  reportItem(item_type,item_id){

  }

  /*********Comments****************/

  getComments(item_type,item_id){
    return new Promise((resolve, reject) => {
      this.http.get(coreUrl +'comments'+ '?access_token=' + this.accessToken + '&item_type='+item_type+'&item_id=' + item_id).subscribe(res => {
        resolve(res);

      }, err => {
        reject(err);
      })
    });
  }

  likeComment(item_type,item_id,comment_id){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(coreUrl+'likes'+'?access_token='+this.accessToken+'&item_id='+item_id+
        '&item_type='+item_type+'&comment_id='+comment_id,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  unlikeComment(item_type,item_id,comment_id){
    return new Promise((resolve,reject)=>{
      this.http.delete(coreUrl+'likes'+'?access_token='+this.accessToken+'&item_id='+item_id+
        '&item_type='+item_type+'&comment_id='+comment_id).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  postComment(item_type,item_id,body){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(coreUrl+'comments'+'?access_token='+this.accessToken+'&item_id='+item_id+
        '&item_type='+item_type+'&body='+body,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }
}
