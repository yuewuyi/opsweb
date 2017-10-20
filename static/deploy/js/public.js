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
function textAuth(type,textId,buttonId,errorTxtID) {
    var hostNameReg=/^[a-zA-Z0-9_\-]{1,20}$/
    var ipReg=/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
    if (type=='hostname'){
        var hostName=$.trim($(textId).val())
        if (hostNameReg.test(hostName)){
            $(buttonId).removeClass('buttonClickDisable')
            showMesage(errorTxtID,'error','')
        }else {
            $(buttonId).addClass('buttonClickDisable')
            showMesage(errorTxtID,'error','主机名格式错误，主机名由数字、字母、-、_、组成')
        }
        return hostNameReg.test(hostName)
    }else if (type=='ip'){
        var ip=$.trim($(textId).val())
        if (ipReg.test(ip)){
            $(buttonId).removeClass('buttonClickDisable')
            showMesage(errorTxtID,'error','')
        }else {
            $(buttonId).addClass('buttonClickDisable')
            showMesage(errorTxtID,'error','ip格式错误')
        }
        return ipReg.test(ip)
    }else if(type=='TemplateName'){
        var TemltateName=$.trim($(textId).val())
        if(hostNameReg.test(TemltateName)){
            $(buttonId).removeClass('buttonClickDisable')
            showMesage(errorTxtID,'error','')
        }else {
            $(buttonId).addClass('buttonClickDisable')
            showMesage(errorTxtID,'error','模板名格式错误，模板名由数字、字母、-、_、组成')
        }
        return hostNameReg.test(TemltateName)
    }
}
function showMesage(id,type,msg) {
    if(type=='error'){
        $(id).removeClass('green')
        $(id).addClass('red')
    }else if(type=='success'){
        $(id).removeClass('red')
        $(id).addClass('green')
    }
    $(id).html(msg)
}