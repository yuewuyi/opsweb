/**
 * Created by suyue on 2017/1/18.
 */
function mask(action,mask_id){
    if (action=="over"){
        $("#"+mask_id).css("width","100%")
    }else if(action=="out"){
        $("#"+mask_id).css("width","3px")
    }
}