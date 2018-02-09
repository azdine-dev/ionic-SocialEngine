import {Component, ViewChild} from '@angular/core';

import {NavController, MenuController, ToastController, LoadingController, Modal} from 'ionic-angular';
import {RegisterPage} from '../register/register';
import {HomePage} from '../home/home';
import {AuthServiceProvider} from "../../services/auth-service";
import {ContactsPage} from "../contacts/contacts";
import {CacheService} from "ionic-cache";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Modal;
  sessionInfo={
    access_token : '',
    refrech_token:'',
    userId :'',

  }
  loginData = {
    grant_type: "password",
    scope :"activities basic albums videos blogs settings friends messages events classifieds groups",
    email: "aben@novway.com",
    client_id: "tmyfu3Hg5nua08I",
    client_secret: "Ur3Obk6bvW6tdAbWAEfAwzC1DfjMW1wy",
    password: "bvbdortmund",
  };
  data: any;

  constructor(public nav: NavController, public menu: MenuController, public authService : AuthServiceProvider
  , public loadingCtrl : LoadingController, private toastCtrl : ToastController) {
    // disable menu
    this.menu.swipeEnable(false);
  }

  register() {
    this.nav.setRoot(RegisterPage);
  }

  login() {
     let load = this.showLoader('authentification ..');
     load.present();
    this.authService.login(this.loginData).then((result) => {
      // this.loading.dismiss();
      this.data = result;
      this.sessionInfo.access_token=this.data.access_token;
      this.sessionInfo.refrech_token=this.data.refrech_token;
      this.sessionInfo.userId=this.data.user_ids;

      localStorage.setItem('token',this.data.access_token);
      localStorage.setItem('refresh_token', this.data.refresh_token);
      localStorage.setItem('user-id',this.data.user_id);
      load.dismiss();
      this.nav.setRoot(HomePage);
    }, (err) => {
      load.dismiss();
      this.presentToast('Erreur d Authentification');
    });

  }
   showLoader(content){
    let load = this.loadingCtrl.create({
      content : content
    });
    return load;
   }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();

  }

}
