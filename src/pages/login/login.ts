import {Component, ViewChild} from '@angular/core';

import {NavController, MenuController, ToastController, LoadingController, Modal} from 'ionic-angular';
import {RegisterPage} from '../register/register';
import {HomePage} from '../home/home';
import {AuthServiceProvider} from "../../services/auth-service";
import {ContactsPage} from "../contacts/contacts";

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
  loginData = {
    grant_type: "password",
    scope :"activities basic albums videos blogs",
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

    this.authService.login(this.loginData).then((result) => {
      // this.loading.dismiss();
      this.data = result;
      localStorage.setItem('token',this.data.access_token);
      localStorage.setItem('refresh_token', this.data.refresh_token);
      this.showLoader(HomePage);
    }, (err) => {
      console.log( 'ERROR ==>',err["statusText"]);
      this.presentToast(err["statusText"]);
    });

  }
   showLoader(page){
    let load = this.loadingCtrl.create({
      content : 'Authenticating ...'
    });
    load.present({});

    setTimeout(()=>{
      this.nav.setRoot(page);
    },1000);

     setTimeout(() => {
       load.dismiss();
     }, 1000);
     console.log("DISMISS");
   }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

  }
}
