import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlogsViewPage } from './blogs-view';

@NgModule({
  declarations: [
    BlogsViewPage,
  ],
  imports: [
    IonicPageModule.forChild(BlogsViewPage),
  ],
})
export class BlogsViewPageModule {}
