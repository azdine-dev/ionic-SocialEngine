import {Component} from '@angular/core';
import {Events, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
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
  messagesTodelete : Array<any>;
  private navBarColor :any;
  private activateDelete:any;

  constructor(public nav: NavController, public chatService: ChatService,public messageService : MessageService,private toastCtrl: ToastController,
  private events : Events,public navParams : NavParams,private viewCtrl :ViewController) {
    // get sample data only
    this.messagesTodelete = new Array<any>();
    if(this.navParams.data) {
      this.navBarColor = this.navParams.get('navBarColor');
      this.activateDelete = this.navParams.get('activateDelete');
      this.type =this.navParams.get('type');
    }
    this.getInbox(this.type);
    this.listenToMessageEvents();
  }

  viewChat(id) {
    this.nav.push(ChatDetailPage, {id: id});
  }

  getInbox(type){
    if(type=='inbox'){
      this.messageService.getInbox(1,10).then(res=>{
        this.inbox = res['data'];
      })
    }else if(type=='outbox'){
      this.messageService.getOutbox(1,10).then(res=>{
        this.inbox = res['data'];
      })
    }

  }

  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }
  toggleMessages(){
    console.log(this.type);
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

  deleteMessage(message){
    let messageIds='';
    for(let i=0;i<this.messagesTodelete.length;i++){
      if(i==this.messagesTodelete.length-1){
        messageIds+=this.messagesTodelete[i];
      }else {
        messageIds+=this.messagesTodelete[i]+',';
      }
    }

    this.messageService.deleteMessage(messageIds).then(data=>{
      this.events.publish('message-delete');
      this.navBarColor = 'primary';
      this.activateDelete = false;
      this.events.publish('message-delete');
      this.presentToast(data['data'].message);

      this.viewCtrl.dismiss();

    },err=>{
      this.presentToast(err.error.data.message);
    });
  }

  removeMessage(message){
    let index = this.inbox.indexOf(message,0);
    if(index>-1){
      this.inbox.splice(index,1);
    }
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

  selectItemTodelete(){
    this.nav.push(ChatsPage,{
      navBarColor : 'gray',
      activateDelete :true,
      type :this.type,
    });
  }

  selectItem(e:any,message){
   if(e.checked){
    this.messagesTodelete.push(message.id);
   }
  }

  listenToMessageEvents(){
    this.events.subscribe('message-delete',()=>{
      this.getInbox(this.type);
    })
  }

}
