$(function () {
    var id = location.search.split("=")[1];
    // console.log(id);
    function initForm() {
        // console.log(id);
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                // console.log(id);
                //校验
                // console.log(res);
                //赋值,渲染 form
                form.val("form-edit", res.data);
                // tinyMCE.activeEditor.setContent(res.data.content);
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }
    //初始化分类
    var form = layui.form;//导入form
    var layer = layui.layer;//导入layer
    // 初始化富文本编辑器
    initEditor();
    initCate();//调用函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值渲染
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                if (id) {
                    initForm();
                }
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
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    })
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
          return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
          .cropper('destroy') // 销毁旧的裁剪区域
          .attr('src', newImgURL) // 重新设置图片路径
          .cropper(options) // 重新初始化裁剪区域
      })
    //设置状态
    var state = "已发布";
    //
    $("#btnSave2").on("click", function () {
        state = "草稿";
    })
    //添加文章
    $("#form-pub").on("submit", function (e) {
        //阻止默认行为
        e.preventDefault();
        //创建FormDate对象，收集数据
        var fd = new FormData(this);
        //放入状态
        fd.append("state", state);
        //放入图片
        $image.cropper("getCroppedCanvas", {
            width: 400,
            height: 280
        })
            //将 canvas 画布上的内容，转化为文件对象0
            .toBlob(function (blob) {
                //得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);

                // console.log(...fd);
                //发送 ajax 要在toBlob()函数里面！！！！
                if (id) {
                    bianJi(fd);
                } else {
                    fd.delete("Id")
                    console.log(...fd);
                    publishArticle(fd);
                }

            })
    })
    //封装 ，添加文章方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //FormData 类型数据ajax提交 ，需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                //失败判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，发布文章成功！");
                // //跳转
                // Location.href = "/article/art_list.html"
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1500)
            }
        })
    }
    function bianJi(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            //FormData 类型数据ajax提交 ，需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {

                //失败判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，修改文章成功！");
                // //跳转
                // Location.href = "/article/art_list.html"
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1500)
            }
        })
    }
})