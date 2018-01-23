import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Expression} from "@angular/compiler/src/output/output_ast";
import {ExpressionPage} from "../expression/expression";
import {PhotoModalPage} from "../photo-modal/photo-modal";
import {ProfilePage} from "../profile/profile";

/**
 * Generated class for the OptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  private owner;
  private imgData;
  private cameraTakerOptions : CameraOptions = {
    sourceType : this.camera.PictureSourceType.CAMERA,
    destinationType : this.camera.DestinationType.FILE_URI,
    quality : 100,
    targetWidth : 1024,
    targetHeight : 768,
    encodingType : this.camera.EncodingType.JPEG,
    correctOrientation : true
  };
  private cameraOptions: CameraOptions = {
    sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    quality: 100,
    targetWidth: 1024,
    targetHeight: 768,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,private  camera :Camera,
              public viewCtrl : ViewController) {
    this.owner = this.navParams.get('owner')
  }

  selectPhoto(){
    this.camera.getPicture(this.cameraOptions).then(file_uri =>{
      this.imgData=file_uri;
      this.navCtrl.push(ProfilePage,{
        img : this.imgData,
        owner : this.owner,
      })
    },err=>{
    })
  }
  takePicture(){
    this.camera.getPicture(this.cameraTakerOptions).then(file_data =>{
      this.imgData =file_data;
      this.navCtrl.push(ProfilePage,{
        img : this.imgData,
        owner : this.owner,
      });
    },err=>{
    })
  }


}
