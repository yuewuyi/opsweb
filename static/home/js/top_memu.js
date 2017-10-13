/**
 * Created by suyue on 2017/1/2.
 */
//加载页面时渲染菜单按钮大小以及样式
$(document).ready(function () {
    var height=parseInt($("#left_console").css("height"))
    $("#memu_icon").css({"border-bottom":height*0.1+"px solid #35353d","border-top":height*0.1+"px solid #35353d"})
    var width=$('.page_container').width()
    if (width<=1166){
        $('.page_container').width(1166)
        $('#header').width(1166)
    }else {
            $('.page_container').css('width',"100%")
            $('#header').css('width',"100%")
        }
})
$(window).resize(function () {
    var width=$('.page_container').width()
    if (width<=1166){
        $('.page_container').width(1166)
        $('#header').width(1166)
    }else {
            $('.page_container').css('width',"100%")
            $('#header').css('width',"100%")
        }
})
//改变菜单按钮背景颜色和菜单按钮的颜色
function memu_icon_style(state) {
    if(state=='over'){
        $("#left_console").css("backgroundColor","#1E282C")
        $("#memu_icon").css({"border-bottom-color":"#3d4049","border-top-color":"#3d4049","background-color":"#3d4049"})
    }
    else if(state=="out"){
        $("#left_console").css("backgroundColor","#222d32")
        $("#memu_icon").css({"border-bottom-color":"#35353d","border-top-color":"#35353d","background-color":"#35353d"})
    }
}
//左边菜单栏的伸缩控制
function sidebar_scla() {
    var s_width=parseInt($("#sidebar").css("width"))
    var s_max_width=200
    var s_min_width=0
    var width=$('.page_container').width()
    if (s_width==200){
        if(width <=1166){
            $('.page_container').width(1366)
            $('#header').width(1366)
        }else {
            $('.page_container').css('width',"100%")
            $('#header').css('width',"100%")
        }
        $("#sidebar").css("width",s_min_width)
        $("#accordion").hide()
        setTimeout("graphs_size()",500)
    }else {
         if(width-200 <=1166){
             setTimeout(function () {
                 $('.page_container').width(1166)
                 $('#header').width(1166)
             },500)

        }else {
            $('.page_container').css('width',"100%")
            $('#header').css('width',"100%")
        }
        $("#sidebar").css("width",s_max_width)
        $("#accordion").show()
        setTimeout("graphs_size()",500)
    }
}