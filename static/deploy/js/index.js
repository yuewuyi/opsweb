/**
 * Created by suyue on 2017/8/22.
 */

function searchSubmit(){
    var hostName=$.trim($("#hostName").val())
    var ipAddr=$.trim($("#ipAddr").val())
    var saltBind=$("#saltBind").select().val()
    var saltStatus=$("#saltStatus").select().val()
    var url=window.location.pathname+'?hostName='+hostName+'&ipAddr='+ipAddr+'&saltBind='+saltBind+'&saltStatus='+saltStatus
    location.href=encodeURI(url)
}
function addHost() {
    if (textAuth('hostname','#addHostName','#addHostSubmit','#addHostErrorTxt') && textAuth('ip','#addIpAddr','#addHostSubmit','#addHostErrorTxt')){
        var hostName=$.trim($("#addHostName").val())
        var ip=$.trim($("#addIpAddr").val())
        $("#addHostSubmit").addClass('buttonClickDisable')
        $.when(req_ajax('/api/addHost/',{hostName:hostName,ip:ip},'result'))
            .done(function () {
                if (result['code']==-1){
                    $('#addHostErrorTxt').html(result['msg'])
                    $("#addHostSubmit").removeClass('buttonClickDisable')
                }else {
                    $('#addHostErrorTxt').html('')
                    $('#addHostSuccessTxt').html('添加成功')
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
    if(textAuth('hostname','#updateHostName','#updateHostSubmit','#updateHostErrorTxt') && textAuth('ip','#updateIpAddr','#updateHostSubmit','#updateHostErrorTxt')){
        $("#updateHostSubmit").addClass('buttonClickDisable')
        var hostName=$.trim($("#updateHostName").val())
        var ip=$.trim($("#updateIpAddr").val())
        var id=$("#updateHostId").val()
         $.when(req_ajax('/api/updateHost/',{hostName:hostName,ip:ip,id:id},'result'))
             .done(function () {
                if (result['code']==-1){
                    $('#updateHostErrorTxt').html(result['msg'])
                    $("#updateHostSubmit").removeClass('buttonClickDisable')
                }else {
                    $('#updateHostErrorTxt').html('')
                    $('#updateHostSuccessTxt').html('更新成功')
                    var url=window.location.href
                    window.location.href=url
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
    $.when(req_ajax('/api/delHost/',{hostName:hostName,id:id},'result'))
        .done(function () {
            if (result['code']==-1){
                    $('#delHostErrorTxt').html(result['msg'])
                    $("#delHostSubmit").removeClass('buttonClickDisable')
            }else {
                    $('#delHostErrorTxt').html('')
                    $('#delHostSuccessTxt').html('删除成功')
                    var url=window.location.href
                    window.location.href=url
            }
        })
        .fail(function () {
            alert("删除主机失败")
            $("#delHostSubmit").removeClass('buttonClickDisable')
        })

}
function bindHost(){
    var id=$("#delHostId").html()
    var ip=$("#delHostIp").html()
    $.when(req_ajax('/api/bindHost/',{ip:ip,id:id},'result'))
    .done(function(){

    }
    )
    .fail(function(){
        alert("smart")
    })
}
//当前表格中的值显示在更新主机模态框中
function showValue(obj,modalName) {
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
        $('#delHostSubmit').attr("onclick","bindHost()")
        $('#delHostId').html(id)
        $('#delHostname').html(hostName)
        $('#delHostIp').html(ip)
        $('#delShowInfo').html("是否要将主机"+hostName+"和saltstack绑定")
    }
}
// 验证主机名和ip
function textAuth(type,textId,buttonId,errorTxtID) {
    var hostNameReg=/^[a-zA-Z0-9_\-]{1,20}$/
    var ipReg=/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
    if (type=='hostname'){
        var hostName=$.trim($(textId).val())
        if (hostNameReg.test(hostName)){
            $(buttonId).removeClass('buttonClickDisable')
            $(errorTxtID).html('')
        }else {
            $(buttonId).addClass('buttonClickDisable')
             $(errorTxtID).html('主机名格式错误，主机名由数字、字母、-、_、组成')
        }
        return hostNameReg.test(hostName)
    }else if (type=='ip'){
        var ip=$.trim($(textId).val())
        if (ipReg.test(ip)){
            $(buttonId).removeClass('buttonClickDisable')
            $(errorTxtID).html('')
        }else {
            $(buttonId).addClass('buttonClickDisable')
            $(errorTxtID).html('ip格式错误')
        }
        return ipReg.test(ip)
    }
}
//翻页
function pageTurn(pageId) {
    var url=window.location.href
    var StringReg=/pageId=[0-9]{1,4}/
    if(getQueryString('pageId')){
        url=url.replace(StringReg,'pageId='+pageId)
        window.location.href=url
    }else if(window.location.search){
        window.location.href=url+"&pageId="+pageId
    }else {
        window.location.href=url+"?pageId="+pageId
    }
}