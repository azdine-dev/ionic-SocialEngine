import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the ShareModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-share-modal',
  templateUrl: 'share-modal.html',
})
export class ShareModalPage {
  private item : any;
  private item_type :any;
  private item_attachment : any;
  private item_post = {
    body : '',
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl :  ViewController,public postService : PostService,
  public sanitizer : DomSanitizer, public  loadingCtrl : LoadingController,private toastCtrl : ToastController) {
    this.item_attachment ={
      type :'not_found',
    };
    this.item = this.navParams.get('item');
    this.item_type = this.navParams.get('type');

    this.initParams();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareModalPage');
  }
  initParams(){

    if(this.item_type == 'activity_action'){
      if(this.item.attachments.length > 0){
        this.item_attachment = this.item.attachments[0];
      }
      else{
        this.item_attachment.type ='no';
      }
    }
    else if(this.item_type == 'album_photo'){

    }
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  shareActivity(type,id,body){
    let load = this.showLoader('veuillez patienter ..');
    load.present();
   this.postService.shareActivity(type,id,body).then(res=>{
     load.dismiss();
     this.presentToast(res['data'].message);
     this.navCtrl.pop();
   },err=>{
     this.presentToast(err.error.data.message);
   })
  }

  trustResourceUrl(html){
    this.sanitizer.bypassSecurityTrustHtml(html);
   return html;
  }

  showLoader(content?){
    let load = this.loadingCtrl.create({
      content : content
    });
    return load;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }
}
