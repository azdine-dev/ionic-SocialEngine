import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
let notifUrl='intaliq.novway.com/api/v1/notifications/';
let notifFields ='id,content,owner,read,timestamp,type'
@Injectable()
export class NotificationsService {
  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;


  constructor(public http :HttpClient){

  }

  getAllNotification(type,page:number=1,limit:number=10){
    return new Promise((resolve, reject )=>{


      this.http.get(notifUrl+'?access_token='+this.accessToken+'&limit='+limit+'&page='+page+'&type='+type+'&fields='+notifFields)
        .subscribe( res =>{
          resolve(res);
        }, (err)=>{
          reject(err);
        });


    });
  }

  markRead(notifId){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post(notifUrl+'mark_read'+'?access_token='+this.accessToken+
        '&id='+notifId,headers).subscribe(res=>{
        resolve(res);
      },err =>{
        reject(err);
      })

    });
  }

  markAllRead(){

  }

}
