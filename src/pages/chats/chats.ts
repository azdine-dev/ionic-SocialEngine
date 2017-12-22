import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ChatService} from '../../services/chat-service';
import {ChatDetailPage} from '../chat-detail/chat-detail';
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

  constructor(public nav: NavController, public chatService: ChatService) {
    // get sample data only
    this.chats = chatService.getAll();
  }

  viewChat(id) {
    this.nav.push(ChatDetailPage, {id: id});
  }
}