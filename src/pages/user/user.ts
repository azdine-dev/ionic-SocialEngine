import {Component} from '@angular/core';
import {AlertController, Events, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {VideoService} from "../../services/video-service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {CommentPage} from "../comment/comment";
import {InfoPage} from "../info/info";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  private infoUser ='';
  public user ={};
  public userId : any ;
  private userFeed : Array<{}>;
  private userImage='';
  private videos : Array<{}>;
  private videoFeedMap : Map <number,SafeUrl> = new Map <number,SafeUrl>();

  constructor(public nav: NavController, public navParams: NavParams, public userService: UserService,
              public postService: PostService,public videoService : VideoService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events) {

    this.userId = (navParams.get('id'));
    this.getUserProfileInfo(this.userId);
    this.getUserFeed();
    this.getFeedVideos();
    this.listenToFeedEvents();
    this.infoUser ='infoPer'
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

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }

  // on click, go to post detail
  viewPost(post) {
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post});
    cmntModal.present();
  }

  getUserProfileInfo(userId){
    this.userService.getUserInfo(userId).then(data=>{
        this.user = data['data'];
        this.userImage = this.user['imgs'];
    },err=>{
    })
  }
  getUserFeed() {
    this.postService.getUserFeed(this.userId).then((result) => {
      this.userFeed = result["data"]["items"];
    },(err) => {
    });

  }
  getFeedVideos(){
    this.videoService.getUserVideos(this.userId).then(res=>{
      this.videos = res['data'];
      this.initVideoMap();
    })
  }
  initVideoMap(){
    for(let video of this.videos){
      this.videoFeedMap.set(video['id'],this.sanitizer.bypassSecurityTrustResourceUrl(video['video_src']));

    }
  }
  processHtmlContent(post){
    return post.content;
  }
  likePost(post){
    post.total_like ++ ;
    this.postService.likePost(post.id,post.type).then((result)=>{
      this.events.publish('like-profile');
    },(err)=>{

    });

  }
  unlikePost(post){
    post.total_like -- ;
    this.postService.unlikePost(post.id,post.type).then((result)=>{
      this.events.publish('unlike-profile');
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
            console.log('Agree clicked');
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

  private listenToFeedEvents(){
    this.events.subscribe('delete-user',()=>{
      this.getUserFeed();
    });
    this.events.subscribe('new-comment',()=>{
      this.getUserFeed();
    });
    this.events.subscribe('delete-comment',()=>{
      this.getUserFeed();
    });
    this.events.subscribe('new-activity',()=>{
      this.getUserFeed();
    });
  }


  getUserVideos(userId,userName){
    this.nav.push(InfoPage,{
      id: userId,
      name : userName
    });
  }
}
