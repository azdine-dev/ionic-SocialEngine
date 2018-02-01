import { Component } from '@angular/core';
import {
  AlertController, Events, IonicPage, ModalController, NavController, NavParams,
  ViewController
} from 'ionic-angular';
import {PostService} from "../../services/post-service";
import {DomSanitizer} from "@angular/platform-browser";
import {ShareModalPage} from "../share-modal/share-modal";
import {VideoService} from "../../services/video-service";
import {UserService} from "../../services/user-service";
import {CommentPage} from "../comment/comment";

/**
 * Generated class for the VideoViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video-view',
  templateUrl: 'video-view.html',
})
export class VideoViewPage {
  private vid : any;


  constructor(public navParams: NavParams, public userService: UserService,private navCtrl :NavController,
              public postService: PostService,public videoService : VideoService,public sanitizer : DomSanitizer,
              public modalCtrl : ModalController,public alertCtrl :AlertController,public events : Events,private viewCtrl :ViewController) {

    this.vid=this.navParams.get('video');
    this.assignClickedValues(this.vid);
  }


  trustResourceUrl(video){
    return this.sanitizer.bypassSecurityTrustResourceUrl(video.video_src);
  }

  trustHtm(html){
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  playVideo(video){
    video.clicked2=true;

  }



  shareVideo(video){
    console.log(video);
    let cmntModal = this.modalCtrl.create(ShareModalPage,{
      item : video,
      type : 'video',
    });
    cmntModal.present();
  }

  toggleLike(video) {
    // if user liked
    if(video.is_liked) {
      this.unLikeVideo(video);

    } else {
      this.likeVideo(video);
    }
    video.is_liked = !video.is_liked
  }
  unLikeVideo(video){
    video.total_like -- ;
    this.postService.unlikePost(video.id,'video').then((result)=>{
    },(err)=>{
    });
  }
  likeVideo(video){
    video.total_like ++ ;
    this.postService.likePost(video.id,'video').then((result)=>{
    },(err)=>{

    });
  }
  commentVideo(video) {
    let cmntModal = this.modalCtrl.create(CommentPage,{post : video});
    cmntModal.present();
  }

  showDeleteVideoDialog(video){
    let confirmDelActivity = this.alertCtrl.create({

      message: 'voulez-vous vraiment supprimer ce video ?',
      buttons: [

        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deleteVideo(video);
          }
        }
      ]
    });

    confirmDelActivity.present();
  }

  deleteVideo(video){
    this.videoService.deleteVideo(video.id).then(res=>{
      this.events.publish('video-deleted',video);
      this.viewCtrl.dismiss()
    },err=>{

    });
  }

  assignClickedValues(item :any){
      Object.assign(item,{
        clicked2 :false,
      })
  }
}
