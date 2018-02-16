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
import {EventsDetailPage} from "../events-detail/events-detail";
import {BlogsViewPage} from "../blogs-view/blogs-view";
import {LinkPreviewPage} from "../link-preview/link-preview";
import {GroupsPage} from "../groups/groups";
import {GroupDetailPage} from "../group-detail/group-detail";
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
  public feed : {
    next_id : 0,
    end_of_feed : any,
    items: Array<any>,
  };
  public feed2 : {
    next_id : 0,
    end_of_feed : any,
    items: Array<any>,
  };
  public feedInfo : Array<{}>;
  private endOfFeed : boolean = false;
  private userSession :any;
  private homeIcon = 'white';
  private defultImage = '/assets/img/default-image.png'
  formatDate = 'medium';
  private search:any;


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



    this.feed = {
      next_id   : 0,
      end_of_feed : false,
      items : new Array<any>(),
    };
    this.feed2 = {
      next_id   : 0,
      end_of_feed : false,
      items : new Array<any>(),
    };
  }
  ngOnInit(){
    this.userSession = localStorage.getItem('user-id');
    this.getAuthUser(this.userSession);
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
    let cmntModal = this.modalCtrl.create(CommentPage,
      {
        item_type : 'event',
        item_id : post.id,
        post:post,
      },{cssClass:'wez'});
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
    this.nav.push(UserPage, {ownerId: user.id})
  }



  getFeedV2(refresher ?){

    if(refresher){
      if(typeof refresher !="boolean")
        setTimeout(() => {
          refresher.complete();
        }, 300);

      this.postService.getAllFeed(10).then(result=>{
        this.feed.end_of_feed =result['data']['end_of_feed'];
        this.feed.next_id = result['data']['next_id'];
        this.feed.items = result['data']['items'];
        this.assignClickedValues(this.feed.items);
        this.cach.saveItem('feed', this.feed.items);

      })
    }
    else {
      this.cach.getItem('feed').catch(() => {
        this.postService.getAllFeed(10).then(result => {
          this.feed.end_of_feed =result['data']['end_of_feed'];
          this.feed.next_id = result['data']['next_id'];
          this.feed.items = result['data']['items'];
          this.assignClickedValues(this.feed.items);
          this.cach.saveItem('feed', this.feed.items);

        })

      }).then(data => {

        this.feed.items = data;

      });


    }
  }
  /*****Refrecher Events ***/
  doRefreshFeed(refrecher){
    this.getFeedV2(refrecher);
  }

  loadFeed2(refrecher){
    let maxid = this.feed.next_id;
    if(this.feed.end_of_feed){
      setTimeout(()=>{
        refrecher.complete();
      },300);
    }
    else {

      this.postService.getAllFeed(10, maxid).then(res => {
        this.feed2.end_of_feed = res['data']['end_of_feed'];
        this.feed2.next_id = res['data']['next_id'];
        this.feed2.items = res['data']['items'];

        this.feed.items = this.feed.items.concat(this.feed2.items);
        this.assignClickedValues(this.feed.items);
        this.feed.end_of_feed=this.feed2.end_of_feed;
        this.feed.next_id = this.feed2.next_id;
        refrecher.complete();
        this.cach.saveItem('feed',this.feed.items);

      },err=>{
        this.presentToast('ERROR');
        setTimeout(()=>{
          refrecher.complete();
        },300);
      })
    }
  }
  likePost(post){
    post.total_like ++ ;
    this.postService.likePost(post.id,'activity_action').then((result)=>{

    },(err)=>{

    });

  }

  unlikePost(post){
    post.total_like -- ;
    this.postService.unlikePost(post.id,'activity_action').then((result)=>{

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
      this.presentToast('Elément supprimé','middle');
    }, err =>{
      this.presentToast('Erreur lors de la suppression','middle');
    });

  }
  getAuthUser(useId){
    this.userService.getUserInfo(useId).then(res=>{
      this.authUser.title = res['data']['title'];
      this.authUser.image = res['data']['imgs']['normal'];
      let user = res['data'];
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
      return res['data']['video_src'];
    },err=>{
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
    let linkModal = this.modalCtrl.create(LinkPreviewPage,{
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

  searchThings(myevent){
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
    let index = this.feed.items.indexOf(exceptVideo,0);
    for(let i=0;i<this.feed.items.length;i++){
      if(i!=index){
        this.feed.items[i]['clicked'] =false;
      }
    }
  }


  goToAttachmentDescription(att){
    if(att.type =='event'){
      this.nav.push(EventsDetailPage,{
        eventId : att.id,
      })

    }else if(att.type =='blog'){
      this.nav.push(BlogsViewPage,{
        blogId : att.id,
      })
    }else if(att.type =='group'){
      this.nav.push(GroupDetailPage,{
        groupId : att.id,
      })
    }
   }
  openLink(url){
    console.log(url,'URL');
    window.open(url)
  }
 }
