import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  AlertController, Events, IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController, ViewController
} from 'ionic-angular';
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";
import {VideoService} from "../../services/video-service";
import {UserService} from "../../services/user-service";
import {EventService} from "../../services/event-service";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {UserPage} from "../user/user";
import {GroupService} from "../../services/group-service";

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  @ViewChild("iframe", {read: ElementRef}) iframe: ElementRef;
  private ready =false;
  private canInviteFriends :Array<any>;
  peopleToInvite : Array<any>;
  private type  :any;
  private eventId :any;
  private groupId:any;
  private imageSrc ='assets/img/adam.jpg';

  private searching :any;

  constructor(public navParams: NavParams, public userService: UserService,public navCtrl : NavController,
              public postService: PostService,public eventService : EventService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events,private toastCtrl :ToastController,
              private groupService:GroupService,private loadingCtrl :LoadingController,private viewCtrl :ViewController) {

   this.eventId = this.navParams.get('eventId');
   this.groupId = this.navParams.get('groupId');
   this.type = this.navParams.get('type');
   console.log(this.type+this.eventId+this.groupId,'TYPPPZEAZE');
   this.peopleToInvite = new Array<any>();
   this.canInviteFriends = new Array<any>();
  }
  ionViewDidLoad(){
     if(this.type=='event'){
       this.getCanInviteFriendsToEvent();
     }
    else if(this.type='group'){
       this.getCanInviteFriendsToGroup();
     }
  }


  getCanInviteFriendsToEvent(){
    this.searching = true;
    console.log(this.eventId,'lweeeeezza')
     this.eventService.getCanInviteFriends(this.eventId).then(res=>{
       this.searching=false;
       this.canInviteFriends = res['data'];
     },err=>{
       this.searching = false;
     })
  }

  getCanInviteFriendsToGroup(){
    this.searching = true;
    this.groupService.getGroupCanInviteFriends(this.groupId).then(res=>{
      this.canInviteFriends = res['data'];
      this.searching = false;
    },err=>{
      this.searching = false;
    })
  }

  listenToFriendshipEvents(){

  }

  getUserIds(){
    console.log(this.peopleToInvite,'pzeppze');
    let userIds='';
    for(let i=0;i<this.peopleToInvite.length;i++){
      if(i==this.peopleToInvite.length-1){
        userIds+=this.peopleToInvite[i];
      }else {
        userIds+=this.peopleToInvite[i]+',';
      }
    }
    return userIds;
  }

  inviteFriends() {
    let userIds = this.getUserIds();
    console.log(userIds,'USERiDS')
    if (this.type == 'group') {
      let load = this.showLoader('Opération en cours');
      load.present();
      this.groupService.inviteFriends(this.groupId, userIds).then(res => {
        load.dismiss();
        let toast = this.presentToast(res['data'].message, 'middle');
        toast.present();
        toast.onDidDismiss(() => {
          // this.events.publish('message-delete');
          this.viewCtrl.dismiss();
          this.viewCtrl.onDidDismiss(() => {
            this.events.publish('invite-friend');
          })
        })
      }, err => {
        load.dismiss();
        let toast = this.presentToast(err.error.data.message);
        toast.present();
      })

    } else if (this.type == 'event') {
      let load = this.showLoader('Opération en cours');
      load.present();
      this.eventService.inviteFriends(this.eventId, userIds).then(res => {
        load.dismiss();
        let toast = this.presentToast(res['data'].message, 'middle');
        toast.present();
        toast.onDidDismiss(() => {
          // this.events.publish('message-delete');
          this.viewCtrl.dismiss();
          this.viewCtrl.onDidDismiss(() => {
            this.events.publish('invite-friend');
          })
        })
      }, err => {
        load.dismiss();
        let toast = this.presentToast(err.error.data.message);
        toast.present();
      })
    }

  }

  viewUser(user) {
    this.navCtrl.push(UserPage, {ownerId: user.id})
  }

  selectItem(e:any,contact){
     console.log(this.peopleToInvite);
    if(e.checked){
      this.peopleToInvite.push(contact.id);

    }else {
      let index =this.peopleToInvite.indexOf(contact.id);
      console.log(index,'INDEX');
      if(index >-1){
        this.peopleToInvite.splice(index,1);
      }

    }
  }

  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: position,
      dismissOnPageChange: true
    });
    return toast;
  }

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }
}
