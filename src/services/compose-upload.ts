import {FileTransfer, FileUploadOptions} from "@ionic-native/file-transfer";
import {inject} from "@angular/core/testing";
import {forwardRef, Inject} from "@angular/core";

let photoUrl = 'http://intaliq.novway.com/api/v1/albums/compose_upload';
export class ComposeUploadService {

  private transferImageOptions : FileUploadOptions ={
    chunkedMode : false,
    fileKey : "Filedata",
    mimeType : "image/jpeg"
  };
  private accessToken = localStorage.getItem('token');
  private transfer : FileTransfer;

  constructor(@Inject(forwardRef(() => FileTransfer))transferD){
    this.transfer = transferD;
  }

  composeUploadVideo(){

    /***NOT COMPLETED YET ***/
  }

  /**Compose Upload A photo see http://serestapi.younetco.com/docs/api.html#albums-compose-upload-post */
  composeUploadPhoto(fileData) {
    return new Promise((resolve,reject)=>{
      const imageTransfer = this.transfer.create();
      imageTransfer.upload(fileData,encodeURI(photoUrl+'?access_token='+this.accessToken),this.transferImageOptions).then(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    });

  }

  composeUploadLink(){

    /**NOT COMPLETED YET**/
  }
}
