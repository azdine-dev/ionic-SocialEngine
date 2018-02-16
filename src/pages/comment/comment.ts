import {Component} from '@angular/core';
import {AlertController, Events, NavController, NavParams, ToastController} from 'ionic-angular';
import {PostService} from '../../services/post-service';
import {UserPage} from '../user/user';
import {AlbumService} from "../../services/album-service";
import {CoreService} from "../../services/core-service";

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
  private refreching : any;
  item_type : any;
  item_id:any;
  private albumComments  : Array<{}>;
  private comments :Array<any>;
  private commentElement = {
    body : '',
    canComment : true,
  };
  private albumPhotos : Array<{}>;
  constructor(public nav: NavController, public postService: PostService,public navParams : NavParams,public events : Events,
              public alertCtrl : AlertController, public albumService :AlbumService,private toastCtrl:ToastController,private coreService: CoreService) {


    this.post = this.navParams.get('post');
    this.item_type = this.navParams.get('item_type');
    this.item_id = this.navParams.get('item_id');
    this.getComments();
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

  getComments(){
    this.refreching = true;
  this.coreService.getComments(this.item_type,this.item_id).then(res=>{
    this.comments = res['data'];

    this.refreching = false;
  })
  }

  toggleLikeComment(comment) {
    console.log(comment.is_liked,'weeeeeez');
    if(comment.is_liked) {
      this.unLikeComment(comment)
    } else {
      this.likeComment(comment);
    }

    comment.is_liked = !comment.is_liked
  }

  // on click, go to user timeline
  viewUser(user) {
    this.nav.push(UserPage, {ownerId: user.id})
  }


  updateActivity(post) {
        this.coreService.getComments(this.item_type,this.item_id).then(data => {
          this.commentElement.body = '';
          this.comments = data['data'];

        });
  }
  commentActivity(post) {
      this.coreService.postComment(this.item_type,this.item_id,this.commentElement.body).then(data=>{
        this.events.publish('new-comment');
        console.log('comment-activity');
      },err=>{
      })
    }

  showDeleteCommentDialog(comment){
    let confirmDelComm = this.alertCtrl.create({

      title: 'supprimer ce commentaire?',
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
    this.post.type= this.item_type;
    this.postService.deleteComment(comment,this.post).then(res=>{
      this.events.publish('delete-comment');
    },err=>{
      this.presentToast(err.error.data.message,'middle');
    })
  }
  likeComment(comment){
    comment.total_like++;
    this.coreService.likeComment(this.item_type,this.item_id,comment.id).then(res=>{

    })
  }
unLikeComment(comment){
  comment.total_like--;
  this.coreService.unlikeComment(this.item_type,this.item_id,comment.id).then(res=>{

  })
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

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: position,
      dismissOnPageChange: true
    });
    toast.present();

  }
}
