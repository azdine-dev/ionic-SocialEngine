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
  private eventPosts : Array<{}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public eventService : EventService,
              public modalCtrl :ModalController,public sanitizer : DomSanitizer,public postSevice : PostService,
              public viewCtrl : ViewController,private events : Events,private toastCtrl :ToastController,
              private loadingCtrl :LoadingController,private alertCtrl : AlertController) {
    this.event = this.navParams.get('event');
    this.getEventFeed(this.event.id);
    this.getAuthUser();
    this.listenToEvents();

  }


  getEventFeed(eventId){
    this.eventService.getEventFeed(eventId).then(res=>{
      this.eventPosts = res['data']['items'];
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
    let linkModal = this.modalCtrl.create(PhotoModalPage,{
      photo : false,
    });
    linkModal.present();
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
    this.navCtrl.push(UserPage, {owner: user})
  }

  showEventsFeed(param?) {
    if(param){
      this.showFeed=param;
    }else {
      this.showFeed=!this.showFeed;
    }

  }

  getInvitedMembers(){
     this.navCtrl.push(ParticipantsPage,{
       title: 'liste des invités',
     })
  }
  doRefreshFeed(refrecher){
    this.getEventFeed(this.event.id);
  }

  listenToEvents(){
    this.events.subscribe('new-activity',()=>{
      this.getEventFeed(this.event.id);
    })
  }
  /////////////////////****/////////////////////////

  showEventDialog(message,contact,handler,title?){
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
            this.getHandler(handler,contact);
          }
        }
      ]
    });

    confirmDelActivity.present();
  }

  getHandler(handler,param){
    if(this[handler]){
      this[handler](param);
    }
  }

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }

}
