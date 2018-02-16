import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AttachementClass} from "../Data/attachement.interface";

let messageFields = 'id,title,body,participant,date,read,attachment,from,conversation';
let messageDetailsFields='id,title,body,participant,recipients,attachment,from,conversation,date,read,messages,can_reply';
let messageUrl ='intaliq.novway.com/api/v1/messages/';

@Injectable()
export class MessageService {
  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token') + '&refresh_token=' + this.refrechToken;

  constructor(public http :HttpClient){
  }

  getInbox(page?,limit?){
    return new Promise((resolve,reject)=>{
      this.http.get(messageUrl+'inbox'+'?access_token='+this.accessToken+'&page='+page+'&limit='+limit+'&fields='+messageFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getOutbox(page?,limit?){
    return new Promise((resolve,reject)=>{
      this.http.get(messageUrl+'outbox'+'?access_token='+this.accessToken+'&page='+page+'&limit='+limit+'&fields='+messageFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  searchMessage(keyword,page?,limit?){
    return new Promise((resolve,reject)=>{
      this.http.get(messageUrl+'search'+'?access_token='+this.accessToken+'&keywords='+keyword+'&page='+page+'&limit='+limit+'&fields='+messageFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getMessageDetail(messageId){
    return new Promise((resolve,reject)=>{
      this.http.get(messageUrl+messageId+'?access_token='+this.accessToken+'&fields='+messageDetailsFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  createMessage(messageData){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(messageUrl +'?access_token=' +this.accessToken+'&to='+messageData.to+'&title='+messageData.title+'&body='+messageData.body

        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }

  deleteMessage(ids){
    return new Promise((resolve, reject) => {
      this.http.delete(messageUrl +'?access_token=' +this.accessToken+'&ids='+ids).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }

  sendMessageReply(messageData,messageId){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(messageUrl +'reply'+'?access_token=' +this.accessToken+'&id='+messageId+'&body='+messageData.body

        , {headers}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }




  sendNewMessage(messageData,withAttachment : boolean){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      if(withAttachment){

      }else {

        this.http.post(messageUrl +'?access_token=' +this.accessToken+'&to='+messageData.toUser+'&title='+messageData.title+'&body='+messageData.body

          , {headers}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
      }
    },);

  }

}
