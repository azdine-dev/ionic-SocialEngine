import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, Content, Events, LoadingController, ModalController, NavController, PopoverController,
  ToastController,
  ViewController
} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {UserPage} from '../user/user';
import {ExpressionPage} from "../expression/expression";
import {UserService} from "../../services/user-service";
import {CommentPage} from "../comment/comment";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {VideoService} from "../../services/video-service";
import {ShareModalPage} from "../share-modal/share-modal";
import {VideoModalPage} from "../video-modal/video-modal";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {PhotoModalPage} from "../photo-modal/photo-modal";
import {CacheService} from "ionic-cache";
import {Observable} from "rxjs/Observable";
import {NotificationsService} from "../../services/notifications-service";
import {OptionsPage} from "../options/options";
import {NotificationsPage} from "../notifications/notifications";
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild(Content) content: Content;
  public post: any;
  public feed : Array <any>;
  public feed2 : Array <any>;
  public feedInfo : Array<{}>;
  private endOfFeed : boolean = false;
  private userSession =localStorage.getItem('user-id');
  private homeIcon = 'white';
  private defultImage = '/assets/img/default-image.png'
  formatDate = 'medium';


  private videoFeedMap : Map <number,SafeUrl> = new Map <number,SafeUrl>();
  private videos : Array<{}>;
  private video_src ='';
  private authUser ={
    image : '',
    title :'',
  };
  private cameraTakerOptions : CameraOptions = {
    sourceType : this.camera.PictureSourceType.CAMERA,
    destinationType : this.camera.DestinationType.FILE_URI,
    quality : 100,
    targetWidth : 1024,
    targetHeight : 768,
    encodingType : this.camera.EncodingType.JPEG,
    correctOrientation : true
  };


  private userEvents  = [
    'unlike-profile',
    'delete-user',
    'like-profile',
    'new-comment',
    'delete-comment',
    'new-activity'
  ]
  constructor(public nav: NavController, public postService: PostService, public events : Events,public userService : UserService,
              public modalCtrl : ModalController,public alertCtrl : AlertController,
              public sanitizer : DomSanitizer,public videoService : VideoService,public viewCtrl :  ViewController
              ,public toastCtrl : ToastController,private  camera : Camera,
              public cach : CacheService,private notifications:NotificationsService,private popover:PopoverController) {
    this.getAuthUser();
  }
  ngOnInit(){
    this.getFeedV2();

    this.listenToFeedEvents();
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

  viewComment(post) {
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post,},{cssClass:'wez'});
    cmntModal.present();
  }

  sharePost(post){
    let cmntModal = this.modalCtrl.create(ShareModalPage,{
      item : post,
      type : post.type,
    });
    cmntModal.present();
  }

  viewUser(user) {
    this.nav.push(UserPage, {owner: user})
  }



  getFeedV2(refresher ?){

    if(refresher){
      if(typeof refresher !="boolean")
      setTimeout(() => {
        refresher.complete();
      }, 300);

      this.postService.getAllFeed(10).then(result=>{
        this.feed = result['data']['items'];
        this.assignClickedValues(this.feed);
        this.cach.saveItem('feed', this.feed);

        // this.getFeedAttchmentVideos(this.feed).then(data=>{
        //   // this.videoFeedMap = data as Map <number,SafeUrl>;
        //
        //
        // })

      })
    }
    else {
      this.cach.getItem('feed').catch(() => {
        this.postService.getAllFeed(10).then(result => {
          this.feed = result['data']['items'];
          this.assignClickedValues(this.feed);
          this.cach.saveItem('feed', this.feed);
          //
          // this.getFeedAttchmentVideos(this.feed).then(data => {
          //   this.videoFeedMap = data as Map<number, SafeUrl>;
          // })

        })

      }).then(data => {

        this.feed = data;

      });


    }
  }
   /*****Refrecher Events ***/
  doRefreshFeed(refrecher){
     this.getFeedV2(refrecher);
  }

  loadFeed2(refrecher){
    let maxid = this.feed[this.feed.length-1].id;
    if(this.endOfFeed){
      setTimeout(()=>{
        this.presentToast('end of feed');
        refrecher.complete();
      },300);
    }
    else {

      this.postService.getAllFeed(10, maxid).then(res => {
        this.endOfFeed = res['data']['end_of_feed'];
        this.feed2 = res['data']['items'];
        this.assignClickedValues(this.feed2);
        this.feed2.shift();
        this.feed = this.feed.concat(this.feed2);
        refrecher.complete();
        this.cach.saveItem('feed',this.feed);

      },err=>{
        this.presentToast(JSON.stringify(err));
        setTimeout(()=>{
          console.log('rejedcted');

          refrecher.complete();
        },300);
      })
    }
  }
  likePost(post){
    post.total_like ++ ;
    this.postService.likePost(post.id,post.type).then((result)=>{

    },(err)=>{

    });

  }

  unlikePost(post){
    post.total_like -- ;
    this.postService.unlikePost(post.id,post.type).then((result)=>{

    },(err)=>{
    });

  }
  showDeletePostDialog(post){
    let confirmDelActivity = this.alertCtrl.create({

      message: 'voulez-vous vraiment supprimer ce post?',
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
          this.events.publish('delete-user',post);
       }, err =>{

     });

  }
  getAuthUser(){
    this.userService.getUserInfo(this.userSession).then(res=>{
     this.authUser.title = res['data']['title'];
     this.authUser.image = res['data']['imgs']['normal'];
     let user = res['data'];
     console.log(user,'USER');
     this.events.publish('authorized-user',user)

    })
  }

  goToExpress(){
    this.nav.push(ExpressionPage,{
      ownerName :this.authUser.title,
      ownerPhoto :this.authUser.image,
      title :'Créer une publication',
      source : HomePage,
    });
  }

  private listenToFeedEvents() {

    for(let event of this.userEvents){
      this.events.subscribe(event, () => {
        this.getFeedV2(true);
      });
    }

  }


  processHtmlContent(post){
    return (post.content);
  }

  videoAttachmentSrc(video_id){
   this.videoService.getVideo(video_id).then(res=>{
     console.log(res,'SUCCESS');
     return res['data']['video_src'];
   },err=>{
     console.log(err,'ERR');
   })
  }

  getFeedAttchmentVideos(feed){
    return new Promise((resolve,reject)=>{
      let videos =new Map <number,SafeUrl>();
      for(let activity of feed){
        if( activity.attachments.length > 0){
          if(activity.attachments[0].type =='video') {

            this.videoService.getVideo(activity.attachments[0].id).then( res=>{
              this.initVideoMap(activity.attachments[0].id,res['data']['video_src'],videos);
            })

          }

        }
      }
      resolve(videos);
    })

  }
  initVideoMap(videoId,videoSrc,video : Map <number,SafeUrl>){

      video.set(videoId,this.sanitizer.bypassSecurityTrustHtml(videoSrc));

  }
  scrollToTop(){
    if(this.homeIcon == 'white'){
      this.homeIcon = 'coffee';
    }
    else{
      this.homeIcon ='white';
    }

    this.content.scrollToTop(700);
  }

  postNewVideo(){
    let videoModal = this.modalCtrl.create(VideoModalPage);
    videoModal.present();
  }

  postNewPhoto(){
   let photoModal = this.modalCtrl.create(PhotoModalPage,{
     photo : true,
     title :'publier une photo',
   });
   photoModal.present();
  }

  postNewLink(){
    let linkModal = this.modalCtrl.create(PhotoModalPage,{
      photo : false,
    });
    linkModal.present();
  }

  getDefaultImage(image,contact){
      image.src = 'assets/img/user.png';
  }

  trustHtmlSrc(src){
    this.sanitizer.bypassSecurityTrustHtml(src);
    return src;
  }

  getVideoSrc(video_id){
    this.videoService.getVideo(video_id).then(res=>{
      this.sanitizer.bypassSecurityTrustResourceUrl(res['data']['video_src'])
      return res['data']['video_src'];
    })
  }

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: position,
      dismissOnPageChange: true
    });
    toast.present();

  }
  trustVideo(src){
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }


  getUpdateNotifications(myevent){
   this.nav.push(NotificationsPage,{
     notification_type:'update',
   })
  }
  getFriendNotifications(myevent){
    this.nav.push(NotificationsPage,{
      notification_type:'friend_request',
    })
  }

   playVideo(post){
    console.log('wezzzz');
      this.videoService.getVideo(post.attachments[0].id).then(res=>{
        post.video_source = res['data']['video_src'];
        console.log(post.video_source,'vid srrrrc');
        post.clicked =true;
        this.stopOtherVideos(post);
      },err=>{
        this.presentToast('could not play video','middle');
      })
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


    stopOtherVideos(exceptVideo){
      let index = this.feed.indexOf(exceptVideo,0);
      for(let i=0;i<this.feed.length;i++){
        if(i!=index){
          this.feed[i]['clicked'] =false;
        }
      }
    }

 }
