import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AlbumService} from "../../services/album-service";

@Component({
  selector: 'page-photo-view',
  templateUrl: 'photo-view.html',
})
export class PhotoViewPage {

  private imageId : any;
  private photo :any

  constructor(public navCtrl: NavController, public navParams: NavParams,private albumService : AlbumService) {
   this.imageId = this.navParams.get('imageId');
   this.getPhotoInformation();
  }


  getPhotoInformation(){
    console.log(this.imageId);
     this.albumService.getPhoto(this.imageId).then(res=>{
       console.log(res,'RES');
       this.photo =res['data'];
       console.log(this.photo.is,'PHOTO IDDD');
     },err=>{
       console.log(err,'RES')  ;

    })
  }
}
