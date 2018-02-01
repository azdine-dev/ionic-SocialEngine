import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlogsPage } from './blogs';

@NgModule({
  declarations: [
    BlogsPage,
  ],
  imports: [
    IonicPageModule.forChild(BlogsPage),
  ],
})
export class BlogsPageModule {}
