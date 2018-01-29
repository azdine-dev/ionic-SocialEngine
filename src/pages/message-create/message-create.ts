import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Popover, PopoverController} from 'ionic-angular';
import {OptionsPage} from "../options/options";
import {UserService} from "../../services/user-service";
import {FormControl} from "@angular/forms";

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
  };
  searchUsersControl : FormControl;
  private selectedUesrs ={
    title :'',
  }
  private userSession =localStorage.getItem('user-id');


  constructor(public navCtrl: NavController, public navParams: NavParams,private popover :PopoverController,private userService: UserService) {
    this.searchUsersControl = new FormControl();
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
        }
        if(res['data'].length >0){
        let popover = this.cretePopover(myevent,data);
        popover.onDidDismiss(data=>{
          this.selectedUesrs
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
}
