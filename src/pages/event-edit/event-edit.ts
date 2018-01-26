import {Component, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {EventService} from "../../services/event-service";
import {Camera, CameraOptions} from "@ionic-native/camera";

/**
 * Generated class for the EventEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-edit',
  templateUrl: 'event-edit.html',
})
export class EventEditPage {
  @ViewChild(Content) content: Content;

  private cameraOptions: CameraOptions = {
    sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    quality: 100,
    targetWidth: 1024,
    targetHeight: 768,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };

  private eventData ={
    image : '',
    title : '',
    description:'',
    start_date: new Date().toISOString(),
    start_hour : new Date().toISOString(),
    end_date : new Date().toISOString(),
    end_hour : new Date().toISOString(),
    local :'',
    hote:'',
    approval :0,
    auth_invite :1,
    allow_search : 1,
    auth_view :'everyone',
    auth_comment :'everyone',
    auth_photo:'everyone',
    start_time:'',
    end_time :''
  }
  private eventCategories : Array<{}>;
  private showInputs = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private eventService :EventService,
  private camera : Camera,public events :Events,private toastCtrl: ToastController,public viewCtrl : ViewController) {
    this.getEventsCategories();

  }

  getEventsCategories(){
    this.eventService.getEventsCategories().then(data=>{
      this.eventCategories = data['data'];
    })

  }

  selectPhoto(){
    this.camera.getPicture(this.cameraOptions).then(file_uri =>{
      this.eventData.image=file_uri;
    },err=>{
    })
  }

  createEvent(){
       this.eventData.start_time = this.eventData.start_date.substr(0,10)+' '+this.eventData.start_hour.substr(11,8);
       this.eventData.end_time = this.eventData.end_date.substr(0,10) + ' '+this.eventData.end_hour.substr(11,8);
        this.eventService.createEvent(this.eventData).then(res=>{
          this.presentToast(res['data'].message);
          this.viewCtrl.dismiss();
         this.events.publish('create-event');
          },err=>{
          this.presentToast(err.error.data.message);
       })
  }

  //////////////////*******************//////

  presentToast(msg,duration=2000) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : duration,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }

}
