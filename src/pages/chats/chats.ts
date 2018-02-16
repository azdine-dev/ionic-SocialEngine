import {Component} from '@angular/core';
import {Events, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {ChatService} from '../../services/chat-service';
import {ChatDetailPage} from '../chat-detail/chat-detail';
import {MessageService} from "../../services/message-service";
import {MessageCreatePage} from "../message-create/message-create";
import {MessageModalPage} from "../message-modal/message-modal";
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
  private pageTitle ='Boite de Réception';
  private messageDefault = 'inbox';
  private type='inbox';
  private inbox : Array<{}>;
  private outbox : Array<{}>;
  private result = true;
  private showSegment =true;
  searching :any = false;
  searchTerm: string = '';
  messagesTodelete : Array<any>;
  private navBarColor :any;
  private activateDelete:boolean;

  constructor(public nav: NavController, public chatService: ChatService,public messageService : MessageService,private toastCtrl: ToastController,
  private events : Events,public navParams : NavParams,private viewCtrl :ViewController) {
    // get sample data only
    this.messagesTodelete = new Array<any>();
    this.activateDelete=false;
    if(this.navParams.data) {
      this.navBarColor = this.navParams.get('navBarColor');
      this.messageDefault = this.navParams.get('messageDefault');
      this.type =this.navParams.get('type');
      this.showSegment = this.navParams.get('showSegment');
      if(this.showSegment==null){
        this.showSegment = true;
      }
      if(!this.messageDefault){
        this.messageDefault ='inbox';
      }
    }
    this.getInbox(this.type);
    this.listenToMessageEvents();
    console.log(this.messagesTodelete,'Mssg To ddelete')
  }

  viewChat(id) {
    this.nav.push(ChatDetailPage, {id: id});
  }

  getInbox(type){
    console.log(type,'TYPE');
    this.searching = true;
    if(type!='outbox' ){

      this.pageTitle = 'Boite de Réception';
      this.messageService.getInbox(1,10).then(res=>{
        this.searching = false;
        this.inbox = res['data'];
      },err=>{
        this.searching = false;

      })
    }else if(type=='outbox'  && this.result){
      this.searching = true;
      this.pageTitle = 'Messages Envoyés';
      this.messageService.getOutbox(1,10).then(res=>{
        this.searching = false
        this.outbox = res['data'];

      },err=>{
        this.searching = false
      })
    }

  }

  getDefaultImage(image){
    image.src = 'assets/img/user.png';
  }
  // toggleMessages(){
  //   console.log(this.type);
  //   if(this.type=='inbox'){
  //     this.messageService.getOutbox(1,10).then(res=>{
  //       this.inbox = res['data'];
  //       this.type='outbox';
  //       this.pageTitle ='Messages envoyés'
  //     },err=>{
  //       console.log('err',JSON.stringify(err));
  //     })
  //   }else if(this.type=='outbox'){
  //     this.messageService.getInbox(1,10).then(res=>{
  //       this.inbox = res['data'];
  //       this.type='inbox';
  //       this.pageTitle ='Principale'
  //     },err=>{
  //       console.log('err',JSON.stringify(err));
  //     })
  //   }
  // }

  searchMessages(){
    this.searching=true;
    this.messageService.searchMessage(this.searchTerm).then(res=>{
      this.searching =false;
      this.inbox = res['data'];
    },err=>{
      this.searching = false;

      let toast = this.presentToast(err.error.data.message);
      toast.present();
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

  removeMessage(message){
    let index = this.inbox.indexOf(message,0);
    if(index>-1){
      this.inbox.splice(index,1);
    }
  }

  composeMessage(){
    this.nav.push(MessageCreatePage);
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

  selectItemTodelete(){
    this.nav.push(ChatsPage,{
      navBarColor : 'gray',
      activateDelete :true,
      type :this.type,
      messageDefault : this.type
    });
  }

  selectItem(e:any,message){

      if(e.checked){
       this.navBarColor ='gray';
       this.activateDelete =true;
       this.events.publish('activate-delete')
       this.messagesTodelete.push(message.id);



   }else {
     let index =this.messagesTodelete.indexOf(message.id);
     console.log(index,'INDEX');
     if(index >-1){
       this.messagesTodelete.splice(index,1);
     }

   }
  }

  listenToMessageEvents(){
    this.events.subscribe('message-delete',()=>{
      this.getInbox(this.type);
    })
  }

  geOutboxMessages(){
    this.searching = true;
    this.pageTitle ='Messages envoyés';
    this.messageService.getOutbox(1,10).then(res=>{
      this.searching=false;
      this.outbox = res['data'];
      this.type='outbox';


    },err=>{
      console.log('err',JSON.stringify(err));
      this.searching=false;
    })
  }
  geInboxMessages(){
    this.searching = true;
    this.pageTitle ='Boite de Réception';
    this.messageService.getInbox(1,10).then(res=>{
      this.searching=false;
      this.inbox = res['data'];
      this.type='inbox';
    },err=>{
      this.searching=false;
    })
  }
  goToMessageDetails(message){
    console.log(message.id);
    this.nav.push(MessageModalPage,{
      messageId:message.id,
    })
    console.log('EWA LWEEEZA')
  }

  toggleActivateDelete(){
    this.activateDelete = !this.activateDelete;
  }
}
