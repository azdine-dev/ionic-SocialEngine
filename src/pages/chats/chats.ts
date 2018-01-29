import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {ChatService} from '../../services/chat-service';
import {ChatDetailPage} from '../chat-detail/chat-detail';
import {MessageService} from "../../services/message-service";
import {MessageCreatePage} from "../message-create/message-create";
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage {
  public chats: any;
  private pageTitle ='Principale'
  private type='inbox';
  private inbox : Array<{}>;
  private outbox : Array<{}>;
  searching :any = false;
  searchTerm: string = '';

  constructor(public nav: NavController, public chatService: ChatService,public messageService : MessageService,private toastCtrl: ToastController) {
    // get sample data only
    this.chats = chatService.getAll();
    this.getInbox(this.type);
  }

  viewChat(id) {
    this.nav.push(ChatDetailPage, {id: id});
  }

  getInbox(type){
      this.messageService.getInbox(1,10).then(res=>{
        this.inbox = res['data'];
      })
  }

  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }
  toggleMessages(){
    if(this.type=='inbox'){
      this.messageService.getOutbox(1,10).then(res=>{
        this.inbox = res['data'];
        this.type='outbox';
        this.pageTitle ='Messages envoyés'
      },err=>{
        console.log('err',JSON.stringify(err));
      })
    }else if(this.type=='outbox'){
      this.messageService.getInbox(1,10).then(res=>{
        this.inbox = res['data'];
        this.type='inbox';
        this.pageTitle ='Principale'
      },err=>{
        console.log('err',JSON.stringify(err));
      })
    }
  }

  searchMessages(){
    this.searching=true;
    this.messageService.searchMessage(this.searchTerm).then(res=>{
      this.searching =false;
      this.inbox = res['data'];
    },err=>{
      this.searching = false;
      this.presentToast(err.error.data.message);
    })
  }

  composeMessage(){
    this.nav.push(MessageCreatePage);
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
