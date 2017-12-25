import {Component} from '@angular/core';
import {LoadingController, NavController, ToastController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';
import {FormControl, NgForm} from "@angular/forms";
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {File, FileEntry} from "@ionic-native/file";
import {ComposeUploadService} from "../../services/compose-upload";

let accessToken = localStorage.getItem('token');

@Component({
  selector: 'page-expression',
  templateUrl: 'expression.html'
})
export class ExpressionPage {

  private imageFile :any;
  public post: any;

  private cameraTakerOptions : CameraOptions = {
    sourceType : this.camera.PictureSourceType.CAMERA,
    destinationType : this.camera.DestinationType.FILE_URI,
    quality : 50,
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

  private imgSrc : string;
  private imgData : any;


  constructor(public nav: NavController, public postService: PostService, private  camera : Camera,
              public loadingCtrl : LoadingController, public toastCtrl : ToastController, private composeUpload : ComposeUploadService) {
    // get sample data only
    //this.post = postService.getItem(navParams.get('id'));
    this.post = postService.getItem(0);
    console.log(localStorage.getItem('token'));
  }

  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
  selectPhoto(){
    this.camera.getPicture(this.cameraOptions).then(file_uri =>{
      this.imgData=file_uri;
    },err=>{
      console.log(err);
    })
  }

  takePicture(){
    this.camera.getPicture(this.cameraTakerOptions).then(file_data =>{
      this.imgData =file_data;
    },err=>{
      console.log(JSON.stringify(err));
    })
  }

  uploadFile(){
    this.composeUpload.composeUploadPhoto(this.imgData).then(data=>{
      console.log(JSON.stringify(data))
    },err=>{
       console.log(JSON.stringify(err));
    })
  }


  partager(){

  }

}
