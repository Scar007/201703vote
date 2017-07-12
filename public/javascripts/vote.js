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
                           <div class="btn" data-id="${user.id}">
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
    let user = voteFn.getUser();
    $('.coming').click(function(event){
      if(event.target.className == 'btn'){
        if(user){ //dataset存放着所有的自定义属性 data-
          let id = event.target.dataset.id;//被投票者ID
          let voterId = user.id;//投票者ID
          voteFn.request({
            url:'/vote/index/poll',
            data:{id,voterId},
            success(result){
              alert(result.msg);
              if(result.errno == 0){
                let voteSpan = $(event.target).siblings('.vote').children('span');
                voteSpan.html(parseInt(voteSpan.text())+1+'票');
              }
            }
          });
        }else{
           $('.mask').show();
        }



      }
    });
    $('.mask').click(function(event){
      if(event.target.className == 'mask'){//如果说事件源是mask的话就关掉登录窗口
        $('.mask').hide();
      }
    });
    $('.sign_in').click(function(){
      $('.mask').show();
    });
    if(user){
      $('.sign_in span').html('已登入');
      $('.no_signed').hide();
    }
  },
  initRegister(){
    $('.rebtn').click(function(){
      let username = $('.username').val();
      if(!username){
        alert('用户名不能为空');return;
      }
      let password = $('.initial_password').val();
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
      voteFn.request({
        url:'/vote/register/data',
        type:'POST',
        data:{username,password,mobile,description,gender},
        success(result){
          alert(result.msg);//不管成功还是失败，都会弹出系统提示
          if(result.errno == 0){
            //在注册之后此用户自动登录,把当前的用户信息存放在local中
            voteFn.setUser({id:result.id,username})
            location.href = '/vote/index';
          }
        }
      })

    });
  },
  setUser(user){
    localStorage.setItem('user',JSON.stringify(user));
  },
  getUser(){
    return localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null;
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
    voteFn.initRegister();
  }

});