import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GroupService} from "../../services/group-service";
import {EventsDetailPage} from "../events-detail/events-detail";
import {GroupDetailPage} from "../group-detail/group-detail";

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  private groups : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private groupService :GroupService) {
    this.getAllGroups();
  }

  getAllGroups(){
    this.groupService.getAllGrroups().then(res=>{
      this.groups = res['data'];
    })


  }
  goToGroupDetails(group){
    this.navCtrl.push(GroupDetailPage,{
      group : group,
    })
  }

}
