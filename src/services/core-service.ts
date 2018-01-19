import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

let coreUrl ='intaliq.novway.com/api/v1/core/'

@Injectable()
export class CoreService {

  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token') + '&refresh_token=' + this.refrechToken;

  constructor(public http: HttpClient) {

  }

  reportItem(item_type,item_id){

  }
}
