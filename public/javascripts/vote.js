let limit = 10;//每页10条数据
let offset = 0;//起始的索引
let voteFn = {
  //此方法用于将用户user转成模板字符串
  formatUser(user){
    return (
      `<li>        
                        <div class="head">
                           <a href="detail.html">
                              <img src="${user.head_icon}" alt="">
                           </a>
                        </div>
                        <div class="up">
                           <div class="vote">
                              <span>${user.vote}票</span>
                           </div>
                           <div class="btn">
                              投TA一票
                           </div>
                        </div>
                        <div class="descr">
                           <a href="detail.html">
                             <div>
                                <span>${user.username}</span>
                                <span>|</span>
                                <span>编号#${user.id}</span>
                              </div>
                              <p>${user.description}</p>
                           </a>
                        </div>     
                    </li>`
    )
  }
}
$(function(){
  $.ajax({
    url:'/vote/index/data',
    type:'GET',
    dataType:'json',
    data:{limit,offset},
    success(result){
      console.log(result);
      let users = result.data.objects;
      //TODO 把users数组转成li数组并且添加到ul里
      let html = users.map(user=>voteFn.formatUser(user)).join('');
      $('.coming').html(html);
    }
  });
});