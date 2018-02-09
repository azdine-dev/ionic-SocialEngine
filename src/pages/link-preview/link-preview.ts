import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CoreService} from "../../services/core-service";
import {PostService} from "../../services/post-service";

/**
 * Generated class for the LinkPreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-link-preview',
  templateUrl: 'link-preview.html',
})
export class LinkPreviewPage {
  private linkData ={
    uri : '',
    title:'',
    description:'',
    error:'',
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private postService : PostService,private coreService : CoreService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinkPreviewPage');
  }

  loadLinkData(){
    this.linkData.title = '';
    this.linkData.description ='';

    this.coreService.linkPreview(this.linkData.uri).then(res=>{
      this.linkData.title=res['data']['title'];
      this.linkData.description=res['data']['description'];
      this.linkData.error='';
      console.log(this.linkData,'LinkData');
      console.log(res['data'],'DATA')
    },err=>{
      console.log(err,'ERROR');
      this.linkData.error = err.error.data.message;
    })
  }
  validFields(){
    return (this.linkData.uri && !this.linkData.error);
  }
  postLinke(){
   this.postService.postLink(this.linkData).then(res=>{
     console.log('message');
   },err=>{
     console.log(JSON.stringify(err));
   });
  }
}
