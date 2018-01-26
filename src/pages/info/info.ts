import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";
import {VideoService} from "../../services/video-service";
import {UserService} from "../../services/user-service";

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
  private userVideos : Array<{}>;
  private userId : any;
  private userName : any;
  private showIframe = false;
  private imageSrc ='assets/img/adam.jpg'


  constructor(public navParams: NavParams, public userService: UserService,
              public postService: PostService,public videoService : VideoService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events) {

  this.userId = this.navParams.get('id');
  this.userName =this.navParams.get('name');
  this.getUserVideos(this.userId);
  }
  ionViewDidLoad(){
    setTimeout( ()=>{
       this.ready=false;
    },1000)
  }


  getUserVideos(userId){
    this.videoService.getUserVideos(userId).then(data=>{
      this.userVideos =data['data'];
      console.log(data,'USER-VIDEOS');
    },err=>{
      console.log(err)
    })
  }

  trustResourceUrl(src){
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }
 playVideo(index,iframe,event){
  this.showIframe = true;
 }
 iframeShow(){
    return (this.iframe.nativeElement.attributes['clicked'].value);
 }
}
