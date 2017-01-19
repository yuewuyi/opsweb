/**
 * Created by suyue on 2017/1/2.
 */
$(document).ready(function () {
    height=parseInt($("#left_console").css("height"))
    $("#left_console").css('width',height)
    $("#memu_icon").css({"border-bottom":height*0.1+"px solid #35353d","border-top":height*0.1+"px solid #35353d"})
})
$(window).resize(function () {
    height=parseInt($("#left_console").css("height"))
    $("#left_console").css('width',height)
    $("#memu_icon").css({"border-bottom-width":height*0.1,"border-top-width":height*0.1})
})
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
function sidebar_scla() {
    s_width=parseInt($("#sidebar").css("width"))
    s_max_width=200
    s_min_width=45
    if (s_width==200){
        $("#sidebar").css("width",s_min_width)
    }else {
        $("#sidebar").css("width",s_max_width)
    }
}