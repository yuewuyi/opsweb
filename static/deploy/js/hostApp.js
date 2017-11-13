function createModal(head,body) {
    $('#customModal').remove()
    var modalOb=['<div class="modal" id="customModal">',
                        '<div class="modal_container">',
                            '<div class="modal-content radius">',
                                '<div class="modal_header">',
                                    '<span id="showMsg" class="show_mesg"></span>',
                                '</div>',
                                '<div class="page_hr"></div>',
                                '<div class="modal_body">',
                                '</div>',
                                '<div class="page_hr"></div>',
                                '<div class="modal_footer">',
                                    '<div class="ButtonStyle SearchButton" id="submitButton" onclick="">确定</div>',
                                    '<div class="ButtonStyle ResetButton" data-dismiss="modal">关闭</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>'
                    ]
    modalOb[3]=modalOb[3]+head
    modalOb[7]=modalOb[7]+body.join('')
    $(".page_container").after(modalOb.join(''))
    $("#customModal").modal("show")
}
function  addModal(type,appid) {
    if (type=='add'){
        var titleName="添加应用"
        var body=[
            '应用名 <input id="appName" type="text" class="modalTextStyle" onblur="textAuth(\'appName\',\'#appName\',\'#submitButton\',\'#showMsg\')"><br/><br/>',
            '应用路径 <input id="appPath" type="text" class="modalTextStyle"><br/><br/>',
            '应用端口 <input id="appPort" type="text" class="modalTextStyle" onblur="textAuth(\'port\',\'#appPort\',\'#submitButton\',\'#showMsg\')"><br/><br/>',
            '应用模板名 <input id="appTempName" type="text" class="modalTextStyle" autocomplete="off">',
        ]
        $.when(req_ajax('/api/getTemplate/','','appTemp'))
            .done(function () {
                listenText('#appTempName',appTemp)
            })
        .fail(function () {
            alert('模板请求失败')
        })
    }else if(type=='modify'){
        var appTemplate=$.trim($("#appTemplate"+appid).html())
        var appPath=$.trim($("#appPath"+appid).html().split(':')[1])
        var appPort=$.trim($("#appPort"+appid).html().split(':')[1])
        var appName=$.trim($("#appName"+appid).html())
        var titleName="修改应用"
        var body=[
            '应用id <input id="appId" type="text" value="'+appid+'" class="modalTextStyle readOnlyStyle" readonly="true"><br/><br/>',
            '应用名 <input id="appName" type="text" value="'+appName+'" class="modalTextStyle" onblur="textAuth(\'appName\',\'#appName\',\'#submitButton\',\'#showMsg\')"><br/><br/>',
            '应用路径 <input id="appPath" type="text" value="'+appPath+'" class="modalTextStyle"><br/><br/>',
            '应用端口 <input id="appPort" type="text" value="'+appPort+'" class="modalTextStyle" onblur="textAuth(\'port\',\'#appPort\',\'#submitButton\',\'#showMsg\')"><br/><br/>',
            '应用模板名 <input id="appTempName" type="text" value="'+appTemplate+'" class="modalTextStyle" autocomplete="off">',
        ]
    }else if(type=='del'){
        var appName=$.trim($("#appName"+appid).html())
        var titleName="删除应用"
        var body=[
            '<span id="appId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否删除应用'+appName+'</span>'
        ]

    }
    var onclick="modApplications('"+type+"')"
    createModal(titleName,body)
    $('#submitButton').attr("onclick",onclick)

}
function modApplications(method) {
    var data={}
    if (method=='add'){
        if(textAuth('appName','#appName','#submitButton','#showMsg') && textAuth('port','#appPort','#submitButton','#showMsg')){

            data['appName']=$.trim($("#appName").val())
            data['appPath']=$.trim($("#appPath").val())
            data['appPort']=parseInt($("#appPort").val())
            data['appTempName']=$.trim($("#appTempName").val())
            data['method']=method
            data['hostId']=parseInt(sessionStorage.hostId)
            var alertmsg="添加应用失败"
            var successTxt="添加应用成功"
        }
    }else if(method=='modify'){
        if(textAuth('appName','#appName','#submitButton','#showMsg') && textAuth('port','#appPort','#submitButton','#showMsg')){
            data['id']=parseInt($("#appId").val())
            data['method']=method
            data['appName']=$.trim($("#appName").val())
            data['appPath']=$.trim($("#appPath").val())
            data['appPort']=parseInt($("#appPort").val())
            data['appTempName']=$.trim($("#appTempName").val())
            data['hostId']=parseInt(sessionStorage.hostId)
            var alertmsg="修改应用失败"
            var successTxt="修改应用成功"
        }
    }else if(method=='del'){
            data['id']=parseInt($("#appId").html())
            data['method']=method
            var alertmsg="删除应用失败"
            var successTxt="删除应用成功"
    }
    var url='/api/modApplication/'
    $("#submitButton").addClass('buttonClickDisable')
    $.when(req_ajax(url,data,'result'))
        .done(function () {
            if (result['code']==-1){
                showMesage('#showMsg','error',result['msg'])
                $("#submitButton").removeClass('buttonClickDisable')
            }else {
                showMesage('#showMsg','success',successTxt)
                location.reload()
            }
        })
        .fail(function () {
            alert(alertmsg)
            $("#submitButton").removeClass('buttonClickDisable')
        })
    }
function createApp(data){
    if (data['status']==0){
        var appColor='stopColor'
    }else if(data['status']==1){
        var appColor='runColor'
    }
    var appOb=[
        '<span class="appContainer '+appColor+'" id="app"'+data['id']+'>',
'        <div class="appTitleContainer">',
'            <span id="appName'+data['id']+'">'+data['hostAppName']+'</span>',
'            <span id="appTemplate'+data['id']+'" style="display: none;">'+data['appTemplateName']+'</span>',
'            <span class="glyphicon glyphicon-remove iconStyle" onclick="addModal(\'del\','+data['id']+')"></span>',
'            <span class="glyphicon glyphicon-pencil iconStyle" onclick="addModal(\'modify\','+data['id']+')"></span>',
'        </div>',
'        <div class="appContainerHr"></div>',
'        <div class="appContainerBody">',
'            <span class="appInfo" id="appPort'+data['id']+'">端口: '+data['appPort']+'</span>',
'            <div class="appContainerHr"></div>',
'            <span class="appInfo" id="appPath'+data['id']+'">路径: '+data['appPath']+'</span>',
'            <div class="appContainerHr"></div>',
'        </div>',
'        <div class="appContainerHr"></div>',
'        <div class="appContainerFooter">',
'            <span class="appButton runColor">启动</span>',
'            <span class="appButton updateButton">部署</span>',
'        </div>',
'</span>',
    ]
    $(".page_container").append(appOb.join(''))
}
// 页面初始化是请求应用
function loadApp() {
    $.when(req_ajax('/api/getApplication/',{hId:sessionStorage.hostId},'result'))
        .done(function () {
            for(i=0;i<result.length;i++){
                createApp(result[i])
            }
        })
        .fail(function () {
            alert("应用请求失败")
        })
}
$(document).ready(function () {
    sessionStorage.hostId=getQueryString('hostId')
    loadApp()
})