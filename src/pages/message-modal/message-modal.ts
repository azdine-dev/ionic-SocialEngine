import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {MessageService} from "../../services/message-service";
import {MessageCreatePage} from "../message-create/message-create";

/**
 * Generated class for the MessageModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
})
export class MessageModalPage {
  private messageId;
  private conversation: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private messageService: MessageService,
  private events :Events,private toastCtrl:ToastController,private viewCtrl:ViewController) {
    this.messageId = this.navParams.get('messageId');
    console.log(this.messageId, 'MESSAGEID')
    this.getConversationDetails();
    this.listenToMessageEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidzrzerLosad MessageModalPage');
  }

  getConversationDetails() {
    this.messageService.getMessageDetail(this.messageId).then(res => {
      this.conversation = res['data'];
    }, err => {
      console.log(JSON.stringify(err));
    })
  }

  getDefaultImage(image) {
    image.src = 'assets/img/user.png';
  }

  replyToMessage(conversation) {
    this.navCtrl.push(MessageCreatePage, {
      selectedUesrs: conversation.recipients,
      subject: conversation.title,
      messageId: conversation.id,

    })
  }

  listenToMessageEvents(){
   this.events.subscribe('message-create',()=>{
     this.getConversationDetails();
   })
  }
  deleteMessage(messageId){
    this.messageService.deleteMessage(messageId).then(data=>{


      // this.events.publish('message-delete');
      let toast= this.presentToast(data['data'].message,'middle');
      toast.present();
      toast.onDidDismiss(()=>{
        // this.events.publish('message-delete');
        this.viewCtrl.dismiss();
        this.viewCtrl.onDidDismiss(()=>{
          this.events.publish('message-delete');
        })
      })




    },err=>{
      let toast = this.presentToast(err.error.data.message);
      toast.present();
    });
  }

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: position,
      dismissOnPageChange: true
    });
    return toast;
  }
}
