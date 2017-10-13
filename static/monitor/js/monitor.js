/**
 * Created by suyue on 2017/2/28.
 */

function monitor_search_form_submit() {
    hostname=$.trim($('#host_name').val())
    ipaddr=$.trim($('#ip_addr').val())
    url=window.location.pathname+'?host_name='+hostname+'&ipaddr='+ipaddr
    location.href=encodeURI(url)
}
function warning_info_div(action,host) {
    if(action=='create') {
        error_info=''
        host_data=eval($("#data_storage").data('host'))
        $.each(host_data,function (index,value,array) {
            if(value['triggers'].length!=0 && value['status']==0 && value['host']==host){
                $.each(value['triggers'],function(index_sub,value_sub,array_sub){
                    error_info+=value_sub['description']+"</BR>"
                })
                return false
            }
        })
        var oEvent = event;
        var oDiv = document.createElement('div')
        oDiv.style.left = oEvent.clientX + 'px' // 指定创建的DIV在文档中距离左侧的位置
        oDiv.style.top = oEvent.clientY + 'px' // 指定创建的DIV在文档中距离顶部的位置
        oDiv.style.border = '1px solid #e0e5e8' // 设置边框
        oDiv.style.background = '#ffffff'
        oDiv.innerHTML =error_info
        oDiv.id = "warn_info"
        oDiv.style.boxShadow = "0 0 5px #000000"
        oDiv.style.borderRadius = "1px"
        oDiv.style.position = 'absolute' // 为新创建的DIV指定绝对定位
        oDiv.style.width = '200px' // 指定宽度
        oDiv.style.height = 'auto'// 指定高度
        document.body.appendChild(oDiv)
    }else if (action=='remove'){
        $("#warn_info").remove()
    }
}