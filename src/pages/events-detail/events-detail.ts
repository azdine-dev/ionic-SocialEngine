import {Component, Sanitizer} from '@angular/core';
import {
  AlertController,
  Events, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {EventService} from "../../services/event-service";
import {ExpressionPage} from "../expression/expression";
import {PhotoModalPage} from "../photo-modal/photo-modal";
import {DomSanitizer} from "@angular/platform-browser";
import {PostService} from "../../services/post-service";
import {UserPage} from "../user/user";
import {ParticipantsPage} from "../participants/participants";
import {HomePage} from "../home/home";
import {ShareModalPage} from "../share-modal/share-modal";
import {VideoService} from "../../services/video-service";
import {InfoPage} from "../info/info";
import {CommentPage} from "../comment/comment";

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
  private event : any
  private eventDefault ='about';
  private userSession =localStorage.getItem('user-id');
  private showFeed = false;
  private eventPhotos : Array<any>;
  searchPhotos :any;

  private eventId : any;
  private eventPosts : Array<{}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public eventService : EventService,
              public modalCtrl :ModalController,public sanitizer : DomSanitizer,public postSevice : PostService,
              public viewCtrl : ViewController,private events : Events,private toastCtrl :ToastController,
              private loadingCtrl :LoadingController,private alertCtrl : AlertController,private videoService :VideoService) {
    this.event = this.navParams.get('event');
    this.eventId = this.navParams.get('eventId');
    this.eventPhotos = new Array<any>();
    this.getEvent();
    this.getEventFeed(this.eventId);
    this.getAuthUser();
    this.listenToEvents();

    if(this.eventId){

    }

  }

  getEvent(){
    this.eventService.getEvent(this.eventId).then(res=>{
      this.event = res['data'];
    })
  }
  showEventPhotos(){
    this.showFeed =false;
    this.getEventPhotos();
  }

  getEventPhotos(){
    this.searchPhotos = true;
   this.eventService.getEventPhotos(this.eventId).then(res=>{
     this.eventPhotos = res['data'];
     this.searchPhotos = false;
   },err=>{
     this.searchPhotos = false;
   })
  }
  getCanInviteFriends(event){
    console.log(event.id,'EVENT ID');
    this.navCtrl.push(InfoPage,{
      eventId : event.id,
      type:'event',
    })
  }
  getEventFeed(eventId){
    this.eventService.getEventFeed(eventId).then(res=>{
      this.eventPosts = res['data']['items'];
      this.assignClickedValues(this.eventPosts);
      console.log(this.eventPosts);
    })
  }
  postNewPhoto(){
    let photoModal = this.modalCtrl.create(PhotoModalPage,{
      photo : true,
      title :'partager une photo'
    });
    photoModal.present();
  }
  postNewVideo(){

  }
  postNewLink(){
    // let linkModal = this.modalCtrl.create(PhotoModalPage,{
    //   photo : false,
    // });
    // linkModal.present();
  }

  goToExpress(eventId){
    this.navCtrl.push(ExpressionPage,{
      title :'Exprimer vous ..',
      subjectId : eventId,
      subjectType : 'event',
      source : EventsDetailPage,
    })
  }
  getAuthUser(){

  }
  processHtmlContent(html){
    this.sanitizer.bypassSecurityTrustHtml(html);
    return html;
  }
  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }

  toggleLike(post) {
    // if user liked
    if(post.is_liked) {
      this.unlikePost(post);

    } else {
      this.likePost(post);
    }
    post.is_liked = !post.is_liked
  }

  likePost(post){
   this.postSevice.likePost(post.id,post.type).then(res=>{
     console.log('Post liked');
   })
  }
  unlikePost(post){
    this.postSevice.unlikePost(post.id,post.type).then(res=>{
      console.log('POST UNLIKED');
    })
  }
  viewUser(user) {
    this.navCtrl.push(UserPage, {ownerId: user.id})
  }

  showEventsFeed(param?) {
      this.showFeed=param;
  }

  getInvitedMembers(){
     this.navCtrl.push(ParticipantsPage,{
       title: 'liste des invitées',
     })
  }
  doRefreshFeed(refrecher){
    this.refrechEvent(refrecher);

  }

  refrechEvent(refrecher){
    this.eventService.getEvent(this.eventId).then(res=>{
      this.event = res['data'];
      refrecher.complete();
    },err=>{
      refrecher.complete();
    })
  }

  listenToEvents(){
    this.events.subscribe('new-activity',()=>{
      this.getEventFeed(this.event.id);
    })
    this.events.subscribe('new-comment',()=>{
      this.getEventFeed(this.event.id);
    })
  }
  shareEvent(event){
   let eventShare = this.modalCtrl.create(ShareModalPage,{
      item :event,
      type :'event',
    });
   eventShare.present();
  }
  toggleJoinEvent(event){
    console.log(event.can_join,'event');
    if(event.can_leave){
      this.showEventDialog('Souhaitez-vous vraiment quitter cet événement?',event,'leaveEvent','Quitter lévènement ?');
    }
    else if(event.can_join) {
      this.showRadioDialogEvent('Participer ?','Souhaitez-vous participer à cet événement?',event);
    }

  }
  joinEvent(event,rsvp){
    this.eventService.joinEvent(event.id,rsvp).then(res=>{
      event.can_leave = true;
      this.events.publish('update-event');
      this.presentToast(res['data'].message);
    },err=>{
      this.presentToast(err.error.data.message);
    });
  }
  leaveEvent(event){
    this.eventService.leaveEvent(event.id).then(res=>{
      event.can_leave = false;
      this.events.publish('update-event');
      this.presentToast(res['data'].message);
    },err=>{
      this.presentToast(err.error.data.message);
    });
  }

  ondeletlick(event){
    this.showEventDialog('Souhaitez-vous vraiment supprimer cet événement?',event,'deleteEvent','Supprimer');
  }

  deleteEvent(event){
    let load =this.showLoader('veuillez patientez ..');
    load.present();
    this.eventService.deleteEvent(event.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message,'middle',3000);
      this.events.publish('event-delete');
      this.viewCtrl.dismiss();
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }
  editEvent(event){

  }
  /////////////////////****/////////////////////////

  showEventDialog(message,object,handler,title?){
    let confirmDelActivity = this.alertCtrl.create({
      title : title,
      message: message,
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.getHandler(handler,object);
          }
        }
      ]
    });

    confirmDelActivity.present();
  }
  showRadioDialogEvent(title,message,event){
    let alert = this.alertCtrl.create({
      title : title,
      message: message,

    });

    alert.addInput({
      type: 'radio',
      label: 'Je participe',
      value: 'attending',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Je participerai peut-être',
      value: 'maybe_attending'
    });

    alert.addInput({
      type: 'radio',
      label: 'Je ne participe pas',
      value: 'not_attending'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
       this.joinEvent(event,data);
      }
    })
    alert.present();
  }


  getHandler(handler,param1){
    if(this[handler]){
      this[handler](param1);
    }
  }

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }

  presentToast(msg,position='bottom',duration=2000) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : duration,
      position: position,
      dismissOnPageChange: true
    });
    toast.present();

  }
  assignClickedValues(array :Array<{}>){
    for(let item of array){
      Object.assign(item,{
        clicked :false,
        video_source :'',
      })
    }
  }
  trustResourceUrl(post){
    let url ='http://intaliq.novway.com'
    return this.sanitizer.bypassSecurityTrustResourceUrl(post.video_source);
  }
  playVideo(post){
    this.videoService.getVideo(post.attachments[0].id).then(res=>{
      post.video_source = res['data']['video_src'];
      post.clicked =true;
      this.stopOtherVideos(post);
    },err=>{
      this.presentToast('could not play video','middle');
    })
  }

  stopOtherVideos(exceptVideo){
    let index = this.eventPosts.indexOf(exceptVideo,0);
    for(let i=0;i<this.eventPosts.length;i++){
      if(i!=index){
        this.eventPosts[i]['clicked'] =false;
      }
    }
  }
  sharePost(post){
    let cmntModal = this.modalCtrl.create(ShareModalPage,{
      item : post,
      type : post.type,
    });
    cmntModal.present();
  }
  viewComment(post) {
    console.log(post.id);
    let cmntModal = this.modalCtrl.create(CommentPage,
      {
        item_type : 'activity_action',
        item_id : post.id,
        post:post,
      },{cssClass:'wez'});
    cmntModal.present();
  }

}
