import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {UserPage} from '../user/user';


@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {

  public contacts: any;
  public members : any;
  constructor(public nav: NavController, public userService: UserService) {
    this.contacts = userService.getAll();
    this.getAllMembers();

  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }

  getAllMembers(){
      this.userService.getAllMembers().then((result) =>{
       this.members = result["data"];

       for( let member of this.members){
          Object.assign(member, {
            face : 'assets/img/thumb/ben.png',
            groupe : 'Family',

          })
       }

      });
  }
}
