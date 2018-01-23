import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
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
 public userService : UserService,public loadingCtrl :LoadingController) {
    if(navParams.data){
      this.imgData = this.navParams.get('img');
    }
  }
    updatePicture(){
    let load = this.showLoader('uploading picture')
    this.userService.updateProfilePicture(this.imgData).then(res=>{
      load.dismiss();
      this.navCtrl.setRoot(HomePage);

    },err=>{
      console.log(JSON.stringify(err),'TTTT');
    })
   }

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }
}
