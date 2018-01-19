import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {UserPage} from '../user/user';


@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  public contacts: any;
  public members : Array<{}>;
  private pageNumber = 1;
  constructor(public nav: NavController, public userService: UserService) {
    this.contacts = userService.getAll();
    this.getAllMembers();

  }
  /***assets/img/thumb/ben.png**/

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }

  getAllMembers(){
      this.userService.getAllMembers(10,this.pageNumber).then((result) =>{
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
  refrechUser(refrecher,page){
    page++;
    setTimeout(()=>{
      refrecher.complete();
    },500)
    this.userService.getAllMembers(10,page).then((result) =>{
      this.members.push(result["data"]);
    });
  }
  approxItemHeight//
}
