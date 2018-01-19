import {Component} from '@angular/core';
import {AlertController, Events, NavController, NavParams} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';
import {AlbumService} from "../../services/album-service";

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
  private albumComments  : Array<{}>;
  private commentElement = {
    body : '',
    canComment : true,
  };
  private albumPhotos : Array<{}>;
  constructor(public nav: NavController, public postService: PostService,public navParams : NavParams,public events : Events,
              public alertCtrl : AlertController, public albumService :AlbumService) {


    this.post = this.navParams.get('post');
    this.init(this.post.type);
    this.listenToActionEvents();

  }

  init(type){
    switch(type){
      case 'album' :{
        this.getAlbumPhotos(this.post.id);
        this.getAlbumComments(this.post.id);
        console.log('TRUE');
        break;
      }

    }
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


  updateActivity(post) {
    switch (post.type) {
      case 'activity_action': {
        this.postService.getFeed(this.post.id).then(data => {
          this.commentElement.body = '';
          this.post = data['data'];

        });
        break;
      }
      case 'album':{
        this.postService.getComents(post.type,post.id).then(data => {
         this.albumComments = data['data'];
          this.commentElement.body = '';

        });
        break;
      }
     }

  }
  commentActivity(post) {
      this.postService.commentActivity(post,this.commentElement).then(data=>{
        this.events.publish('new-comment')
      },err=>{
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

  getAlbumPhotos(albumId){
    this.albumService.getAlbumPhotos(albumId).then(res=>{
      this.albumPhotos = res['data'].photos;
      console.log('SUCCESS');
    },err=>{
      console.log('ERR')
    })
  }

  listenToActionEvents(){
    this.events.subscribe('new-comment',()=>{
      this.updateActivity(this.post);
    });
    this.events.subscribe('delete-comment',()=>{
      this.updateActivity(this.post);
    })
  }

  getAlbumComments(albumId){
    this.postService.getComents('album',albumId).then(data => {
      this.albumComments = data['data'];
      console.log('COMMENTS ON ALBUM');
      this.commentElement.body = '';

    },err=>{
      console.log(JSON.stringify(err));
    });
  }
  getDefaultImage(image,contact){
    image.src = 'assets/img/user.png';
  }
}
