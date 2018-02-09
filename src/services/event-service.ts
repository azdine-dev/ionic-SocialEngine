import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

let eventsUrl = 'intaliq.novway.com/api/v1/events/';
let activityUrl ='intaliq.novway.com/api/v1/activities/';
let eventfields ='id,thumb,title,category,owner,description,RSVPs,date_detail,member_count,location,category,' +
  'host,total_member,can_edit,can_delete,can_request,date,' +
  'can_join,can_leave,can_cancel,can_accept,can_reject,can_invite,can_compose';
let eventPhotoFields = 'id,type,owner,thumb,img,title,description,date,album,photo_index,next_photo,previous_photo,'+
  'can_tag,can_edit,can_delete,can_share,can_report,can_make_profile_photo';
let feedFields = 'owner,id,content,attachments,timestamp,is_liked,can_like,total_like,user_liked,' +
  'can_comment,total_comment,comments,can_delete,can_share,type';

@Injectable()
export class EventService {

  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token') + '&refresh_token=' + this.refrechToken;

  constructor(public http: HttpClient) {

  }

  getEvents(keywords,user_id:string=''){
    return new Promise((resolve,reject)=>{
      this.http.get(eventsUrl+'?access_token='+this.accessToken+'&keywords='+keywords+'&user_id='+user_id+'&fields='+eventfields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  getMyEvents(){
    return new Promise((resolve,reject)=>{
      this.http.get(eventsUrl+'my'+'?access_token='+this.accessToken+'&fields='+eventfields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }


  getUserEvents(userId){
    return new Promise((resolve, reject )=>{


      this.http.get(activityUrl+'?access_token='+this.accessToken+'&fields='+feedFields+
        '&subject_type=event'+'&subject_id='+userId)
        .subscribe( res =>{
          resolve(res);
        }, (err)=>{
          reject(err);
        });


    });
  }


  createEvent(eventData){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      let postEventUrl = eventsUrl+'?access_token='+this.accessToken+'&title='+eventData.title
        +'&start_time='+eventData.start_time+'&end_time='+eventData.end_time+'&allow_search='+eventData.allow_search+'&auth_invite='+eventData.auth_invite
        +'&auth_view='+eventData.auth_view+'&auth_comment='+eventData.auth_comment+'&auth_photo='+eventData.auth_photo+'&approval='+eventData.approval
      if(eventData.categorieId){
        postEventUrl+= '&category_id='+eventData.categorieId;
      }

      this.http.post(postEventUrl,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  getEvent(eventId){
    return new Promise((resolve,reject)=>{
      this.http.get(eventsUrl+eventId+'?access_token='+this.accessToken+'&fields='+eventfields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getEventFeed(eventId){
    return new Promise((resolve,reject)=>{
      this.http.get(activityUrl+'?access_token='+this.accessToken+'&subject_type=event&subject_id='
        +eventId+'&fields='+feedFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  getEventPhotos(eventId){
    return new Promise((resolve,reject)=>{
      this.http.get(eventsUrl+'photos'+'?access_token='+this.accessToken+'&event_id='+eventId+'&fields='+eventPhotoFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  getCanInviteFriends(eventId){
    return new Promise((resolve,reject)=>{
      this.http.get(eventsUrl+'invite'+'?access_token='+this.accessToken+'&id='+eventId).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  joinEvent(eventId,rsvp){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(eventsUrl+'join'+'?access_token='+this.accessToken+'&id='+eventId+'&rsvp='+rsvp,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  leaveEvent(eventId){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(eventsUrl+'leave'+'?access_token='+this.accessToken+'&id='+eventId,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  getEventsCategories(){
    return new Promise((resolve,reject)=>{
      this.http.get(eventsUrl+'categories'+'?access_token='+this.accessToken+'&fields='+feedFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  deleteEvent(eventId){
    return new Promise((resolve,reject)=>{
      this.http.delete(eventsUrl+eventId+'?access_token='+this.accessToken).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  editEvent(){

  }
}
