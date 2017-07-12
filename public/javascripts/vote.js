let limit = 10;//每页10条数据
let offset = 80;//起始的索引
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
  },
  request({url,type='GET',dataType='json',data={},success}){
    $.ajax({url, type, dataType, data, success});
  },
  loadUsers(load){
    voteFn.request({
      url:'/vote/index/data',
      data:{limit,offset},
      success(result){
        let total = result.data.total;
        let users = result.data.objects;
        //修改偏移量1 偏移量0 第二页 10
        offset+=users.length;
        //TODO 把users数组转成li数组并且添加到ul里
        let html = users.map(user=>voteFn.formatUser(user)).join('');

        if(offset>=total){
          setTimeout(function(){
            $('.coming').append(html);
            load && load.complete();
            load && load.reset();
          },1000);
        }else{
          setTimeout(function(){
            $('.coming').append(html);
            load && load.reset();
          },1000);
        }
      }
    });
  }
}
$(function(){
  //1.少传几个变量，不再可能漏写，也不可能出错
  //2.如果以后不用jquery, 只改一个地方就可以了 jquery axios fetch
  voteFn.loadUsers();
  loadMore({
    callback:voteFn.loadUsers
  });
});