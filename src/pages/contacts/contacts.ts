import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {UserPage} from '../user/user';
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";


@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  public contacts: any;
  public members : Array<any>;
  private pageNumber = 1;
  private lastPage = false;
  searching :any = false;
  searchControl :FormControl;

  searchTerm: string = '';
  constructor(public nav: NavController, public userService: UserService) {
    this.searchControl = new FormControl();

  }

  ionViewDidLoad(){
    this.getAllMembers();
    this.searchControl.valueChanges.pipe(
      debounceTime(700),

    ).subscribe(search=>{
       this.getAllMembers();
      }
    )
  }

  // on click, go to user timeline
  viewUser(user) {
    console.log(user);
    this.nav.push(UserPage, {owner: user})
  }

  getAllMembers(){
    this.searching=true;
      this.userService.getAllMembers(this.searchTerm,10,1).then((result) =>{
        this.searching=false;
       this.members = result["data"];
      });
  }

  getDefaultImage(image,contact){
    if(contact.gender_label == 'Female'){
      image.src = 'assets/img/female.png';
    }else{
      image.src = 'assets/img/user.png';
    }

  }

  loadUsers(refrecher){
    if(!this.lastPage){
      let page = this.pageNumber+1;
      this.userService.getAllMembers(this.searchTerm,10,page).then(res=>{
        if(res['data'].length >0){
          this.members=this.members.concat(res['data']);
          this.pageNumber = this.pageNumber+1;
          refrecher.complete();
        }else{
          this.lastPage=true;
          refrecher.complete();
        }
      },err=>{
        refrecher.complete();
      })
    } else{
      refrecher.complete();
    }

  }

  searchUsers(){
    this.searching=true;
    this.userService.filterUsers(this.searchTerm).then(res=>{
      this.searching =false;
      this.members = res['data'];
    },err=>{

    })
  }
   filterUsers(){
      this.members= this.userService.filterItems(this.members,this.searchTerm);
    }
}
