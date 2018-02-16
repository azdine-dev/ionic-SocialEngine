import {Component, OnInit} from '@angular/core';
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
import {ShareModalPage} from "../share-modal/share-modal";
import {MediathequePage} from "../mediatheque/mediatheque";
import {EventsPage} from "../events/events";
import {GroupsPage} from "../groups/groups";
import {BlogsPage} from "../blogs/blogs";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage implements OnInit  {
  defultImage ='/assets/img/default-image.png'
  private infoUser ='';
  private endOfFeed : boolean = false;
  public user :any;
  public owner : any;
  private ownerId : any;
  private friendColor : any;
  private userSession =localStorage.getItem('user-id');
  public userFeed :{
    next_id   : number,
    endOfFeed : any;
    items     : Array<any>;
  }
  private userFeed2 :{
    next_id   : number,
    endOfFeed : any;
    items : Array<any>;
  }
  private videoFeedMap : Map <number,SafeUrl> = new Map <number,SafeUrl>();

  constructor(public nav: NavController, public navParams: NavParams, public userService: UserService,
              public postService: PostService,public videoService : VideoService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events,
              public loadingCtrl : LoadingController,public toastCtrl : ToastController,public popover : PopoverController) {
    this.userFeed = {
      next_id   : 0,
      endOfFeed : false,
      items : new Array<any>(),
    };
    this.userFeed2 = {
      next_id   : 0,
      endOfFeed : false,
      items : new Array<any>(),
    };


  }
  ngOnInit(){
    this.owner = this.navParams.get('owner');
    this.ownerId = this.navParams.get('ownerId');
    this.getUserProfileInfo(this.ownerId);
    this.getUserFeedV2();
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
    if(this.ownerId != user.id)
    this.nav.push(UserPage, {ownerId: user.id})
  }

  // on click, go to post detail
  commentPost(post) {
    console.log(post.type,'POST TYPE');
    let cmntModal = this.modalCtrl.create(CommentPage,
      {
        item_type : 'activity_action',
        item_id : post.id,
        post:post,
      });
    cmntModal.present();
  }

  getUserProfileInfo(userId){
      this.userService.getUserInfo(userId).then(data=>{
        this.user = data['data'];
      },err=>{
        this.presentToast('failed loading profile','middle');
      })
  }
  getUserFeed() {
    this.postService.getUserFeed(this.ownerId).then((result) => {
      this.userFeed = result["data"]["items"];
      // this.getFeedAttchmentVideos(this.userFeed);
    },(err) => {
    });

  }
  getUserFeedV2(refresher ?) {

    if (refresher) {
      if (typeof refresher != "boolean")
        setTimeout(() => {
          refresher.complete();
        }, 300);

      this.postService.getUserFeed(this.ownerId,10).then(result => {
        this.userFeed.endOfFeed = result['data']['end_of_feed'];
        this.userFeed.next_id = result['data']['next_id'];
        this.userFeed.items = result['data']['items'];
        this.assignClickedValues(this.userFeed.items);
      })
    }
    else {

      this.postService.getUserFeed(this.ownerId,10).then(result => {
        this.userFeed.endOfFeed = result['data']['end_of_feed'];
        this.userFeed.next_id = result['data']['next_id'];
        this.userFeed.items = result['data']['items']
        this.assignClickedValues(this.userFeed.items);

      });

    }
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
      this.getUserFeedV2();
    });
    this.events.subscribe('new-comment',()=>{
      this.getUserFeedV2();
    });
    this.events.subscribe('delete-comment',()=>{
      this.getUserFeedV2();
    });
    this.events.subscribe('new-activity',()=>{
      this.getUserFeedV2();
    });
      this.events.subscribe('new-state',()=>{
        this.getUserProfileInfo(this.ownerId);
      });

    }


  getUserVideos(user){
    this.nav.push(MediathequePage,{
      userId: user.id,
      user : user,
    });
  }
  getUserEvents(user){
    this.nav.push(EventsPage,{
      userId: user.id,
      user : user,
    });
  }
  getUserGroups(user){
    this.nav.push(GroupsPage,{
      userId: user.id,
      user : user,
    });
  }
  getUserBlogs(user){
    this.nav.push(BlogsPage,{
      userId: user.id,
      user : user,
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

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: position,
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
     if(user.block_status == 'no_block'){
       this.showFriendsDialog('voulez-vous bloquer '+user.title+'?',user,'blockUserService','Bloquer le membre');
     }
     else if(user.block_status =='is_blocked'){
       this.showFriendsDialog('débloquer '+user.title+'?',user,'unblockUserService','Débloquer le membre');
     }
  }
  updatePicture(myevent,owner){
   let popover = this.popover.create(OptionsPage,{
     owner : this.owner,
     type :'camera'
   });
   popover.present({

     ev : myevent,
   });
  }

  doRefreshFeed(refrecher){
    this.getUserFeedV2(refrecher);
  }


  sharePost(post){
    console.log(post.attachments[0],'ATTAChment');
    let cmntModal = this.modalCtrl.create(ShareModalPage,{
      item : post,
      type : 'activity_action',
    });
    cmntModal.present();
  }

  trustResourceUrl(post){
    let url ='http://intaliq.novway.com'
    return this.sanitizer.bypassSecurityTrustResourceUrl(post.video_source);
  }


  playVideo(post){
    this.videoService.getVideo(post.attachments[0].id).then(res=>{
      post.video_source = res['data']['video_src'];
      post.clicked =true;
      this.stopOtherVideos(post);
    },err=>{
      this.presentToast('could not play video','middle');
    })
  }

  stopOtherVideos(exceptVideo){
    let index = this.userFeed.items.indexOf(exceptVideo,0);
    for(let i=0;i<this.userFeed.items.length;i++){
      if(i!=index){
        this.userFeed.items[i]['clicked'] =false;
      }
    }
  }

  assignClickedValues(array :Array<{}>){
    for(let item of array){
      Object.assign(item,{
        clicked :false,
        video_source :'',
      })
    }
  }
  loadFeed2(refrecher){
    // if(this.userFeed && this.userFeed.length>0){
    //   let maxid = this.userFeed[this.userFeed.length-1].id;
    //   setTimeout(()=>{
    //     this.presentToast('end of feed');
    //     refrecher.complete();
    //   },300);
    // }else{
    //   refrecher.complete();
    // }

    // if(this.endOfFeed){

    // }
    // else {
    //
    //   this.postService.getUserFeed(this.owner.id,10, maxid).then(res => {
    //     this.endOfFeed = res['data']['end_of_feed'];
    //     this.userFeed2 = res['data']['items'];
    //     this.assignClickedValues(this.userFeed2);
    //     this.userFeed2.shift();
    //     this.userFeed = this.userFeed2.concat(this.userFeed2);
    //     refrecher.complete();
    //
    //   },err=>{
    //     this.presentToast(JSON.stringify(err));
    //     setTimeout(()=>{
    //       refrecher.complete();
    //     },300);
    //   })
    // }
  }


   loadInfiniteFeed(refrecher){
      if(this.userFeed.endOfFeed){
        refrecher.complete();
      }else{
        let maxid = this.userFeed.next_id;
        this.postService.getUserFeed(this.ownerId,10, maxid).then(result=>{
           this.userFeed2.endOfFeed = result['data']['end_of_feed'];
           this.userFeed2.next_id = result['data']['next_id']
           this.userFeed2.items = result['data']['items'];
           this.assignClickedValues(this.userFeed2.items);
           this.userFeed.items = this.userFeed.items.concat(this.userFeed2.items);
           this.userFeed.endOfFeed=this.userFeed2.endOfFeed;
           this.userFeed.next_id=this.userFeed2.next_id;
           refrecher.complete();

        },err=>{
          this.presentToast('error');
          refrecher.complete();
        })
      }
   }

  openLink(url){
    console.log(url,'URL');
    window.open(url)
  }
}
