!--Generated;
template;
for (the; HomePage; page.
)
    See;
http: Ionic;
pages;
and;
navigation.
;
-- >
    -header >
    -navbar;
color = "primary" >
    ion - button;
menuToggle >
    -icon;
name = "menu" > /ion-icon>
    < /button>
    < ion - title > /ion-title>
    < /ion-navbar>
    < /ion-header>
    < ion - content >
    -card >
    -item >
    -label;
color = "primary";
stacked > /ion-label>
    < ion - input;
type = "email"(click) = "goToExpress(post)";
placeholder = "Exprime toi .." > /ion-input>
    < /ion-item>
    < div;
style = "background-color: #f4f4f4";
color = "light" >
    -grid >
    -row >
    -col;
width - 25 >
    -icon;
name = "md-camera";
color = "gray" > /ion-icon>
    < /ion-col>
    < ion - col;
width - 25 >
    -icon;
name = "md-link";
color = "gray" > /ion-icon>
    < /ion-col>
    < ion - col;
width - 25 >
    -icon;
name = "md-videocam";
color = "gray" > /ion-icon>
    < /ion-col>
    < ion - col;
width - 25 >
    -icon;
name = "md-link";
color = "gray" > /ion-icon>
    < /ion-col>
    < /ion-row>
    < /ion-grid>
    < /div>
    < /ion-card>
    < ion - card * ngFor;
"let post of feed ; let info = feedInfo" >
    -item >
    -avatar;
item - left(click);
"viewUser(post.user_id)" >
    src;
"{{ post.owner.imgs.icon}}" >
    /ion-avatar>
    < ion - label > {};
{
    post.owner.title;
}
/ion-label>
    < h2(click);
"viewUser(post.user_id)" > {};
{
    post.name;
}
/h2>
    < p > {};
{
    post.time;
}
/p>
    < /ion-item>
    < ion - item;
text - wrap;
var default_1 = (function () {
    function default_1() {
    }
    return default_1;
}());
"post-body" >
    (click);
"viewPost(post.id)" >
;
"processHtmlContent(post)" > /div>
    < div * ngIf;
"post.attachments.length && post.attachments[0].type=='video'" >
;
"videoFeedMap.get(post.attachments[0].id)";
height = "200px";
allowfullscreen;
frameborder = "0" > /iframe>
    < /div>
    < img;
var default_2 = (function () {
    function default_2() {
    }
    return default_2;
}());
"full-image" * ngIf;
"post.attachments.length && post.attachments[0].type=='album_photo' ";
src = "{{ post.attachments[0].img }}" >
    !-- < p;
padding - top;
padding - bottom > {};
{
    post.content;
}
/p>-->
    < /div>
    < div >
    (click);
"viewPost(post.id)";
var default_3 = (function () {
    function default_3() {
    }
    return default_3;
}());
"subdued" > {};
{
    post.total_like;
}
Likes < /a>
    < a(click);
"viewPost(post.id)";
var default_4 = (function () {
    function default_4() {
    }
    return default_4;
}());
"subdued";
margin - left > {};
{
    post.total_comment;
}
Comments < /a>
    < /div>
    < /ion-item>
    < ion - grid;
var default_5 = (function () {
    function default_5() {
    }
    return default_5;
}());
"post-actions" >
    -row >
    -col * ngIf;
"post.can_like";
text - center(click);
"toggleLike(post)" >
    -icon;
name = "thumbs-up";
color = "primary" * ngIf;
"post.is_liked" > /ion-icon>
    < ion - icon;
name = "thumbs-up" * ngIf;
"!post.is_liked" > /ion-icon>
    < /ion-col>
    < ion - col * ngIf;
"post.can_comment";
text - center(click);
"viewPost(post)" >
    -icon;
name = "chatboxes" > /ion-icon>
    < /ion-col>
    < ion - col * ngIf;
"post.can_share";
text - center(click);
"sharePost(post)" >
    -icon;
name = "share-alt" > /ion-icon>
    < /ion-col>
    < ion - col * ngIf;
"post.can_delete";
text - center(click);
"showDeletePostDialog(post)" >
    -icon;
name = "ios-trash-outline" > /ion-icon>
    < /ion-col>
    < /ion-row>
    < /ion-grid>
    < /ion-card>
    < /ion-content>;
