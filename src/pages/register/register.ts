import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  public chat: any;

  constructor(public nav: NavController, public menu: MenuController) {
    // disable menu
    this.menu.swipeEnable(false);
  }

  register() {
    this.nav.setRoot(HomePage);
  }

  login() {
    // add your check auth here
    this.nav.setRoot(LoginPage);
  }
}
