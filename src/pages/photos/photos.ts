import {Component, OnInit} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AlbumService} from "../../services/album-service";
import {SafeUrl} from "@angular/platform-browser";
import {UserService} from "../../services/user-service";
import {ShareModalPage} from "../share-modal/share-modal";
import {PhotoViewPage} from "../photo-view/photo-view";

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

  private album : any;
  private userName : any;
  private albumPhotos : Array<{}>;
  private photosMap : Map <number,SafeUrl> = new Map <number,SafeUrl>();

  constructor(public navCtrl: NavController, public navParams: NavParams,public albumService : AlbumService,
  public alertCtrl : AlertController,public events : Events,public userService : UserService, public modalCtrl :ModalController) {
    this.album = this.navParams.get('album');
    this.userName = this.navParams.get('userName');
    this.getAlbumPhotos(this.album.id);
    this.listenerEvents()
  }

  getAlbumPhotos(albumId){
    this.albumService.getAlbumPhotos(albumId).then(res=>{
      this.albumPhotos = res['data'].photos;
      this.initPhotosMap(this.albumPhotos);
      console.log('SUCCESS phots');
    },err=>{
      console.log('ERR')
    })
  }
  initPhotosMap(albumPhotos){
    for(let photo of albumPhotos){
       this.albumService.getPhoto(photo.id).then(res=>{
          this.photosMap.set(photo.id,res['data']);
       })
    }
  }

  showDeletePhotoDialog(photoId){
    let confirmDelComm = this.alertCtrl.create({
      title : 'supprimer la photo',
      message: 'voulez-vous vraiment supprimer cette photo?',
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deletePhoto(photoId);
          }
        },
      ]
    });

      confirmDelComm.present();
  }


  showMakeProfilePictureDialog(photoId){
    let confirmDelComm = this.alertCtrl.create({
      title : 'Faire une photo de profil',
      message: 'Voulez-vous faire de cette photo votre photo du profil?',
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.makeAsProfilePicture(photoId);
          }
        },
      ]
    });

    confirmDelComm.present();
  }

  sharePhotoDialog(photId) {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  deletePhoto(photoId){
    this.albumService.deletePhoto(photoId).then(res=>{
      this.events.publish('delete-photo');
      console.log('photo deleted')
    },err=>{
      console.log(JSON.stringify(err))
    });
  }

  makeAsProfilePicture(photo_id){
   this.userService.makeProfilePicture(photo_id).then(res=>{
     console.log('success profile')
   }, err=>{
     JSON.stringify(err);
   })
  }

  shareImage(photo){
    let shareCtrl = this.modalCtrl.create(ShareModalPage,{
      item :photo,
      type : 'album_photo'
    });
    shareCtrl.present();
    console.log('wez');
  }

  listenerEvents(){
    this.events.subscribe('delete-photo',()=>{
      this.getAlbumPhotos(this.album.id);
    })
  }

  goToPhotoDetail(imageId){
   this.navCtrl.push(PhotoViewPage,{
     imageId : imageId,
   })
  }
}
