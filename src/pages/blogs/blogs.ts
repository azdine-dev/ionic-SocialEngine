import { Component } from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {EventService} from "../../services/event-service";
import {EventEditPage} from "../event-edit/event-edit";
import {EventsDetailPage} from "../events-detail/events-detail";
import {BlogsService} from "../../services/blogs-service";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {BlogsViewPage} from "../blogs-view/blogs-view";

/**
 * Generated class for the BlogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blogs',
  templateUrl: 'blogs.html',
})
export class BlogsPage {
  private defautEvent = 'futur-events';
  private blogs : Array<any>;
  searching :any = false;
  searchControl :FormControl;
  searchTerm: string = '';
  private userId :any;
  private user :any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private blogService: BlogsService,private eventSubscriber: Events,private loadingCtrl :LoadingController,
              private toastCtrl :ToastController ) {
    this.searchControl = new FormControl();
    this.listenToEvents();
  }

  ionViewDidLoad(){
    this.userId  =this.navParams.get('userId');
    this.user =  this.navParams.get('user');

    if(this.userId){
     this.getUserBlogs(this.userId);
    }else{
      this.getBlogs();
    }


    this.searchControl.valueChanges.pipe(
      debounceTime(700),

    ).subscribe(search=>{
      if(this.userId){
        this.getUserBlogs(this.userId);
      }else{
        this.getBlogs();
      }
      }
    )
  }
  getBlogs(){
    this.searching = true;
    this.blogService.getBlogs(this.searchTerm,this.userId).then(res=>{
      this.blogs = res['data'];
      this.searching = false;
    },err=>{
      this.searching = false;
      this.presentToast(err.error.data.message,'middle');
    })
  }
  getUserBlogs(userId){
    this.searching = true;
    this.blogService.getUserBlogs(this.searchTerm,this.userId).then(res=>{
      this.blogs = res['data'];
      this.searching = false;
    },err=>{
      this.searching = false;
      this.presentToast(err.error.data.message,'middle');
    })
  }

  goToBlogDetails(blog){
    console.log(blog.owner,'Blog owner');
    this.navCtrl.push(BlogsViewPage,{
      blogId : blog.id,
    })
  }

  listenToEvents(){
    this.eventSubscriber.subscribe('update-event',()=>{
    });
    this.eventSubscriber.subscribe('event-delete',()=>{
    });
    this.eventSubscriber.subscribe('create-event',()=>{
    });
  }

  createBlog(){
    this.navCtrl.push(BlogsViewPage);
  }

  getDefaultImage(image){
    image.src ='assets/img/user.png';
  }

  /////////////////////////////////////////
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

  doRefreshBlogs(refrecher){
    this.searching = true;
    this.blogService.getBlogs(this.searchTerm,this.userId).then(res=>{
      this.blogs = res['data'];
      this.searching = false;
      refrecher.complete();
    },err=>{
      refrecher.complete();
      this.searching = false;
      this.presentToast(err.error.data.message,'middle');
    })
  }
}
