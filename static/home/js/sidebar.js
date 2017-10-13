/**
 * Created by suyue on 2017/1/18.
 */
//子菜单控制父菜单的兄弟菜单
function mask(action,mask_id){
    if (action=="over"){
        $("#"+mask_id).css("width","100%")
    }else if(action=="out"){
        $("#"+mask_id).css("width","3px")
    }
}

function signOut() {
    $.when(req_ajax('/user/signOut/','','data'))
        .done(function () {
            window.location.href="/user/"
        })
}