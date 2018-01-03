import {Component, OnInit} from '@angular/core';
import {AlertController, Events, ModalController, NavController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {UserPage} from '../user/user';
import {ExpressionPage} from "../expression/expression";
import {UserService} from "../../services/user-service";
import {CommentPage} from "../comment/comment";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {VideoService} from "../../services/video-service";
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
  public post: any;
  public feed : Array<{}>;
  public feedInfo : any;

  private videoFeedMap : Map <number,SafeUrl> = new Map <number,SafeUrl>();
  private videos : Array<{}>;
  private video_src ='';
  private authUser ={
    image : '',
    title :'',
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
              public sanitizer : DomSanitizer,public videoService : VideoService) {
       this.listenToFeedEvents();
  }
  ngOnInit(){
    this.getFeed();
    this.getAuthUser();
    this.getFeedVideos();
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
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post});
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
    },(err) => {
      console.log(err);
    });

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

  getFeedVideos(){
   this.videoService.getAllVideos().then(res=>{
     this.videos = res['data'];
     console.log(this.videos,'VIDEOS');
     this.initVideoMap();
     console.log(this.videoFeedMap.get(12),'VIDEO8src');
   })
  }
  initVideoMap(){
    for(let video of this.videos){
      this.videoFeedMap.set(video['id'],this.sanitizer.bypassSecurityTrustResourceUrl(video['video_src']));

    }
  }
 }
