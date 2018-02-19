import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {UserService} from "../../services/user-service";
import {HomePage} from "../home/home";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private imgData : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
 public userService : UserService,public loadingCtrl :LoadingController,private toastCtrl:ToastController) {
    if(navParams.data){
      this.imgData = this.navParams.get('img');
    }
  }
    updatePicture(){
    let load = this.showLoader('uploading picture');
    load.present();
    this.userService.updateProfilePicture(this.imgData).then(res=>{
      load.dismiss();
      let toast = this.presentToast(res['data'].message);
      toast.present();
      toast.onDidDismiss(()=>{
        this.navCtrl.setRoot(HomePage);
      })


    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
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
      duration : 2000,
      position: position,
      dismissOnPageChange: true
    });
    return toast;
  }
}
