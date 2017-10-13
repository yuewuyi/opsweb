/**
 * Created by suyue on 2017/8/24.
 */
function loading(parm) {
    if(parm=='add'){
        $('#search span').addClass('loader')
        $('#search').addClass('disableClick')
    }else if(parm=='remove'){
        $('#search span').removeClass('loader')
        $('#search').removeClass('disableClick')
    }
}
