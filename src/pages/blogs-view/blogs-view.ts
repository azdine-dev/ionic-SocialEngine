import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {BlogsService} from "../../services/blogs-service";
import {DomSanitizer} from "@angular/platform-browser";
import {ShareModalPage} from "../share-modal/share-modal";
import {PostService} from "../../services/post-service";
import {CommentPage} from "../comment/comment";

/**
 * Generated class for the BlogsViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blogs-view',
  templateUrl: 'blogs-view.html',
})
export class BlogsViewPage {
  private userSession =localStorage.getItem('user-id');
  public blogId :any;
  public blog : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private blogService :BlogsService,
              private sanitizer : DomSanitizer,public modalCtrl : ModalController,private postSevice :PostService) {

    this.blogId = this.navParams.get('blogId');
    this.getBlog();

  }
  getBlog(){
    this.blogService.getBlog(this.blogId).then(res=>{

      this.blog = res['data'];

    },err=>{
    })
  }
  getBlogInfo(){
    this.blogService.getBlog(this.blog.id).then(res=>{
      this.blog = res['data'];
    },err=>{

    })
  }

  processHtmlContent(html:string){
    let baseUrl = 'http://intaliq.novway.com';

    html.replace(/<img src="([^"]+)">/,'<img src="'+baseUrl+'$1">');
    html.slice(36);
    console.log(html.search(/<img src="([^"]+)">/),'HTML');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  shareBlog(blog){
    let blogShare = this.modalCtrl.create(ShareModalPage,{
      item :blog,
      type :'blog',
    });
    blogShare.present();
  }
  toggleLike(blog) {
    // if user liked
    if(blog.is_liked) {
      this.unlikeBlog(blog);

    } else {
      this.likeBlog(blog);
    }
    blog.is_liked = !blog.is_liked
  }

  commentBlog(post) {
    let cmntModal = this.modalCtrl.create(CommentPage,{post : post});
    cmntModal.present();
  }

  likeBlog(blog){
    blog.total_like++;
    this.postSevice.likePost(blog.id,blog.type).then(res=>{
      console.log('Post liked');
    })
  }
  unlikeBlog(blog){
    blog.total_like--;
    this.postSevice.unlikePost(blog.id,blog.type).then(res=>{
      console.log('POST UNLIKED');
    })
  }
}
