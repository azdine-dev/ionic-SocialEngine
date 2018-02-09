import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {EventService} from "../../services/event-service";
import {EventsDetailPage} from "../events-detail/events-detail";
import {EventEditPage} from "../event-edit/event-edit";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  private defautEvent = 'futur-events';
  private events : Array<any>;
  searching :any = false;
  searchControl :FormControl;
  searchTerm: string = '';
  private userId :any;
  private user :any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private eventService : EventService,private eventSubscriber: Events,private toastCtrl:ToastController) {
    this.searchControl = new FormControl();
    this.listenToEvents();


  }
  ionViewDidLoad(){
    this.userId = this.navParams.get('userId');
    if(!this.userId){
      this.userId ='';
    }
    this.user = this.navParams.get('user');
    this.getEvents(this.userId);
    this.searchControl.valueChanges.pipe(
      debounceTime(700),

    ).subscribe(search=>{
        this.getEvents(this.userId);
      }
    )
  }
  getEvents(userId){
    this.searching = true;
    this.eventService.getEvents(this.searchTerm,userId).then(res=>{
      this.events = res['data'];
      this.searching = false;
    },err=>{
      this.searching = false;
      this.presentToast(err.data.message,'middle');
    })
  }

  goToEventDetail(event){
    this.navCtrl.push(EventsDetailPage,{
      eventId : event.id,
    })
  }

  listenToEvents(){
    this.eventSubscriber.subscribe('update-event',()=>{
      this.getEvents(this.userId);
    });
    this.eventSubscriber.subscribe('event-delete',()=>{
      this.getEvents(this.userId);
    });
    this.eventSubscriber.subscribe('create-event',()=>{
      this.getEvents(this.userId);
    });
  }

  createEvent(){
    this.navCtrl.push(EventEditPage);
  }

  doRefreshBlogs(refrecher){
    this.searching = true;
    this.eventService.getEvents(this.searchTerm,this.userId).then(res=>{
      this.events = res['data'];
      this.searching = false;
      refrecher.complete();
    },err=>{
      refrecher.complete();
      this.searching = false;
      this.presentToast(err.data.message,'middle');
    })
  }

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: position,
      dismissOnPageChange: true
    });
    toast.present();

  }
}
