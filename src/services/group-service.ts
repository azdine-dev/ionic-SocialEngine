import {ComposeUploadService} from "./compose-upload";
import {Injectable} from "@angular/core";
import {POSTS} from "./mock-posts";
import {HttpClient, HttpHeaders} from "@angular/common/http";


let groupUrl ='intaliq.novway.com/api/v1/groups/'
let groupFields='id,thumb,title,category,owner,description,staff,total_view,total_member,updated_date,can_edit,' +
  'can_delete,can_request,can_join,can_leave,can_cancel,can_accept,can_reject,can_invite,can_message_members';
let activityUrl ='intaliq.novway.com/api/v1/activities/';
let feedFields = 'owner,id,content,attachments,timestamp,is_liked,can_like,total_like,user_liked,' +
  'can_comment,total_comment,comments,can_delete,can_share,type';

@Injectable()
export class GroupService {


  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;

  constructor(public http : HttpClient) {
  }

  getAllGrroups(keywords,userId:string=''){
    return new Promise((resolve,reject)=>{
      this.http.get(groupUrl+'?access_token='+this.accessToken+'&user_id='+userId+'&keywords='+keywords+'&fields='+groupFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getMyGroups(page?,limit:number=10,keyword:string='',show?){
    return new Promise((resolve,reject)=>{
      this.http.get(groupUrl+'my'+'?access_token='+this.accessToken+'&keywords='+keyword+'&show='+show+'&page='+page+'&limit='+limit+'&fields='+groupFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })

  }


  getGroup(groupId){
    return new Promise((resolve,reject)=>{
      this.http.get(groupUrl+groupId+'?access_token='+this.accessToken+'&fields='+groupFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  deleteGroup(groupId){
    return new Promise((resolve,reject)=>{
      this.http.delete(groupUrl+groupId+'?access_token='+this.accessToken).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }


  getGroupMembers(groupId){

  }

  removeMemberFromGroup(groupId,userId){

  }

  getWaitingMembers(groupId){

  }

  /****************Members management*******************/

  appprouveMember(groupId,userId){

  }
  rejectMember(groupId,userId){

  }

  joinGroup(groupId){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(groupUrl+'join'+'?access_token='+this.accessToken+'&id='+groupId,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  requestMembership(groupId){


  }
  cancelMembersgip(groupId){

  }

  leaveGroup(groupId){
    return new Promise((resolve,reject)=>{
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(groupUrl+'leave'+'?access_token='+this.accessToken+'&id='+groupId,{headers}).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });
  }

  /*****************GFroups Invite****************/

  getGroupCanInviteFriends(groupId){

  }
  inviteFriends(groupId,user_ids){

  }

  /************FEEEED*****************/
  getGroupFeed(groupId){
    return new Promise((resolve,reject)=>{
      this.http.get(activityUrl+'?access_token='+this.accessToken+'&subject_type=group&subject_id='
        +groupId+'&fields='+feedFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
}
