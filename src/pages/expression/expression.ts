import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';
import {FormControl, NgForm} from "@angular/forms";
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {File, FileEntry} from "@ionic-native/file";
import {ComposeUploadService} from "../../services/compose-upload";
import {AttachementClass} from "../../Data/attachement.interface";

let accessToken = localStorage.getItem('token');

@Component({
  selector: 'page-expression',
  templateUrl: 'expression.html'
})
export class ExpressionPage implements OnInit{
  private imgData : any;
  private ownerPhoto;
  private ownerName;
  private attachement =new AttachementClass();
  public body = {
    bodyText : "",
  };

  private cameraTakerOptions : CameraOptions = {
    sourceType : this.camera.PictureSourceType.CAMERA,
    destinationType : this.camera.DestinationType.FILE_URI,
    quality : 100,
    targetWidth : 500,
    targetHeight : 500,
    encodingType : this.camera.EncodingType.JPEG,
    correctOrientation : true
  };
  private cameraOptions: CameraOptions = {
    sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    quality: 100,
    targetWidth: 1000,
    targetHeight: 1000,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };




  constructor(public nav: NavController, public postService: PostService, private  camera : Camera,
              public loadingCtrl : LoadingController, public toastCtrl : ToastController,public navParams :NavParams) {
    console.log(localStorage.getItem('token'));
    this.ownerName = this.navParams.get('ownerName');
    this.ownerPhoto = this.navParams.get('ownerPhoto');
  }
  ngOnInit(){
    this.body.bodyText='';
  }
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
  selectPhoto(){
    this.camera.getPicture(this.cameraOptions).then(file_uri =>{
      this.imgData=file_uri;
      this.attachement.Filedata=file_uri;
      this.attachement.type='photo';
    },err=>{
    })
  }

  takePicture(){
    this.camera.getPicture(this.cameraTakerOptions).then(file_data =>{
      this.imgData =file_data;
      this.attachement.Filedata=file_data;
      this.attachement.type='photo';
    },err=>{
    })
  }



  partager(){
     this.postService.postNewActivity(this.body,(this.imgData),this.attachement).then(data=>{

       },err=>{

     })
  }

}
