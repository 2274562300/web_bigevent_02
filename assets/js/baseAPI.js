//开发环境服务器地址
var baseURL = "http://ajax.frontend.itheima.net";
$.ajaxPrefilter(function(params){
    //拼接对应环境的服务器地址
    params.url = baseURL + params.url;
})