import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {VideoService} from "../../services/video-service";
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from "../../services/user-service";
import {ShareModalPage} from "../share-modal/share-modal";
import {VideoViewPage} from "../video-view/video-view";
import {VideoModalPage} from "../video-modal/video-modal";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";

/**
 * Generated class for the MediathequePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mediatheque',
  templateUrl: 'mediatheque.html',
})
export class MediathequePage {
  private videos : Array<{}>;
  private showIframe = false;
  private pageVideoNumber = 1;
  private videoLimit=5;
  private lastPage = false;
  searching :any = false;
  searchControl :FormControl;

  searchTerm: string = '';



  constructor(public navParams: NavParams, public userService: UserService,private navCtrl :NavController,
              public postService: PostService,public videoService : VideoService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events,) {
    this.searchControl = new FormControl();

    this.listenToActivities()
  }

  ionViewDidLoad(){
    this.getVideos();
    this.searchControl.valueChanges.pipe(
      debounceTime(700)
    ).subscribe(search=>{
      this.getVideos();
    })
  }

  getVideos(){
    this.searching = true;
    this.videoService.getAllVideos(this.searchTerm,this.pageVideoNumber,this.videoLimit).then(data=>{
      this.searching = false;
      this.videos =data['data'];
      this.assignClickedValues(this.videos);

      console.log(data,'USER-VIDEOS');
    },err=>{
      console.log(err)
    })
  }

  trustResourceUrl(video){
    return this.sanitizer.bypassSecurityTrustResourceUrl(video.video_src);
  }
  playVideo(video){
    video.clicked=true;
    this.stopOtherVideos(video);

  }

  assignClickedValues(array :Array<{}>){
    for(let item of array){
      Object.assign(item,{
        clicked :false,
      })
    }
  }
  stopOtherVideos(exceptVideo){
    let index = this.videos.indexOf(exceptVideo,0);
    for(let i=0;i<this.videos.length;i++){
      if(i!=index){
        this.videos[i]['clicked'] =false;
      }
    }
  }

  loadVideos(refrecher) {
    if(!this.lastPage){
      let page = this.pageVideoNumber+1;
      this.videoService.getAllVideos(this.searchTerm,page,this.videoLimit).then(res=>{
        if(res['data'].length >0){
          let length = res['data'].length;
          console.log(length,'LENGTH VIDEOS');
          this.videos=this.videos.concat(res['data']);
          this.pageVideoNumber = this.pageVideoNumber+1;
          if(length<this.videoLimit){
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

  shareVideo(video){
    let cmntModal = this.modalCtrl.create(ShareModalPage,{
      item : video,
      type : 'video',
    });
    cmntModal.present();
  }

  toggleLike(video) {
    // if user liked
    if(video.is_liked) {
      this.unLikeVideo(video);

    } else {
      this.likeVideo(video);
    }
    video.is_liked = !video.is_liked
  }
  unLikeVideo(video){
    video.total_like -- ;
    this.postService.unlikePost(video.id,'video').then((result)=>{
    },(err)=>{
    });
  }
  likeVideo(video){
    video.total_like ++ ;
    this.postService.likePost(video.id,'video').then((result)=>{
    },(err)=>{

    });
  }

  goToVideoDetails(video){
    this.navCtrl.push(VideoViewPage,{
      video : video,
    })
  }

  listenToActivities(){
    this.events.subscribe('video-deleted',(video)=>{
      this.getVideos();
    })
  }
  createYoutubeVideo(){
    this.navCtrl.push(VideoModalPage,{
      withNavbar : true,
      videoType:'youtube',
    });
  }
  createVimeoVideo(){
    this.navCtrl.push(VideoModalPage,{
      withNavbar : true,
      videoType:'vimeo',
    });
  }



}
