import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  public post: any;

  constructor(public nav: NavController, public postService: PostService) {
    // get sample data only
    //this.post = postService.getItem(navParams.get('id'));
    this.post = postService.getItem(0);
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
}
