import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {UserPage} from '../user/user';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-recent-posts',
  templateUrl: 'recent-posts.html'
})
export class RecentPostsPage {
  public posts: any;

  constructor(public nav: NavController, public postService: PostService) {
    // get sample data only
    this.posts = postService.getAll();
  }

  toggleLike(post) {
    // if user liked
    if(post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }

    post.liked = !post.liked
  }

  // on click, go to post detail
  viewPost(postId) {
    this.nav.push(PostPage, {id: postId})
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
}
