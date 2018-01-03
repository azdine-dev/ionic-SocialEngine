import {NgModule} from '@angular/core';
import {IonicApp, IonicModule, LoadingController} from 'ionic-angular';
import {MyApp} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

// import services
import {PostService} from '../services/post-service';
import {UserService} from '../services/user-service';
import {NotificationService} from '../services/notification-service';
import {ChatService} from '../services/chat-service';
import {AuthServiceProvider} from "../services/auth-service";
// end import services

// import pages
import {ChatDetailPage} from '../pages/chat-detail/chat-detail';
import {ChatsPage} from '../pages/chats/chats';
import {ContactsPage} from '../pages/contacts/contacts';
import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {NotificationsPage} from '../pages/notifications/notifications';
import {PostPage} from '../pages/post/post';
import {RecentPostsPage} from '../pages/recent-posts/recent-posts';
import {RegisterPage} from '../pages/register/register';
import {SettingPage} from '../pages/setting/setting';
import {UserPage} from '../pages/user/user';
import {WallPostsPage} from '../pages/wall-posts/wall-posts';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ExpressionPage} from "../pages/expression/expression";
import {Camera} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {ComposeUploadService} from "../services/compose-upload";
import {CommentPage} from "../pages/comment/comment";
import {VideoService} from "../services/video-service";
import {InfoPage} from "../pages/info/info";

// end import pages

@NgModule({
  declarations: [
    MyApp,
    ChatDetailPage,
    ChatsPage,
    ContactsPage,
    HomePage,
    LoginPage,
    NotificationsPage,
    PostPage,
    RecentPostsPage,
    RegisterPage,
    SettingPage,
    CommentPage,
    UserPage,
    WallPostsPage,
    ExpressionPage,
    InfoPage
  ],
  imports: [
    BrowserModule,HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatDetailPage,
    ChatsPage,
    ContactsPage,
    HomePage,
    LoginPage,
    NotificationsPage,
    PostPage,
    RecentPostsPage,
    RegisterPage,
    SettingPage,
    UserPage,
    WallPostsPage,
    ExpressionPage,
    CommentPage,
    InfoPage
  ],
  providers: [
    FileTransfer,
    Camera,
    StatusBar,
    SplashScreen,
    PostService,
    UserService,
    NotificationService,
    ChatService,
    ComposeUploadService,
    AuthServiceProvider,
    VideoService
    /* import services */
  ]
})
export class AppModule {
}
