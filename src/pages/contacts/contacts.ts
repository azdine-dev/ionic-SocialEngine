import {Component, Input} from '@angular/core';
import {LoadingController, NavController, ToastController} from 'ionic-angular';
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
  constructor(public nav: NavController, public userService: UserService,private toastCtrl :ToastController,private loadingCtrl : LoadingController) {
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
    this.nav.push(UserPage, {ownerId: user.id})
  }

  getAllMembers(){
    this.searching=true;
      this.userService.getAllMembers(this.searchTerm,10,1).then((result) =>{
        this.searching=false;
       this.members = result["data"];
      },err=>{
        this.searching=true;
        this.presentToast(err.data.message,'middle');
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

  //////////////////////////////////////

  showLoader(message?){
    let load = this.loadingCtrl.create({
      content : message,
    });

    return load;
  }

  presentToast(msg,position:string='bottom') {
    let toast = this.toastCtrl.create({
      message: msg,
      duration : 2000,
      position: position,
      dismissOnPageChange: true
    });
    toast.present();

  }

}
