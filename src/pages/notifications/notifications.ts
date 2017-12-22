import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NotificationService} from '../../services/notification-service';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {
  public notifications: any;

  constructor(public nav: NavController, public notificationService: NotificationService) {
    this.notifications = notificationService.getAll();
  }
}