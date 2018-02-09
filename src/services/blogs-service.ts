import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

let blogUrl ='intaliq.novway.com/api/v1/blogs/';
let fields = 'id,type,title,owner,date,body';
let blogFields='id,type,title,owner,date,body,tags,category,can_edit,can_delete,total_like,total_comment,can_like,can_comment,can_share';


@Injectable()
export class BlogsService {

  private refrechToken = localStorage.getItem('refresh_token');
  private accessToken = localStorage.getItem('token') + '&refresh_token=' + this.refrechToken;
  constructor(public http: HttpClient) {

  }

  getBlogs(keywords,limit?,page?){
    return new Promise((resolve,reject)=>{
      this.http.get(blogUrl+'?access_token='+this.accessToken+'&keywords='+keywords+'&fields='+blogFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  getUserBlogs(keywords,userId,limit?,page?){
    return new Promise((resolve,reject)=>{
      this.http.get(blogUrl+'?access_token='+this.accessToken+'&keywords='+keywords+'&user_id='+userId+'&fields='+blogFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }



  getMyBlogs(keywords,limit?,page?){
    return new Promise((resolve,reject)=>{
      this.http.get(blogUrl+'my'+'?access_token='+this.accessToken+'&keywords='+keywords+'&fields='+blogFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }


  getBlog(blogId){
    return new Promise((resolve,reject)=>{
      this.http.get(blogUrl+blogId+'?access_token='+this.accessToken+'&fields='+blogFields).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  deleteBlog(blogId){
    return new Promise((resolve,reject)=>{
      this.http.delete(blogUrl+blogId+'?access_token='+this.accessToken).subscribe(data=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getCategories(){

  }
  getViewOptions(){

  }
  getCommentsOptions(){

  }
}
