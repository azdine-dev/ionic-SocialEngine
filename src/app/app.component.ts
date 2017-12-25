import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

// import page
import {HomePage} from '../pages/home/home';
import {UserPage} from '../pages/user/user';
import {RecentPostsPage} from '../pages/recent-posts/recent-posts';
import {NotificationsPage} from '../pages/notifications/notifications';
import {WallPostsPage} from '../pages/wall-posts/wall-posts';
import {ContactsPage} from '../pages/contacts/contacts';
import {SettingPage} from '../pages/setting/setting';
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from '../pages/register/register';
import {ChatsPage} from '../pages/chats/chats';
import {ExpressionPage} from "../pages/expression/expression";

@Component({
  templateUrl: 'app.component.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public nav: any;

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'Recent posts',
      icon: 'ios-list-box-outline',
      count: 0,
      component: RecentPostsPage
    },
    {
      title: 'Message',
      icon: 'ios-mail-outline',
      count: 2,
      component: ChatsPage
    },
    {
      title: 'Notifications',
      icon: 'ios-notifications-outline',
      count: 5,
      component: NotificationsPage
    },
    {
      title: 'Wall posts',
      icon: 'ios-browsers-outline',
      count: 0,
      component: WallPostsPage
    },
    {
      title: 'Contacts',
      icon: 'ios-person-outline',
      count: 0,
      component: ContactsPage
    },
    {
      title: 'Setting',
      icon: 'ios-settings-outline',
      count: 0,
      component: SettingPage
    },
    {
      title: 'Logout',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
}

