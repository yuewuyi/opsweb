/**
 * Created by suyue on 2017/8/22.
 */

function searchSubmit(){
    var hostName=$.trim($("#hostName").val())
    var ipAddr=$.trim($("#ipAddr").val())
    var saltBind=$("#saltBind").select().val()
    var saltStatus=$("#saltStatus").select().val()
    url=window.location.pathname+'?hostName='+hostName+'&ipAddr='+ipAddr+'&saltBind='+saltBind+'&saltStatus='+saltStatus
    location.href=encodeURI(url)
}
function addHost() {
    if (textAuth('ip') && textAuth('hostname')){
        alert('ok')
    }
}
// 验证主机名和ip
function textAuth(type) {
    var hostNameReg=/^[a-zA-Z0-9_\-]{1,20}$/
    var ipReg=/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
    if (type=='hostname'){
        var hostName=$.trim($("#addHostName").val())
        if (hostNameReg.test(hostName)){
            $('#addHostSubmit').removeClass('buttonClickDisable')
            $('#error_txt').html('')
        }else {
            $('#addHostSubmit').addClass('buttonClickDisable')
             $('#error_txt').html('主机名格式错误，主机名由数字、字母、-、_、组成')
        }
        return hostNameReg.test(hostName)
    }else if (type=='ip'){
        var ip=$.trim($("#addIpAddr").val())
        if (ipReg.test(ip)){
            $('#addHostSubmit').removeClass('buttonClickDisable')
            $('#error_txt').html('')
        }else {
            $('#addHostSubmit').addClass('buttonClickDisable')
            $('#error_txt').html('ip格式错误')
        }
        return ipReg.test(ip)
    }


}