import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {VideoService} from "../../services/video-service";

/**
 * Generated class for the VideoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video-modal',
  templateUrl: 'video-modal.html',
})
export class VideoModalPage {
  private videoData = {
    source : 'youtube',
    url :'',
    title :'',
    tags :'',
    description :'',
    auth_view :'',
    auth_comment :''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public videoService : VideoService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoModalPage');
  }
  test(){
   setTimeout(()=>{
     this.composeUploadVideo(this.videoData.source,this.videoData.url);
   })
  }

  composeUploadVideo(video_type,video_url){
     this.videoService.composeUploadVideo(video_type,video_url).then(res=>{
       console.log(res,'CMVIDEO');

     },err=>{
       console.log(err,'ERRVIDEO');
     })
  }
}
