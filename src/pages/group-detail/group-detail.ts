import { Component } from '@angular/core';
import {
  AlertController, Events, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {EventsDetailPage} from "../events-detail/events-detail";
import {ExpressionPage} from "../expression/expression";
import {ParticipantsPage} from "../participants/participants";
import {UserPage} from "../user/user";
import {ShareModalPage} from "../share-modal/share-modal";
import {PostService} from "../../services/post-service";
import {PhotoModalPage} from "../photo-modal/photo-modal";
import {EventService} from "../../services/event-service";
import {DomSanitizer} from "@angular/platform-browser";
import {GroupService} from "../../services/group-service";
import {CommentPage} from "../comment/comment";

/**
 * Generated class for the GroupDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {
  private group : any;
  private groupId :any;
  private loading :any;
  private eventDefault ='about';
  private userSession =localStorage.getItem('user-id');
  private showFeed = false;
  private groupPosts : Array<{}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public groupService : GroupService,
              public modalCtrl :ModalController,public sanitizer : DomSanitizer,public postSevice : PostService,
              public viewCtrl : ViewController,private events : Events,private toastCtrl :ToastController,
              private loadingCtrl :LoadingController,private alertCtrl : AlertController,public postService : PostService) {
    this.groupId =this.navParams.get('groupId');
    this.getGroupInfo();
    this.getGroupFeed(this.groupId);
    this.listenToFeedEvents();

  }

  getGroupInfo(){
    this.loading = true;
    this.groupService.getGroup(this.groupId).then(res=>{
      this.group = res['data'];
      this.loading=false;
    },err=>{
      this.loading=false;
    })

    }


  getGroupFeed(groupId){
    this.groupService.getGroupFeed(groupId).then(res=>{
      this.groupPosts = res['data']['items'];
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

  goToExpress(groupId){
    this.navCtrl.push(ExpressionPage,{
      title :'Exprimer vous ..',
      subjectId : groupId,
      subjectType : 'group',
      source : GroupDetailPage,
    })
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
    post.total_like++;
    this.postSevice.likePost(post.id,post.type).then(res=>{
      console.log('Post liked');
    })
  }
  unlikePost(post){
    post.total_like--;
    this.postSevice.unlikePost(post.id,post.type).then(res=>{
      console.log('POST UNLIKED');
    })
  }
  viewUser(user) {
    this.navCtrl.push(UserPage, {ownerId: user.id})
  }

  showGroupsFeed(param?) {
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
    this.getGroupFeed(this.groupId);
  }

  shareGroupe(group){
    let eventShare = this.modalCtrl.create(ShareModalPage,{
      item :group,
      type :'group',
    });
    eventShare.present();
  }
  toggleJoinGroup(group){
    console.log(group.can_join,'group');
    if(group.can_leave){
      this.showEventDialog('Souhaitez-vous vraiment quitter ce Group?',group,'leaveGroup','Quitter le Group ?');
    }
    else if(group.can_join) {
      this.showEventDialog('Rejoindre ?',group,'joinGroup','Voulez-vous rejoindre ce groupe?');
    }

  }
  joinGroup(group){
    this.groupService.joinGroup(group.id).then(res=>{
      group.can_leave = true;
      group.total_member++;
      this.events.publish('update-event');
      this.presentToast(res['data'].message);
    },err=>{
      this.presentToast(err.error.data.message);
    });
  }
  leaveGroup(group){
    this.groupService.leaveGroup(group.id).then(res=>{
      group.can_leave = false;
      group.total_member--;
      this.events.publish('update-event');
      this.presentToast(res['data'].message);
    },err=>{
      this.presentToast(err.error.data.message);
    });
  }

  ondeletlick(group){
    this.showEventDialog('Souhaitez-vous vraiment supprimer ce groupe?',group,'deleteEvent','Supprimer');
  }

  deleteEvent(group){
    let load =this.showLoader('veuillez patientez ..');
    load.present();
    this.groupService.deleteGroup(group.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message,3000);
      this.events.publish('event-delete');
      this.viewCtrl.dismiss();
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }

  editEvent(event){

  }

  commentPost(post){
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post});
    cmntModal.present();
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

  presentToast(msg,duration=2000) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : duration,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }

  showDeletePostDialog(post){
    let confirmDelActivity = this.alertCtrl.create({

      message: 'voulez-vous vraiment supprimer ce post ?',
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deletePost(post);
          }
        }
      ]
    });

    confirmDelActivity.present();
  }

  deletePost(post){
    this.postService.deletePost(post).then(result =>{
      this.events.publish('delete-user');
    }, err =>{

    });

  }

  /****************Feed EVENTS**************/
  private listenToFeedEvents(){
    this.events.subscribe('delete-user',()=>{
      this.getGroupFeed(this.groupId);
    });
    this.events.subscribe('new-comment',()=>{
      this.getGroupFeed(this.groupId);
    });
    this.events.subscribe('delete-comment',()=>{
      this.getGroupFeed(this.groupId);
    });
    this.events.subscribe('new-activity',()=>{
      this.getGroupFeed(this.groupId);
    });
    this.events.subscribe('new-state',()=>{
      this.getGroupFeed(this.groupId);
    });

    this.events.subscribe('new-activity',()=>{
      this.getGroupFeed(this.groupId);
    })

  }
}
