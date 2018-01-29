import {Component} from '@angular/core';
import {
  AlertController, Events, LoadingController, ModalController, NavController, NavParams, PopoverController,
  ToastController
} from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {PostService} from '../../services/post-service';
import {PostPage} from '../post/post';
import {VideoService} from "../../services/video-service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {CommentPage} from "../comment/comment";
import {InfoPage} from "../info/info";
import {AlbumPage} from "../album/album";
import {FriendsPage} from "../friends/friends";
import {OptionsPage} from "../options/options";

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
  defultImage ='/assets/img/default-image.png'
  private infoUser ='';
  public user ={
  };
  public owner : any;
  private friendColor : any;
  private userSession =localStorage.getItem('user-id');
  private userFeed : Array<{}>;
  private videoFeedMap : Map <number,SafeUrl> = new Map <number,SafeUrl>();

  constructor(public nav: NavController, public navParams: NavParams, public userService: UserService,
              public postService: PostService,public videoService : VideoService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events,
              public loadingCtrl : LoadingController,public toastCtrl : ToastController,public popover : PopoverController) {

    this.owner = (navParams.get('owner'));
    this.getUserProfileInfo(this.owner.id);
    this.getUserFeed();
    this.listenToFeedEvents();
    this.infoUser ='infoPer';

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
  viewUser(user) {
    if(this.owner.id != user.id)
    this.nav.push(UserPage, {owner: user})
  }

  // on click, go to post detail
  viewPost(post) {
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post});
    cmntModal.present();
  }

  getUserProfileInfo(userId){
    if(userId == this.userSession){
      this.userService.getAuthorizedUser().then(data=>{
        this.user = data['data'];
      },err=>{
      })
    }
    else{
      this.userService.getUserInfo(userId).then(data=>{
        this.user = data['data'];
      },err=>{
      })
    }

  }
  getUserFeed() {
    this.postService.getUserFeed(this.owner.id).then((result) => {
      this.userFeed = result["data"]["items"];
      // this.getFeedAttchmentVideos(this.userFeed);
    },(err) => {
    });

  }
  getFeedAttchmentVideos(feed) {
    for (let activity of feed) {
      if (activity.attachments.length > 0) {
        if (activity.attachments[0].type == 'video') {

          this.videoService.getEmbedVideo(activity.attachments[0].id).then(res => {
            this.initVideoMap(activity.attachments[0].id, res['data']['code']);
          })

        }

      }
    }
  }

  initVideoMap(videoId,videoCode){

      this.videoFeedMap.set(videoId,this.sanitizer.bypassSecurityTrustHtml(videoCode));

  }

  processHtmlContent(post){
    this.sanitizer.bypassSecurityTrustHtml(post.content);
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

      message: 'voulez-vous vraiment supprimer ce post ?',
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
      this.events.subscribe('new-state',()=>{
        this.getUserProfileInfo(this.owner.id);
      });

    }


  getUserVideos(userId,userName){
    this.nav.push(InfoPage,{
      id: userId,
      name : userName
    });
  }
  getUserFriends(user){
    this.nav.push(FriendsPage,{
      owner: user,
    });
  }
  getUserAlbums(userId,userName){
    this.nav.push(AlbumPage,{
      id: userId,
      name : userName
    });
  }
  getDefaultImage(image,contact){
    image.src = 'assets/img/user.png';
  }

  ///////////////////****FRIENDS OPERATIONS***//////////////////////////////

  getFriendState(contact){
    if(contact.friend_status =='not_friend'){
      return 'ajouter comme contact';
    }
    else if(contact.friend_status =='is_sent_request'){
      return 'Invitation envoyée';
    }
    else if(contact.friend_status =='is_friend'){
      return 'Amis'
    }
    else if(contact.friend_status = 'is_sent_request_by'){
      return 'accepter';
    }
  }

  joinMember(contact){
    console.log(contact.friend_status,'wez');
    switch (contact.friend_status){
      case 'not_friend':{
        this.showFriendsDialog('ajouter a la liste des amis ?',contact,'sendFriendRequest');
        break;
      }
      case 'is_sent_request_by':{
        this.showFriendsDialog('confirmer linvitation ?',contact,'approuveFriendsRequest');
        break;
      }
      case 'is_friend':{
        this.showFriendsDialog('retirer de la liste des amis ?',contact,'removeFromFriendsList');
        break;
      }
      case 'is_sent_request':{
        this.showFriendsDialog('annuler linvitation ?',contact,'cancelFriendRequest');
        break;
      }
    }
  }
  showFriendsDialog(message,contact,handler,title?){
    let confirmDelActivity = this.alertCtrl.create({
      title : title,
      message: message,
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.getHandler(handler,contact);
          }
        }
      ]
    });

    confirmDelActivity.present();
  }

  getHandler(handler,param){
    if(this[handler]){
      this[handler](param);
    }
  }

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();

  }

  sendFriendRequest(contact){
    let load = this.showLoader('demande en cours..');
    load.present();
    this.userService.sendFriendRequest(contact.id).then(data=>{
      load.dismiss();
      this.presentToast(data['data'].message);
      contact.friend_status ='is_sent_request';
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }

  cancelFriendRequest(contact){
    let load = this.showLoader('annulation en cours..');
    load.present();
    this.userService.cancelFriendRequest(contact.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message);
      contact.friend_status = 'not_friend';
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }

  approuveFriendsRequest(contact){
    let load = this.showLoader('approuver la demande..');
    load.present();
    this.userService.approuveFriendRequest(contact.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message);
      contact.friend_status = 'is_friend';
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }

  removeFromFriendsList(contact){
    let load = this.showLoader('retirer de la liste des amis');
    load.present();
    this.userService.removeFromFriendsList(contact.id).then(res=>{
      load.dismiss();
      this.presentToast(res['data'].message);
      contact.friend_status = 'not_friend';
    },err=>{
      load.dismiss();
      this.presentToast(err.error.data.message);
    })
  }


  //////////////////////////////******OTHER OPERATION ***//////////////////////

  blockUserService(user){
    let load = this.showLoader('operation en cours ..');
    load.present();
     this.userService.blockUsesr(user.id).then(res=>{
       load.dismiss();
       user.block_status='is_blocked'
       this.presentToast(res['data'].message);
     },()=>{
       load.dismiss();
     })
  }
  unblockUserService(user){
    let load = this.showLoader('operation en cours ..');
    load.present();
    this.userService.unBlockUsesr(user.id).then(res=>{
      load.dismiss();
      user.block_status='no_block'
      this.presentToast(res['data'].message);

    },err=>{
      load.dismiss();
      this.presentToast(JSON.stringify(err));
    })
  }


  toggleBlockUser(user){
    console.log(user.block_status);
     if(user.block_status == 'no_block'){
       this.showFriendsDialog('voulez-vous bloquer '+user.title+'?',user,'blockUserService','Bloquer le membre');
     }
     else if(user.block_status =='is_blocked'){
       this.showFriendsDialog('débloquer '+user.title+'?',user,'unblockUserService','Débloquer le membre');
     }
  }
  updatePicture(myevent,owner){
   console.log('wzez')
   let popover = this.popover.create(OptionsPage,{
     owner : this.owner,
     type :'camera'
   });
   popover.present({

     ev : myevent,
   });
  }


}
