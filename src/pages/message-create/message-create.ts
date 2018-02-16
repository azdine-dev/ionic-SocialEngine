import { Component } from '@angular/core';
import {
  Events,
  IonicPage, LoadingController, NavController, NavParams, Popover, PopoverController,
  ToastController, ViewController
} from 'ionic-angular';
import {OptionsPage} from "../options/options";
import {UserService} from "../../services/user-service";
import {FormControl} from "@angular/forms";
import {consoleTestResultHandler} from "tslint/lib/test";
import {MessageService} from "../../services/message-service";
import {InfoPage} from "../info/info";
import {debounceTime} from "rxjs/operators";

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
  private pageNumber = 1;
  private pageLimit =10;
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
  private showUsers =false;
  private reply =false;
  private messageId : any;
  private canSendMessageUser :Array<any>
  constructor(public navCtrl: NavController, public navParams: NavParams,private popover :PopoverController,private userService: UserService,
  private messageService :MessageService,private loadingCtrl :LoadingController,private toastCtrl :ToastController,
  private viewCtrl :ViewController,private events :Events) {
    this.searchUsersControl = new FormControl();
    let selectedUsers = this.navParams.get('selectedUesrs');
    console.log(this.navParams.get('selectedUesrs'),'SELECTED')
    if(!selectedUsers){
      this.selectedUesrs = new Array<any>();
    }else {
      this.selectedUesrs=selectedUsers;
      this.messageData.title=this.navParams.get('subject');
      this.reply=true;
      this.messageId = this.navParams.get('messageId');

      console.log(this.messageId);
    }


  }

  ionViewDidLoad() {
    this.canSendMessageUser = new Array<any>();
    this.searchUsersControl.valueChanges.pipe(
      debounceTime(700)
    ).subscribe(search=>{
      this.getCanSendUsers();
      console.log('wezzz');
    })
  }

  getPossibleUesr(){
    //
    // this.searchUsersControl.valueChanges.pipe(
    //   debounceTime(700)
    // ).subscribe(search=>{
    //   this.userService.getAllMembers(this.messageData.to,this.pageLimit,this.pageNumber).then(res=>{
    //     this.canSendMessageUser = res['data'];
    //     this.showUsers = true;
    //   })
    // })
  }

  getCanSendUsers(){
    if(this.messageData.to ==''){
      this.showUsers =false;
    }else{
      this.userService.getAllMembers(this.messageData.to,this.pageLimit,this.pageNumber).then(res=>{
        this.canSendMessageUser = res['data'];
        this.showUsers = true;
      })
    }

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

  envoyerMessage(){
    if(this.reply){
      this.replyToMessage(this.messageId);
    }else{
      this.sendMessage();
    }
  }

  sendMessage(){
    for(let user of this.selectedUesrs){
      this.messageData.toUser +=user.id+','
    }
    let loader = this.showLoader('envoie en cours');
    loader.present();
    this.messageService.sendNewMessage(this.messageData,false).then(res=>{
      loader.dismiss();
      this.events.publish('message-create');
      this.presentToast(res['data'].message);
      this.viewCtrl.dismiss();
    },err=>{
      loader.dismiss();
      this.presentToast(err.error.data.message);
    })


  }

  replyToMessage(messageId){
    for(let user of this.selectedUesrs){
      this.messageData.toUser +=user.id+','
    }
    let loader = this.showLoader('envoie en cours');
    loader.present();
    this.messageService.sendMessageReply(this.messageData,messageId).then(res=>{
      loader.dismiss();
      this.events.publish('message-create');
      this.presentToast('Envoie avec succés');

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

  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }
  selectItem(contact){
    console.log(contact);
    this.showUsers=false;
    this.selectedUesrs.push(contact);
    this.messageData.to='';
  }
}
