import { Component } from '@angular/core';
import {
  IonicPage, LoadingController, NavController, NavParams, Popover, PopoverController,
  ToastController, ViewController
} from 'ionic-angular';
import {OptionsPage} from "../options/options";
import {UserService} from "../../services/user-service";
import {FormControl} from "@angular/forms";
import {consoleTestResultHandler} from "tslint/lib/test";
import {MessageService} from "../../services/message-service";

/**
 * Generated class for the MessageCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-message-create',
  templateUrl: 'message-create.html',
})
export class MessageCreatePage {
  private messageData = {
    from : '',
    to:'',
    title:'',
    body:'',
    toUser :'',

  };
  private messageAttachment = {
    type:'',
    photo_id :'',
    video_id :'',
    uri :'',
    thumb :'',
    title:'',
    description :'',

  };
  searchUsersControl : FormControl;
  private selectedUesrs :Array<any>;
  private userSession =localStorage.getItem('user-id');


  constructor(public navCtrl: NavController, public navParams: NavParams,private popover :PopoverController,private userService: UserService,
  private messageService :MessageService,private loadingCtrl :LoadingController,private toastCtrl :ToastController,
  private viewCtrl :ViewController) {
    this.searchUsersControl = new FormControl();
    this.selectedUesrs = new Array<any>();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageCreatePage');
  }

  getPossibleUesr(myevent){
       console.log(this.messageData.to);

      this.userService.getAllMembers(this.messageData.to).then(res=>{
        let data = {
          type : 'users',
          users : res['data']
        };
        let result = res['data'];
        if(result.length >0 && this.selectedUesrs.length <10 ){
        let popover = this.cretePopover(myevent,data);
        popover.onDidDismiss(data=>{
          if(data  && !this.arrayInclude(this.selectedUesrs,data.id)){
            this.selectedUesrs.push(data);
          }

        })
        }
      })
  }


  cretePopover(myevent,data){
    let popover = this.popover.create(OptionsPage,data);
    popover.present({
      ev : myevent,
    });
   return popover;
  }

  removeUser(user){
    let index = this.selectedUesrs.indexOf(user,0);
    if(index > - 1){
      this.selectedUesrs.splice(index,1);
    }

  }

  arrayInclude(array : Array<any>,item){
    let found = false;
     for(let user of array){
       if(user.id == item){
         found = true;
       }
     }
     return found;
  }
  addAttachment(event){
    let pop = this.cretePopover(event,{
      type :'message',
    })
  }

  sendMessage(){
    for(let user of this.selectedUesrs){
      this.messageData.toUser +=user.id+','
    }
    let loader = this.showLoader('envoie en cours');
    loader.present();
    this.messageService.sendNewMessage(this.messageData,false).then(res=>{
      loader.dismiss();
      this.presentToast(res['data'].message);
      this.viewCtrl.dismiss();
    },err=>{
      loader.dismiss();
      this.presentToast(err.error.data.message);
    })


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

}
