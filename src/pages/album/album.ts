import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AlbumService} from "../../services/album-service";
import {PhotosPage} from "../photos/photos";
import {PostService} from "../../services/post-service";
import {CommentPage} from "../comment/comment";

/**
 * Generated class for the AlbumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-album',
  templateUrl: 'album.html',
})
export class AlbumPage {
  private images = ['ben.png','max.png','mike.png']
  private userAlbums : Array<{}>;
  private userId : any;
  private userName : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public albumService : AlbumService,
              public postService : PostService,public modalCtrl: ModalController) {
    this.userId = this.navParams.get('id');
    this.userName =this.navParams.get('name');
    this.getUserAlbums(this.userId);
  }


  getUserAlbums(userId) {
    this.albumService.getUserAlbums(userId).then(data=>{
      this.userAlbums = data['data'];
    },err=>{
    })
  }


  goToAlbumPhotos(albumId){
    this.navCtrl.push(PhotosPage,{
      albumId : albumId,
      userName : this.userName
    })
  }

  toggleLikeAlbum(album){
    if(album.is_liked) {
      this.unlikeAlbum(album.id);

    } else {
      this.likeAlbum(album.id);
    }
    album.is_liked = !album.is_liked

  }

  likeAlbum(album_id){
    this.postService.likePost(album_id,'album').then(res=>{
      console.log(('SUCCESS LIKE ALBUM'));
    },err=>{
      console.log(err,'ERR LIKE ALBUM');
    })
  }

  unlikeAlbum(album_id){
    this.postService.unlikePost(album_id,'album');
  }

  viewComment(post) {
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post});
    cmntModal.present();
  }


}
