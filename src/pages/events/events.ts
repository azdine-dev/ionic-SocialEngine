import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventService} from "../../services/event-service";
import {EventsDetailPage} from "../events-detail/events-detail";

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  private defautEvent = 'futur-events';
  private events : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private eventService : EventService) {
    this.getEvents();
  }

  getEvents(){
    this.eventService.getEvents().then(res=>{
      this.events = res['data'];
    })
  }

  goToEventDetail(event){
    this.navCtrl.push(EventsDetailPage,{
      event : event,
    })
  }
}
