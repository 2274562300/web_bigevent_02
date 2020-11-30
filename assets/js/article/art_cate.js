$(function(){
    //文章类别列表展示
    initArtCateList();
    //封装函数
    function initArtCateList(){
        $.ajax({
            url:"/my/article/cates",
            success:function(res){
                console.log(res);
                var str = template("tpl-art-cate",res);
                $("tbody").html(str);
            }
        })
    }
    //添加点击弹出框
    var layer = layui.layer;
    $("#btnAdd").on("click",function(){
        //利用框架结构，显示提示添加文章类别区域
        layer.open({
            type:1,
            title:"添加文章类型",
            area:["500px","260px"],
            content:$("#dialog-add").html(),
        })
    })
    //提交文章分类添加（事件委托）
    var indexAdd = null;
    $("body").on("submit","#form-add",function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/article/addcates",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                //因为我们添加成功了，所以需要重新渲染到页面中
                initArtCateList();
                layer.msg("恭喜您，文案类别添加成功！");
                layer.closeAll();
            }
        })
    })
    var indexAdd = null;
    var form = layui.form
    $("tbody").on("click",".btn-edit",function(e){
        indexEdit = layer.open({
            type:1,
            title:'修改文章分类',
            area:['500px','260px'],
            content:$("#dialog-edit").html()
        })
        var Id = $(this).attr("data-id");
        $.ajax({
            method:"GET",
            url:"/my/article/cates/"+ Id,
            success:function(res){
                form.val("form-edit",res.data);
            }
        })
    })
    //修改
    $("body").on("submit","#form-edit",function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/article/updatecate",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                //因为我们添加成功了，所以需要重新渲染到页面中
                initArtCateList();
                layer.msg("恭喜您，文案类别更新成功！");
                layer.closeAll();
            }
        })
    })
    //删除
    $("tbody").on("click",".btn-delete",function(){
        //先获取Id,金鱼到函数中的this代指就变了
        var Id = $(this).attr("data-id");
        layer.confirm("是否确认删除",{ icon: 3,title: "提示"},
            function(index){
                $.ajax({
                    metHod:"GET",
                    url:"/my/article/deletecate/" + Id,
                    success:function(res){
                        if(res.status !== 0){
                            return layer.msg(res.message)
                        }
                        initArtCateList();
                        layer.msg("恭喜您，文章类别删除成功！");
                        layer.closeAll();
                    }
                })
            }
        )
    })
})