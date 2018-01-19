import { Component } from '@angular/core';
import {
  AlertController, Events, IonicPage, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {UserService} from "../../services/user-service";

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  private friends : Array<any> ;
  private friendState ={
    state : '',
    message : ''
  }
  private user;
  private defaultIcon ='';
  private defaultColor ='';

  constructor(public navCtrl: NavController, public navParams: NavParams,public userService : UserService,
              public alertCtrl : AlertController,public loadingCtrl : LoadingController,public toastCtrl:ToastController,
            public events :Events) {

    this.user = navParams.get('owner');
    this.getUserFriends(this.user.id);
    this.updateFriendsStatus();
  }

   getUserFriends(userId){
      this.userService.getUserFriends(this.user.id).then(res=>{
        this.friends = res['data'];
      })
  }
  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }

   sendFriendRequest(contact){
    let load = this.showLoader('demande en cours..');
    load.present();
    this.userService.sendFriendRequest(contact.id).then(data=>{
      load.dismiss();
      this.presentToast(data['data'].message);
      contact.friend_status ='is_sent_request';
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
   }

   cancelFriendRequest(contact){
     let load = this.showLoader('annulation en cours..');
     load.present();
    this.userService.cancelFriendRequest(contact.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message);
      contact.friend_status = 'not_friend';
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
   }

   approuveFriendsRequest(contact){
     let load = this.showLoader('approuver la demande..');
     load.present();
     this.userService.approuveFriendRequest(contact.id).then(res=>{
       load.dismiss();
       this.presentToast(res['data'].message);
       contact.friend_status = 'is_friend';
     },err=>{
       load.dismiss();
       this.presentToast(err.error.data.message);
     })
   }

   removeFromFriendsList(contact){
     let load = this.showLoader('retirer de la liste des amis');
     load.present();
     this.userService.removeFromFriendsList(contact.id).then(res=>{
       load.dismiss();
       this.presentToast(res['data'].message);
       contact.friend_status = 'not_friend';
     },err=>{
       load.dismiss();
       this.presentToast(err.error.data.message);
     })
   }

   getFriendState(contact){
     if(contact.friend_status =='not_friend'){
       return 'ajouter comme contact';
     }
     else if(contact.friend_status =='is_sent_request'){
       return 'annuler la demande de connection';
     }
     else if(contact.friend_status =='is_friend'){
       return 'retirer de la liste des amis'
     }
     else{
       return 'approuver la  demande de connection';
     }
   }

  joinMember(contact){
       switch (contact.friend_status){
         case 'not_friend':{
              this.showFriendsDialog('ajouter comme contact',contact,'sendFriendRequest');
              break;
         }
         case 'is_sent_request_by':{
           this.showFriendsDialog('approuver demande de connectiont',contact,'approuveFriendsRequest');
           break;
         }
         case 'is_friend':{
           this.showFriendsDialog('retirer de la liste des amis',contact,'removeFromFriendsList');
           break;
         }
         case 'is_sent_request':{
           this.showFriendsDialog('annuler la demande de connection',contact,'cancelFriendRequest');
           break;
         }
       }
  }
  showFriendsDialog(message,contact,handler){
    let confirmDelActivity = this.alertCtrl.create({

      message: message,
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.getHandler(handler,contact);
          }
        }
      ]
    });

    confirmDelActivity.present();
  }



  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }


    getHandler(handler,param){
     if(this[handler]){
       this[handler](param);
     }
   }

   updateFriendsStatus(){
     this.events.subscribe('new-state',()=>{
       this.getUserFriends(this.user.id);
     })
   }
}
