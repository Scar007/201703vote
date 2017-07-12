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
  request({url, type = 'GET', dataType = 'json', data = {}, success}){
    $.ajax({url, type, dataType, data, success});
  },
  loadUsers(load){
    voteFn.request({
      url: '/vote/index/data',
      data: {limit, offset},
      success(result){
        let total = result.data.total;
        let users = result.data.objects;
        //修改偏移量1 偏移量0 第二页 10
        offset += users.length;
        //TODO 把users数组转成li数组并且添加到ul里
        let html = users.map(user => voteFn.formatUser(user)).join('');

        if (offset >= total) {
          setTimeout(function () {
            $('.coming').append(html);
            load && load.complete();
            load && load.reset();
          }, 1000);
        } else {
          setTimeout(function () {
            $('.coming').append(html);
            load && load.reset();
          }, 1000);
        }
      }
    });
  },
  initIndex(){//初始化首页
    voteFn.loadUsers();
    loadMore({callback: voteFn.loadUsers});
  }
}
//根据不同的页面加载不同的JS脚本
let indexReg = /\/vote\/index/;
let registerReg = /\/vote\/register/;
$(function () {
  let url = location.href;
  if (indexReg.test(url)) {//如果是首页的话
    voteFn.initIndex();
  } else if (registerReg.test(url)) {
    $('.rebtn').click(function(){
       let username = $('.username').val();
       if(!username){
         alert('用户名不能为空');return;
       }
       let password = $('.password').val();
       if(!/[a-zA-Z0-9]{1,10}/.test(password)){
         alert('密码不合法');return;
       }
       let confirm_password = $('.confirm_password').val();
       if(password!= confirm_password){
         alert('确认密码和密码不一致');return;
       }
       let mobile = $('.mobile').val();
       if(!/1\d{10}/.test(mobile)){
         alert('手机号不合法');return;
       }
       let description = $('.description').val();
       if(!(description && description.length<=20)){
        alert('自我描述不合法');return;
       }
       let gender = $("input[name='gender']:checked").val();


    });
  }

});