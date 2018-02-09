import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {NotificationService} from '../../services/notification-service';
import {NotificationsService} from "../../services/notifications-service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserPage} from "../user/user";
import {UserService} from "../../services/user-service";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {
  public notifications: Array<any>;
  private type :string;
  notifClass ='notif';
  private lastPage =false;
  private pageNotification = 1;
  private limit = 5;

  constructor(public nav: NavController, public notificationService: NotificationsService,private navParams : NavParams
  ,private sanitizer : DomSanitizer,private toastCtrl :ToastController,private loadingCtrl :LoadingController,private userService : UserService) {
  this.type = this.navParams.get('notification_type');
  this.getNotifications();
  }


  getNotifications(){
    this.notificationService.getAllNotification(this.type,this.pageNotification,this.limit).then(res=>{
      this.notifications = res['data'];
    })
  }
  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }
  processHtmlContent(html){
    return this.sanitizer.bypassSecurityTrustHtml(html);

  }
  readNotification(notification){

  if(!notification.read){
    notification.read=true;
    this.notificationService.markRead(notification.id).then(res=>{

      this.viewNotifDetail(notification);
    },err=>{
      this.viewNotifDetail(notification);
    })

  }

  }

  viewNotifDetail(notification){
    console.log(notification.type)
    if(notification.type ==='friend_accepted'){
       this.viewUser(notification.owner)
    }
  }

  viewUser(user) {
    this.nav.push(UserPage, {ownerId: user.id})
  }

  loadNotifications(refrecher) {
    console.log('heyy wez');
    if(!this.lastPage){
      let page = this.pageNotification+1;
      this.notificationService.getAllNotification(this.type,page,this.limit).then(res=>{
        if(res['data'].length >0){
          let length = res['data'].length;
          this.notifications=this.notifications.concat(res['data']);
          this.pageNotification = this.pageNotification+1;
          if(length<this.limit){
            this.lastPage=true;
          }
          refrecher.complete();

        }else{
          this.lastPage=true;
          refrecher.complete();
        }
      },err=>{
        refrecher.complete();
      })
    } else{
      refrecher.complete();
    }

  }

  approuveFriendsRequest(notification){
    let load = this.showLoader('approuver la demande..');
    load.present();
    this.userService.approuveFriendRequest(notification.owner.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message);
      this.removeNotification(notification);
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }

  ignoreFriendRequest(notification){
    let load = this.showLoader('approuver la demande..');
    load.present();
    this.userService.ignoreFriendRequest(notification.owner.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message);
      this.removeNotification(notification);
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }

  removeNotification(notification){
    let index = this.notifications.indexOf(notification);
    if(index > -1){
      this.notifications.splice(index,1);
    }
  }
  //////////////////////////////////////////////////
  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }
}
