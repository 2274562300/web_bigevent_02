$(function(){
    //点击去注册账号，隐藏登录区域，显示注册区域
    $("#link_reg").on("click",function(){
        $(".login-box").hide()
        $(".reg-box").show()
    })
    //点击去登录账号，隐藏注册区域，显示登录区域
    $("#link_login").on("click",function(){
        $(".login-box").show()
        $(".reg-box").hide()
    })
    //3.自定义验证规则
    var form = layui.form;
    form.verify({
        //密码规则
        pwd:[
            /^[\S]{6,16}/,
            "密码必须是6-16位，也不能为空格"
        ],
        repwd:function(value){
            var pwd = $(".reg-box input[name = password]").val()
            //比较
            if(value !== pwd){
                return "两次密码实入不一致！"
            }
        }
    })
    //注册功能
    $("#form_reg").on("submit",function(e){
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method:"POST",
            url:"/api/reguser",
            data:$(this).serialize(),
            success:function(res){
                //看会状态判断
                if(res.status != 0){
                    return layer.msg(res.message);
                }
                //提交成功后处理代码
                layer.msg("注册成功，请登录");
                //手动切换到登录表单
                $("#link_login").click();
                //重置表单
                $("#form_reg")[0].reset();
            }
        })
    })
    //登录功能
    $("#form_login").on("submit",function(e){
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method:"POST",
            url:"/api/login",
            data:$(this).serialize(),
            success:function(res){
                console.log(res);
                //校准
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                //提示信息保存token  跳转页面
                layer.msg("恭喜您，登录成功")
                //保存token,未来的接口要使用token
                localStorage.setItem("token",res.token);
                //跳转
                location.href = "/index.html";
            }
        })
    })
})