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
import {AlbumService} from "../services/album-service";
import {IonicImageViewerModule} from "ionic-img-viewer";
import {AlbumPage} from "../pages/album/album";
import {PhotosPage} from "../pages/photos/photos";
import {ShareModalPage} from "../pages/share-modal/share-modal";
import {VideoModalPage} from "../pages/video-modal/video-modal";
import {PhotoModalPage} from "../pages/photo-modal/photo-modal";
import {CacheModule} from "ionic-cache";
import {FriendsPage} from "../pages/friends/friends";
import {IonicImageLoader} from "ionic-image-loader";
import {LazyLoadImageModule} from "ng2-lazyload-image";
import {CoreService} from "../services/core-service";
import {OptionsPage} from "../pages/options/options";
import {ProfilePage} from "../pages/profile/profile";
import {EventsPage} from "../pages/events/events";
import {EventsDetailPage} from "../pages/events-detail/events-detail";
import {EventService} from "../services/event-service";
import {ParticipantsPage} from "../pages/participants/participants";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {EventEditPage} from "../pages/event-edit/event-edit";
import {MessageService} from "../services/message-service";
import {MessageCreatePage} from "../pages/message-create/message-create";
import {GroupService} from "../services/group-service";
import {NotificationsService} from "../services/notifications-service";
import {GroupsPage} from "../pages/groups/groups";
import {GroupDetailPage} from "../pages/group-detail/group-detail";
import {MessageModalPage} from "../pages/message-modal/message-modal";

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
    InfoPage,
    AlbumPage,
    PhotosPage,
    ShareModalPage,
    VideoModalPage,
    PhotoModalPage,
    FriendsPage,
    OptionsPage,
    ProfilePage,
    EventsPage,
    EventsDetailPage,
    ParticipantsPage,
    EventEditPage,
    MessageCreatePage,
    GroupsPage,
    GroupDetailPage,
    MessageModalPage
  ],
  imports: [
    BrowserModule,HttpClientModule,
    LazyLoadImageModule,
    IonicImageViewerModule,
    CacheModule.forRoot(),
    IonicImageLoader.forRoot(),
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),

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
    InfoPage,
    AlbumPage,
    PhotosPage,
    ShareModalPage,
    VideoModalPage,
    PhotoModalPage,
    FriendsPage,
    OptionsPage,
    ProfilePage,
    EventsPage,
    EventsDetailPage,
    ParticipantsPage,
    EventEditPage,
    MessageCreatePage,
    GroupsPage,
    GroupDetailPage,
    MessageModalPage,

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
    VideoService,
    AlbumService,
    CoreService,
    EventService,
    MessageService,
    GroupService,
    NotificationsService,


    /* import services */
  ]
})
export class AppModule {
}
