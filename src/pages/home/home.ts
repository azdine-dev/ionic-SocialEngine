import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, Content, Events, LoadingController, ModalController, NavController,
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
  public feed : Array<{}>;
  public feedInfo : any;
  private homeIcon = 'white';

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

  token = localStorage.getItem('token');

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
              ,public loadingCtrl : LoadingController,private  camera : Camera) {
       this.listenToFeedEvents();
  }
  ngOnInit(){
    this.getFeed();
    this.getAuthUser();
  }
  ionViewDidLoad(){
    let x = document.getElementsByClassName('feed_item_username');
    let y = document.getElementById('wdez');
    console.log(x);
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

  // on click, go to post detail
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

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
  getFeed() {
    this.postService.getAllFeed().then((result) => {
      this.feedInfo = result["data"];
      this.feed = result["data"]["items"];
      this.getFeedAttchmentVideos(this.feed);

    },(err) => {
      console.log(err);
    })

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
          this.events.publish('delete-user');
       }, err =>{

     });

  }
  getAuthUser(){
    this.userService.getAuthorizedUser().then(res=>{
     this.authUser.title = res['data']['title'];
     this.authUser.image = res['data']['imgs']['profile'];

    })
  }

  goToExpress(){
    this.nav.push(ExpressionPage,{
      ownerName :this.authUser.title,
      ownerPhoto :this.authUser.image,
    });
  }

  private listenToFeedEvents() {

    for(let event of this.userEvents){
      this.events.subscribe(event, () => {
        this.getFeed();
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
    for(let activity of feed){
      if( activity.attachments.length > 0){
           if(activity.attachments[0].type =='video') {

             this.videoService.getEmbedVideo(activity.attachments[0].id).then( res=>{
               this.initVideoMap(activity.attachments[0].id,res['data']['code']);
               })

           }

      }
    }
    console.log(this.videoFeedMap,'MAAAP')


  }
  initVideoMap(videoId,videoCode){

      this.videoFeedMap.set(videoId,this.sanitizer.bypassSecurityTrustHtml(videoCode));

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
   let photoModal = this.modalCtrl.create(PhotoModalPage);
   photoModal.present();
  }

 }
