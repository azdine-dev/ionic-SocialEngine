import {Component, OnInit} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
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

@Component({
  selector: 'page-album',
  templateUrl: 'album.html',
})
export class AlbumPage implements OnInit{
  private images = ['ben.png','max.png','mike.png'];
  private makeProfilePicture : any;
  private searching :any;
  private userAlbums : Array<{}>;
  private userId : any;
  private userName : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public albumService : AlbumService,
              public postService : PostService,public modalCtrl: ModalController,private events :Events) {
    this.userId = this.navParams.get('id');
    this.userName =this.navParams.get('name');
    this.makeProfilePicture = this.navParams.get('profile');
    this.listenToCustomEvents();


  }

  ngOnInit(){
    this.getUserAlbums(this.userId);
  }


  getUserAlbums(userId) {
    this.searching = true;
    this.albumService.getUserAlbums(userId).then(data=>{
      this.userAlbums = data['data'];
      this.searching = false;
    },err=>{
    })
  }


  goToAlbumPhotos(album){
    if(this.makeProfilePicture =='YES'){

    }else{
      this.navCtrl.push(PhotosPage,{
        album : album,
        userName : this.userName
      })
    }

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
    let cmntModal = this.modalCtrl.create(CommentPage,{
      post : post,
      item_type : 'album',
      item_id :post.id,
    });
    cmntModal.present();
  }
  getDefaultImage(image,contact){
    image.src = 'assets/img/cover.png';
  }

  listenToCustomEvents(){
    this.events.subscribe('image-delete',(data)=>{
      console.log(data,'IDDD');
      this.userId=data;
      this.ngOnInit();
    })
  }

}
