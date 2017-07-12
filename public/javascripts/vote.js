let limit = 10;//每页10条数据
let offset = 0;//起始的索引
$(function(){
  $.ajax({
    url:'/vote/index/data',
    type:'GET',
    data:{limit,offset},
    success(result){
      console.log(result);
      let users = result.data.objects;

    }
  });
});