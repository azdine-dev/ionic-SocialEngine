import {Component, OnInit} from '@angular/core';
import {Events, ModalController, NavController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {UserPage} from '../user/user';
import {ExpressionPage} from "../expression/expression";
import {UserService} from "../../services/user-service";
import {CommentPage} from "../comment/comment";
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
  public posts: any;
  public feed : Array<{}>;
  public feedInfo : any;
  private authUser ={
    image : '',
    title :'',
  };

  token = localStorage.getItem('token');

  constructor(public nav: NavController, public postService: PostService, public events : Events,public userService : UserService,
              public modalCtrl : ModalController) {
    this.posts = postService.getAll();
    this.events.subscribe('delete-user',()=>{
      this.getFeed();
    });

  }
  ngOnInit(){
    this.getFeed();
    this.getAuthUser();
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
  viewPost(postId) {
    let cmntModal = this.modalCtrl.create(CommentPage);
    cmntModal.present();
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(CommentPage, {id: userId})
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

    this.postService.likePost(post.id,post.type).then((result)=>{
      post.total_like ++ ;
    },(err)=>{

    });

  }
  unlikePost(post){

    this.postService.unlikePost(post.id,post.type).then((result)=>{
      post.total_like -- ;
    },(err)=>{
    });

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

}
