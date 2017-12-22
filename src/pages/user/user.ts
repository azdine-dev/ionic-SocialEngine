import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';

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
  public user: any;

  constructor(public nav: NavController, public navParams: NavParams, public userService: UserService, public postService: PostService) {
    // get sample data only
    this.user = userService.getItem(navParams.get('id'));
    // this.user = userService.getItem(4);

    Object.assign(this.user, {
      'followers': 199,
      'following': 48,
      'favorites': 14,
      'posts': postService.getAll()
    });
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

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }

  // on click, go to post detail
  viewPost(postId) {
    this.nav.push(PostPage, {id: postId})
  }
}
