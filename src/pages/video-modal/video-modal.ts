import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {VideoService} from "../../services/video-service";
import {HomePage} from "../home/home";

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
    type : 'youtube',
    url :'',
    title :'',
    tags :'',
    allow_search : 1,
    description :'',
    auth_view :'everyone',
    auth_comment :'everyone',
    error:''

  }
  private withNavbar = false;
  private videoType:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public videoService : VideoService, public toastCtrl : ToastController,public loadingCtrl :  LoadingController,
  public viewCtrl : ViewController) {
    this.withNavbar = this.navParams.get('withNavbar');
    this.videoType = this.navParams.get('videoType');
    if(this.withNavbar){
      this.videoData.type=this.videoType;
    }
  }

  loadVideoInfo(){

      this.getVideoInfo(this.videoData.type,this.videoData.url);


  }

  composeUploadVideo(video_type,video_url){
     this.videoService.composeUploadVideo(video_type,video_url).then(res=>{
       console.log(res,'CMVIDEO');

     },err=>{
       console.log(err,'ERRVIDEO');
     })
  }

  getVideoInfo(video_type,video_url){
    this.videoService.getVideoInformation(video_type,video_url).then(res=>{
      if(video_type =='vimeo'){
        this.videoData.title=res['data'].title['0'];
        this.videoData.description = res['data'].description['0'];
      }else{
        this.videoData.title=res['data'].title;
        this.videoData.description = res['data'].description;
      }


    },err=>{
      this.videoData.error = 'impossible de trouver la video';
      this.videoData.title ='';
      this.videoData.description = '';
    })
  }

  validFields(videoData){
    return (videoData.title && videoData.type && videoData.url  );
  }

  postVideo(videoData){
    this.videoService.postVideo(videoData).then(res=>{
      this.showLoader();
    },err=>{
      console.log(JSON.stringify(err));
      this.presentToast('une erreur survenu');
    })
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

  }
  showLoader(){
    let load = this.loadingCtrl.create({
      content : 'Votre video est publié ...'
    });
    load.present({});

    setTimeout(()=>{
      this.navCtrl.setRoot(HomePage);
    },1000);

    setTimeout(() => {
      load.dismiss();
    }, 1000);
  }
}
