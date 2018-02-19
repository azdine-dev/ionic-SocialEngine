import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

let albumUrl = 'http://intaliq.novway.com/api/v1/albums/';
let fields = 'id,type,thumb,title,is_liked,can_like,can_comment,description,owner,total_photo,can_upload,can_edit,photos,can_edit,can_delete,photos';
let photos = 'id,type,thumb,img,title,description,date,album,photo_index,next_photo,previous_photo,can_tag,can_edit,can_delete,can_share,can_report,can_make_profile_photo'
let photoFields = 'id,type,thumb,img,title,description,date,album,photo_index,next_photo,previous_photo,' +
  'can_tag,can_edit,can_delete,can_share,can_report,can_make_profile_photo';
let param = '?';
let param_delimiter = '&';
let refrechToken = localStorage.getItem('refresh_token');
let accessToken = localStorage.getItem('token')+'&refresh_token='+this.refrechToken;
@Injectable()
export class AlbumService {

  constructor(public http :HttpClient){

  }

  getUserAlbums(user_id){
   return new Promise((resolve,reject)=>{
     this.http.get(albumUrl+param+'access_token='+accessToken+'&user_id='+user_id+'&fields='+fields).subscribe(data=>{
       resolve(data);
     },err=>{
       reject(err);
     })
   })
  }

  getAlbumPhotos(album_id){
    return new Promise((resolve,reject)=>{
      this.http.get(albumUrl+album_id+param+'access_token='+accessToken+'&fields='+fields+'&photo_fields='+photos).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }




  likeAlbum(album_id){

  }

  // ***********************PHOTO SERVICE *********************************
  getPhoto(photo_id){
    return new Promise((resolve,reject)=>{
      this.http.get(albumUrl+'photos/'+photo_id+param+'access_token='+accessToken+'&fields='+photoFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  likePhoto(){

  }
  unlikePhoto(){

  }
  reportPhoto(){

  }
  deletePhoto(photoId){
    return new Promise((resolve, reject) => {

      this.http.delete(albumUrl+'photos/'+photoId+ param + 'access_token=' + accessToken).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })

    });
  }

}
