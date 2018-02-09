import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";
import {VideoService} from "../../services/video-service";
import {UserService} from "../../services/user-service";
import {EventService} from "../../services/event-service";

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
  private userInvited :Array<any>;
  private userId : any;
  private userName : any;
  private evantId : any;
  private imageSrc ='assets/img/adam.jpg';
  private pageVideoNumber = 1;
  private videoLimit=5;
  private lastPage = false;


  constructor(public navParams: NavParams, public userService: UserService,
              public postService: PostService,public eventService : EventService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events) {

  this.userId = this.navParams.get('id');
  this.userName =this.navParams.get('name');
  this.evantId = this.navParams.get('eventId');
  this.getCanInviteFriends();
  }
  ionViewDidLoad(){
    setTimeout( ()=>{
       this.ready=false;
    },1000)
  }

  getCanInviteFriends(){
    console.log(this.evantId,'IDDDD');
    this.eventService.getCanInviteFriends(this.evantId).then(res=>{
      console.log(res,'USER CAN INVITE');
      this.userInvited =res['data'];
    })
  }

}
