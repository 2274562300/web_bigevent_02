$(function(){
    var form = layui.form;
    form.verify({
        pwd:[/^[\S]{6,12}$/,"密码必须6~12位，且不能出现空格"],
        //新旧不重复
        samePwd:function(value){
            //value是新密码，旧密码需要获取
            if(value == $("[name=oldPwd]").val()){
                return "原密码和旧密码不能相同"
            }
        },
        //1.3两次新密码必须一致
        rePwd:function(value){
            //value是再次输入的新密码，新密码西药重新获取
            if(value !== $("[name=newPwd]").val()){
                return "两次新密码输入不一致"
            }
        }
    })
    //2.表单提交
    $(".layui-form").on("submit",function(e){
        e.preventDefault();
        $.ajax({
            method:"post",
            url:"/my/updatepwd",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("修改密码成功");
                $(".layui-form")[0].reset();
            }
        })
    })
})