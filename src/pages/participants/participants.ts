import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ParticipantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-participants',
  templateUrl: 'participants.html',
})
export class ParticipantsPage {
   private title;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title =  this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticipantsPage');
  }

}
