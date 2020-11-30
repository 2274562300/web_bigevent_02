$(function(){
    //初始化分类
    var form = layui.form;//导入form
    var layer = layui.layer;//导入layer
    // 初始化富文本编辑器
    initEditor();
    initCate();//调用函数
    function initCate(){
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                //校验
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                // 赋值渲染
                var htmlStr = template("tpl-cate",res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }
     // 1. 初始化图片裁剪器
    var $image = $('#image')
  
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options)
    //点击按钮触发选择图片
    $("#btnChooseImage").on("click",function(){
        $("#coverFile").click();
    })
    //设置图片
    $("#coverFile").change(function(e){
        //拿到用户选择的文件
        var file = e.target.files[0]
        //非空校验！URL.createObjectTRL();
        if(file == undefined){
            return;
        }
        //根据选择的文件，创意一个对应的URL 地址；
        var newImgURL = URl.createObjectURL(file)
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })
    //设置状态
    var state = "已发布";
    //
    $("#btnSave2").on("click",function(){
        state = "草稿";
    })
    //添加文章
    $("#form-pub").on("submit",function(e){
        //阻止默认行为
        e.preventDefault();
        //创建FormDate对象，收集数据
        var fd = new FormData(this);
        //放入状态
        fd.append("state",state);
        //放入图片
        $image.cropper("getCroppedCanvas",{
            width:400,
            height:280
        })
        //将 canvas 画布上的内容，转化为文件对象0
        .toBlob(function(blob){
            //得到文件对象后，进行后续的操作
            fd.append("cover_img",blob);
            // console.log(...fd);
            //发送 ajax 要在toBlob()函数里面！！！！
            publishArticle(fd);
        })
    })
    //封装 ，添加文章方法
    function publishArticle(fd){
        $.ajax({
            method :"POST",
            url:"/my/article/add",
            data:fd,
            //FormData 类型数据ajax提交 ，需要设置两个false
            contentType:false,
            processData:false,
            success:function(res){
                
                //失败判断
                if(res.status != 0){
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，发布文章成功！");
                // //跳转
                // Location.href = "/article/art_list.html"
                setTimeout(function(){
                    window.parent.document.getElementById("art_list").click()
                },1500)
            }
        })
    }
})