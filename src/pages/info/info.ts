import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";
import {VideoService} from "../../services/video-service";
import {UserService} from "../../services/user-service";
import {EventService} from "../../services/event-service";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";

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
  private canSendMessageUser :Array<any>
  private type :any;
  private imageSrc ='assets/img/adam.jpg';
  private searchTerm: string = '';
  searchControl :FormControl;
  private pageNumber = 1;
  private pageLimit =10;

  constructor(public navParams: NavParams, public userService: UserService,
              public postService: PostService,public eventService : EventService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events) {

   this.searchControl = new FormControl();
   this.type = this.navParams.get('type');
   // this.initCall(this.type);

  }
  ionViewDidLoad(){
    this.getCanSendMessages();
    this.searchControl.valueChanges.pipe(
      debounceTime(700)
    ).subscribe(search=>{
      this.getCanSendMessages();
    })
  }
  initCall(type){
   if(type=='event'){
   }
   if(type=='message'){

   }
  }



  getCanSendMessages(){
    this.userService.getAllMembers(this.searchTerm,this.pageLimit,this.pageNumber).then(res=>{
      this.canSendMessageUser = res['data'];
    },err=>{

    })
  }
}
