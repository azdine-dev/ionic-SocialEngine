import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {VideoService} from "../../services/video-service";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ComposeUploadService} from "../../services/compose-upload";
import {PostService} from "../../services/post-service";

/**
 * Generated class for the PhotoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-photo-modal',
  templateUrl: 'photo-modal.html',
})
export class PhotoModalPage {
  private imgData : any;
  private cameraCheck : boolean;
  private galerieCheck : boolean;

  private cameraTakerOptions : CameraOptions = {
    sourceType : this.camera.PictureSourceType.CAMERA,
    destinationType : this.camera.DestinationType.DATA_URL,
    quality : 100,
    targetWidth : 1024,
    targetHeight : 768,
    encodingType : this.camera.EncodingType.JPEG,
    correctOrientation : true
  };
  private cameraOptions: CameraOptions = {
    sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    quality: 100,
    targetWidth: 1024,
    targetHeight: 768,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public videoService : VideoService, public toastCtrl : ToastController,public loadingCtrl :  LoadingController,
              public viewCtrl : ViewController,private  camera : Camera,public postService : PostService) {
  }



  validFields(videoData){
    return (videoData.title && videoData.type && videoData.url );
  }


  ////////////////////////////////////////////////

  selectPhoto(){
    if(this.cameraCheck)
    this.cameraCheck = !this.galerieCheck;
    this.camera.getPicture(this.cameraOptions).then(file_uri =>{
      this.imgData=file_uri;
    },err=>{
    })
  }

  takePicture(){
    if(this.galerieCheck)
    this.galerieCheck = !this.galerieCheck;
    this.camera.getPicture(this.cameraTakerOptions).then(file_data =>{
      this.imgData =file_data;
    },err=>{
    })
  }

  postPhoto(imgData){
    console.log('entered');
    this.postService.postPhoto(this.imgData).then(res=>{
      this.showLoader();
    },err=>{
      console.log(JSON.stringify(err));
      this.presentToast('une erreur survenu');
    })

  }

  ////////////////////////////////////////////////////////////////////////

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
      content : 'Votre photo est publiée ...'
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
