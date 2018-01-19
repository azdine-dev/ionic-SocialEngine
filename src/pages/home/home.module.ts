import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {HomePage} from "./home";
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
