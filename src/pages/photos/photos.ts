import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AlbumService} from "../../services/album-service";

/**
 * Generated class for the PhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {

  private albumId : any;
  private userName : any;
  private albumPhotos : Array<{}>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public albumService : AlbumService) {
    this.albumId = this.navParams.get('albumId');
    this.userName = this.navParams.get('userName');
    this.getAlbumPhotos(this.albumId);
  }


  getAlbumPhotos(albumId){
    this.albumService.getAlbumPhotos(albumId).then(res=>{
      this.albumPhotos = res['data'].photos;
      console.log('SUCCESS');
    },err=>{
      console.log('ERR')
    })
  }

}
