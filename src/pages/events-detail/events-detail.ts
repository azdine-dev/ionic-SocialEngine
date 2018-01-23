import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventService} from "../../services/event-service";

/**
 * Generated class for the EventsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-events-detail',
  templateUrl: 'events-detail.html',
})
export class EventsDetailPage {

  private eventDefault ='infoPer';
  private eventPosts : Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public eventService : EventService) {
  }


  getEventInfo(){

  }

}
