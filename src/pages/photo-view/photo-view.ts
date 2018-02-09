import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, Content, Events, IonicPage, LoadingController, ModalController, NavController,
  NavParams, ToastController, ViewController
} from 'ionic-angular';
import {AlbumService} from "../../services/album-service";
import {ShareModalPage} from "../share-modal/share-modal";
import {UserService} from "../../services/user-service";

@Component({
  selector: 'page-photo-view',
  templateUrl: 'photo-view.html',
})
export class PhotoViewPage implements OnInit{
  @ViewChild(Content) content: Content;

  private imageId : any;
  private photo :any;
  private searching :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private albumService : AlbumService,
  public alertCtrl:AlertController,private modalCtrl :ModalController,private events:Events,private userService:UserService,
  private loadingCtrl:LoadingController,private toastCtrl:ToastController,private viewCtrl : ViewController) {
    this.imageId = this.navParams.get('imageId');
  }
 ngOnInit(){

   this.getPhotoInformation();
 }

  getPhotoInformation(){
    this.searching = true;
     this.albumService.getPhoto(this.imageId).then(res=>{
       this.photo =res['data'];
       this.searching = false;
     },err=>{
       this.searching = false;
    })
  }

  goToImage(imageId){
    this.imageId=imageId;
    this.ngOnInit();
  }

  showDeletePhotoDialog(photo){
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
            this.deletePhoto(photo);
          }
        },
      ]
    });

    confirmDelComm.present();
  }
  deletePhoto(photo){
    let load = this.showLoader('veuillez patientez');
    let success =this.presentToast('image supprimé','middle');
    let error =this.presentToast('could not delete image','middle');
    load.present();
    this.albumService.deletePhoto(photo.id).then(res=>{
      this.events.publish('image-delete',photo.album.owner.id);
      load.dismiss();
      success.present();
      success.onDidDismiss(()=>{
        this.viewCtrl.dismiss();
      })

    },err=>{
      load.dismiss();
      error.present();
    });
  }
  shareImage(photo){
    let shareCtrl = this.modalCtrl.create(ShareModalPage,{
      item :photo,
      type : 'album_photo'
    });
    shareCtrl.present();
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
  makeAsProfilePicture(photo_id){
    this.userService.makeProfilePicture(photo_id).then(res=>{
    }, err=>{
      JSON.stringify(err);
    })
  }

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 1000,
      position: position,
      dismissOnPageChange: true
    });
    return toast;

  }
}
