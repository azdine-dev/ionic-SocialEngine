import {Component} from '@angular/core';
import {AlertController, Events, NavController, NavParams} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html'
})
export class CommentPage {
  public post: any;
  private commentElement = {
    body : '',
    canComment : true,
  }
  constructor(public nav: NavController, public postService: PostService,public navParams : NavParams,public events : Events,
              public alertCtrl : AlertController) {

    this.post = this.navParams.get('post');
    this.events.subscribe('new-comment',()=>{
      this.updateActivity();
    });
    this.events.subscribe('delete-comment',()=>{
      this.updateActivity();
    })
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


  updateActivity(){
   this.postService.getFeed(this.post.id).then(data=>{
     this.commentElement.body='';
     this.post=data['data'];

   })
  }

  commentActivity(post) {
      this.postService.commentActivity(post,this.commentElement).then(data=>{
        console.log(data,'SUCCESS');
        this.events.publish('new-comment')
      },err=>{
        console.log(err,'ERR');
      })
    }

  showDeleteCommentDialog(comment){
    let confirmDelComm = this.alertCtrl.create({

      message: 'voulez-vous vraiment supprimer ce commentaire?',
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
            this.deleteComment(comment);
          }
        },
      ]
    });

     if(comment.can_delete) {
       confirmDelComm.present();
     }
  }

  deleteComment(comment){
    this.postService.deleteComment(comment,this.post).then(res=>{
      console.log(JSON.stringify(res),'OK');
      this.events.publish('delete-comment');
    },err=>{
      console.log(JSON.stringify(err),'ERR');
    })
  }
  likeComment(comment){
    console.log('coment liked');
  }
}
