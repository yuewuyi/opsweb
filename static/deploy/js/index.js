/**
 * Created by suyue on 2017/8/22.
 */

function searchSubmit(){
    var hostName=escape($.trim($("#hostName").val()))
    var ipAddr=escape($.trim($("#ipAddr").val()))
    var saltBind=$("#saltBind").select().val()
    var saltStatus=$("#saltStatus").select().val()
    location.href=window.location.pathname+'?hostName='+hostName+'&ipAddr='+ipAddr+'&saltBind='+saltBind+'&saltStatus='+saltStatus
}
function addHost() {
    if (textAuth('hostname','#addHostName','#addHostSubmit','#addHostErrorTxt') && textAuth('ip','#addIpAddr','#addHostSubmit','#addHostErrorTxt')){
        var hostName=$.trim($("#addHostName").val())
        var ip=$.trim($("#addIpAddr").val())
        $("#addHostSubmit").addClass('buttonClickDisable')
        $.when(req_ajax('/api/addHost/',{hostName:hostName,ip:ip},'result'))
            .done(function () {
                if (result['code']==-1){
                    showMesage('#addHostSuccessTxt','error',result['msg'])
                    $("#addHostSubmit").removeClass('buttonClickDisable')
                }else {
                    showMesage('#addHostSuccessTxt','success',"添加成功")
                    var url=window.location.href
                    window.location.href=url
                }
            })
            .fail(function () {
                alert('添加主机请求失败')
                $("#addHostSubmit").removeClass('buttonClickDisable')
            })
    }
}
// 更新主机信息
function updateHost() {
    if(textAuth('hostname','#updateHostName','#updateHostSubmit','#updateHostSuccessTxt') && textAuth('ip','#updateIpAddr','#updateHostSubmit','#updateHostSuccessTxt')){
        $("#updateHostSubmit").addClass('buttonClickDisable')
        var hostName=$.trim($("#updateHostName").val())
        var ip=$.trim($("#updateIpAddr").val())
        var id=$("#updateHostId").val()
         $.when(req_ajax('/api/updateHost/',{hostName:hostName,ip:ip,id:id},'result'))
             .done(function () {
                if (result['code']==-1){
                    showMesage('#updateHostSuccessTxt','error',result['msg'])
                    $("#updateHostSubmit").removeClass('buttonClickDisable')
                }else {
                    showMesage('#updateHostSuccessTxt','success','更新成功')
                    location.reload()
                }
             })
             .fail(function () {
                 alert("更新主机失败")
                 $("#updateHostSubmit").removeClass('buttonClickDisable')
             })
    }
}
function delHost() {
    var id=$("#delHostId").html()
    var hostName=$("#delHostname").html()
    $("#delHostSubmit").addClass('buttonClickDisable')
    $.when(req_ajax('/api/delHost/',{hostName:hostName,id:id},'result'))
        .done(function () {
            if (result['code']==-1){
                    showMesage('#delHostSuccessTxt','error',result['msg'])
                    $("#delHostSubmit").removeClass('buttonClickDisable')
            }else {
                    showMesage('#delHostSuccessTxt','success','删除成功')
                    location.reload()
            }
        })
        .fail(function () {
            alert("删除主机失败")
            $("#delHostSubmit").removeClass('buttonClickDisable')
        })

}
function bindHost(operType){
    var id=$("#delHostId").html()
    var ip=$("#delHostIp").html()
    $("#delHostSubmit").addClass('buttonClickDisable')
    if(operType=='accept'){
        successTxt="绑定成功"
        errorTxt="绑定失败"
    }else{
        successTxt="解绑成功"
        errorTxt="解绑失败"
    }
    $.when(req_ajax('/api/bindHost/',{ip:ip,id:id,operType:operType},'result'))
    .done(function(){
        if (result['code']==-1){
                    showMesage('#delHostSuccessTxt','error',result['msg'])
                    $("#delHostSubmit").removeClass('buttonClickDisable')
            }else {
                    showMesage('#delHostSuccessTxt','success',successTxt)
                    location.reload()
            }
    }
    )
    .fail(function(){
            alert(errorTxt)
            $("#delHostSubmit").removeClass('buttonClickDisable')
    })
}
//当前表格中的值显示在更新主机模态框中
function showValue(obj,modalName) {
    $("#delHostSuccessTxt").html('')
    var th=$(obj).parent().parent()
    var id=th.children().eq(0).html()
    var hostName=th.children().eq(1).html()
    var ip=th.children().eq(2).html()
    if (modalName=='update'){
        $("#updateHostId").val(id)
        $("#updateHostName").val(hostName)
        $("#updateIpAddr").val(ip)
    }else if(modalName=='del'){
        $('#modal_title').html("删除主机")
        $('#delHostSubmit').attr("onclick","delHost()")
        $('#delHostId').html(id)
        $('#delHostname').html(hostName)
        $('#delShowInfo').html("是否要删除主机:"+hostName)
    }else if (modalName=='bindHost'){
        $('#modal_title').html("绑定主机")
        $('#delHostSubmit').attr("onclick","bindHost('accept')")
        $('#delHostId').html(id)
        $('#delHostname').html(hostName)
        $('#delHostIp').html(ip)
        $('#delShowInfo').html("是否要将主机"+hostName+"和saltstack绑定")
    }else if (modalName=='unbound'){
        $('#modal_title').html("解除绑定")
        $('#delHostSubmit').attr("onclick","bindHost('delete')")
        $('#delHostId').html(id)
        $('#delHostname').html(hostName)
        $('#delHostIp').html(ip)
        $('#delShowInfo').html("是否要将主机"+hostName+"和saltstack解除绑定")
    }
}
