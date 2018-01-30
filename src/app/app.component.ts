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
import {CommentPage} from "../pages/comment/comment";
import {UserService} from "../services/user-service";
import {AlbumPage} from "../pages/album/album";
import {CacheService} from "ionic-cache";
import {ImageLoaderConfig} from "ionic-image-loader";
import {EventsPage} from "../pages/events/events";
import {EventEditPage} from "../pages/event-edit/event-edit";

@Component({
  templateUrl: 'app.component.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public nav: any;
  private profilePicture ='';
  private profileNme = '';
  private userId ='';

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
      title: 'Evénements',
      icon: 'md-calendar',
      count: 0,
      component: EventsPage
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

  constructor(public platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen,public userService : UserService,public cach : CacheService,
              private imageLoaderConfig: ImageLoaderConfig) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      cach.setDefaultTTL(60*60*12);
      cach.setOfflineInvalidate(false);
      statusBar.styleDefault();
      splashScreen.hide();
      this.userId = localStorage.getItem('user-id');
      imageLoaderConfig.setImageReturnType('base64');
    });

  }

  openPage(page) {
    if(page.component == LoginPage ){
       localStorage.clear();
       sessionStorage.clear();
       this.cach.clearAll();

       this.nav.setRoot(page.component);
    }
    else if(page.component == HomePage){
      this.nav.setRoot(page.component);
    }else if(page.component == ChatsPage){
      this.nav.push(page.component,{
        navBarColor : 'primary',
        activateDelete :false,
        type :'inbox',
      });
    }
    else{
      this.nav.push(page.component);
    }

  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }


}

