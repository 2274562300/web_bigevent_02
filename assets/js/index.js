$(function(){
    //获取有用信息
    getUserInfo();
    //退出功能
    var layer = layui.layer;
    $("#btnLogout").on("click",function(){
        //框架提供的询问狂
        layer.confirm("是否确认退出?",{ icon: 3, title: "提示" },function(index){
            //清空本地token
        localStorage.removeItem("token");
        location.href="/login.html";
        //关闭询问闯
        layer.close(index);
        })
    })
})
function getUserInfo(){
    $.ajax({
        url:'/my/userinfo',
        // headers:{
        //     //重新登陆，因为token过期事件12小时
        //     Authorization:localStorage.getItem("token") || "",

        // },
        success:function (res) {
            //判断状态码
            console.log(res);
            if(res.status !== 0){
                return layui.layer.msg(res.message);
            }
            //请求成功，渲染用户头信息
            renderAvatar(res.data);
        }
    })
}
//封装用户名头像渲染函数
function renderAvatar(user){
    //1.用户名 昵称优先，没有用username
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎  "+name);
    //用户头像
    if(user.user_pic !== null){
        //有头像
        $(".layui-nav-img").show().attr("src",user.user_pic);
        $(".text-avatar").hide();
    }else{
        //没有头像
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase();//首字母大写
        $(".text-avatar").show().html(text);
    }
}