$(function(){
    //位art-template定义事件过滤器
    template.defaults.imports.dateFormat = function(dtStr){
        var dt = new Date(dtStr);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth()+1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }
    function padZero(n){
        return n > 9 ? n : "0"+n
    }
    //定以提交参数
    var q = {
        pagenum:1,
        pagesize:2,
        cate_id:"",//文章分类得Id
        state:"",//文章得状态，可选值有：已发布，草稿
    };
    //初始化文章列表
    var layer = layui.layer
    initTable();
    function initTable(){
        $.ajax({
            method:"GET",
            url:"/my/article/list",
            data:q,
            success:function(res){
                console.log(res);
                var str = template("tpl-table",res);
                $("tbody").html(str);
                renderPage(res.total);
            }
        })
    }
    //初始化分类
    var form = layui.form;
    initCate();//调用函数
    //封装
    function initCate(){
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                //校准
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                //赋值 渲染form
                var htmlStr = template("tpl-cate",res);
                $("[name=cate_id]").html(htmlStr);
                form.render();//form.render(); //刷新select选择框渲染
            }
        })
    }
    //筛选功能
    $("#form-search").on("submit",function(e){
        e.preventDefault();
        console.log(1);
        //获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })
    //分页
    var laypage = layui.laypage; 
    function renderPage(total){
        laypage.render({
            elem: "pageBox",
            count: total,//数据总数
            limit:q.pagesize,//每页显示多少
            curr: q.pagenum, //获取起始页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump: function(obj,first){
                //obj:所有参数所在的对象;first:是否是第一次初始化分页;
                //改变当前分页3
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //判断，不是第一次初始化分页，才能重新调用初始话文章列表；
                if(!first){
                    initTable();
                }
            }
        });
    }
    //删除
    var layer=layui.layer;
    $("tbody").on("click",".btn-delete",function(){
        //先获取id，进入到函数中this的代指就变了
        var Id =$(this).attr("data-id");
        //显示对话框
        layer.confirm("是否确认删除？",{ icon:3,title:"提示"},function(){
            $.ajax({
                method:"GET",
                url:"/my/article/delete/" +Id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg("恭喜您，文章删除成功！");
                    if($(".btn-delete").length == 1 && q.pagenum >1) q.pagenum--;
                    initTable();
                }
                
            })
            layer.closeAll();
        })
    })
})