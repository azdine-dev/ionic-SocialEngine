import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';
import {FormControl, NgForm} from "@angular/forms";
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-expression',
  templateUrl: 'expression.html'
})
export class ExpressionPage {
  public post: any;
  public postBody = {
    body : ""
  }
  private cameraTakerOptions : CameraOptions = {
    sourceType : this.camera.PictureSourceType.CAMERA,
    destinationType : this.camera.DestinationType.DATA_URL,
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


  constructor(public nav: NavController, public postService: PostService, private  camera : Camera) {
    // get sample data only
    //this.post = postService.getItem(navParams.get('id'));
    this.post = postService.getItem(0);
    console.log(localStorage.getItem('token'));
  }

  express(post : NgForm){

    this.postBody.body = post.value.bodyText;
     this.postService.postNewActivity(this.postBody).then(res=>{
      console.log(res) ;
     },err =>{
       console.log(err);
     })
     // console.log(post['value']['body']);

  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
  selectPhoto(){
    this.camera.getPicture(this.cameraOptions).then(file_uri =>{
      this.imgSrc=file_uri;
    },err=>{
      console.log(err);
    })
  }
  takePicture(){
    this.camera.getPicture(this.cameraTakerOptions).then(file_data =>{
      this.imgData =file_data;
    },err=>{
      console.log(err);
    })
  }
}
