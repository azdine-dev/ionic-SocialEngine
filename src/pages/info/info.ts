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
  private imageSrc ='assets/img/adam.jpg';
  private pageVideoNumber = 1;
  private videoLimit=5;
  private lastPage = false;


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
    this.videoService.getUserVideos(userId,this.pageVideoNumber,this.videoLimit).then(data=>{
      this.userVideos =data['data'];
      this.assignClickedValues(this.userVideos);

      console.log(data,'USER-VIDEOS');
    },err=>{
      console.log(err)
    })
  }

  trustResourceUrl(src){
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }
 playVideo(video){
 video.clicked=true;
 this.stopOtherVideos(video);

  }
 iframeShow(){
    return (this.iframe.nativeElement.attributes['clicked'].value);
 }

 assignClickedValues(array :Array<{}>){
  for(let item of array){
    Object.assign(item,{
        clicked :false,
    })
  }
 }
 stopOtherVideos(exceptVideo){
    let index = this.userVideos.indexOf(exceptVideo,0);
    console.log(index,'INDEEEX');
    for(let i=0;i<this.userVideos.length;i++){
      if(i!=index){
        this.userVideos[i]['clicked'] =false;
      }
    }
 }

  loadVideos(refrecher) {
    if(!this.lastPage){
      let page = this.pageVideoNumber+1;
      this.videoService.getUserVideos(this.userId,page).then(res=>{
        if(res['data'].length >0){
          let length = res['data'].length;
          this.userVideos=this.userVideos.concat(res['data']);
          this.pageVideoNumber = this.pageVideoNumber+1;
          if(length<this.videoLimit){
            this.lastPage=true;
            console.log('LASSST PAGE');
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
}
