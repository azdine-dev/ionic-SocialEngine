import {Component, OnInit} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {UserPage} from '../user/user';
import {ExpressionPage} from "../expression/expression";
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

  token = localStorage.getItem('token');

  constructor(public nav: NavController, public postService: PostService, public events : Events) {
    this.posts = postService.getAll();
    this.events.subscribe('delete-user',()=>{
      this.getFeed();
    });

  }
  ngOnInit(){
    this.getFeed();
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
    this.nav.push(PostPage, {id: postId})
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
  getFeed() {
    this.postService.getAllFeed().then((result) => {
      this.feedInfo = result["data"];
      this.feed = result["data"]["items"];
      console.log('MMMMMMM ')
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

  goToExpress(){
    this.nav.push(ExpressionPage);
  }

}
