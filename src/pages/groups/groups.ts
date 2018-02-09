import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GroupService} from "../../services/group-service";
import {EventsDetailPage} from "../events-detail/events-detail";
import {GroupDetailPage} from "../group-detail/group-detail";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";

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
  searching :any = false;
  searchControl :FormControl;
  searchTerm: string = '';
  private userId :any;
  private user :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private groupService :GroupService) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad(){
    this.userId = this.navParams.get('userId');
    if(!this.userId){
      this.userId ='';
    }
    this.user = this.navParams.get('user');
    this.getAllGroups(this.userId);
    this.searchControl.valueChanges.pipe(
      debounceTime(700),

    ).subscribe(search=>{
        this.getAllGroups(this.userId);
      }
    )
  }

  getAllGroups(userId){
    this.searching = true;
    this.groupService.getAllGrroups(this.searchTerm,userId).then(res=>{
      this.groups = res['data'];
      this.searching = false;
    })


  }
  goToGroupDetails(group){
    this.navCtrl.push(GroupDetailPage,{
      groupId : group.id,
    })
  }
  doRefreshGroups(refrecher){
    refrecher.complete();
  }
}
