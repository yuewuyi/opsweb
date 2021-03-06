//创建Modal
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
//动态modal
function  addModal(type,appid) {
    var onclick="modApplications('"+type+"')"
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

    }else if (type=='addWeb'){
        var titleName="添加web"
        var body=[
            '<span id="appId" style="display: none;">'+appid+'</span>',
            '应用模板名 <input id="webTempName" type="text" class="modalTextStyle" autocomplete="off">',
        ]
        $.when(req_ajax('/api/getWebTemplate/',{method:'web'},'appTemp'))
            .done(function () {
                listenText('#webTempName',appTemp)
            })
        .fail(function () {
            alert('web模板请求失败')
        })
    }else if(type=='delWeb'){
        var titleName="删除web"
        var appName=$.trim($("#webAppName"+appid).html())
        var body=[
            '<span id="appId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否删除web应用'+appName+'</span>'
        ]
        event.stopPropagation()
    }else if (type=='start'){
        var titleName="启动应用"
        var appName=$.trim($("#appName"+appid).html())
        var body=[
            '<span id="appId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否启动应用'+appName+'</span>'
        ]
    }else if (type=='stop'){
        var titleName="停止应用"
        var appName=$.trim($("#appName"+appid).html())
        var body=[
            '<span id="appId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否停止应用'+appName+'</span>'
        ]
    }else if(type=='reset'){
        var titleName="停止应用"
        var appName=$.trim($("#appName"+appid).html())
        var body=[
            '<span id="appId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否重置应用'+appName+'</span>'
        ]
    }else if(type=='showCmdinfo'){
        var titleName="命令执行情况详情"
        var cmdInfo=$.trim($("#cmdInfo"+appid).html())
        var body=[
            '<span class="showInfo">'+cmdInfo+'</span>'
        ]
    }else if(type=='backup'){
        var titleName="备份应用"
        var body=[
            '<span class="showInfo">是否要备份此应用</span>'
        ]
    }else if(type=='deployApp'){
        var titleName="部署应用"
        var body=[
            '<span id="fileId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否部署此应用</span>'
        ]
    }
    else if(type=='restoreApp'){
        var titleName="回滚应用"
        var body=[
            '<span id="fileId" style="display: none;">'+appid+'</span>',
            '<span class="showInfo">是否回滚此应用</span>'
        ]
    }
    createModal(titleName,body)
    $('#submitButton').attr("onclick",onclick)
}
// 应用操作
function modApplications(method) {
    var data={}
    //添加应用
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
            var url='/api/modApplication/'
        }else {
            return false
        }

    }
    //修改应用
    else if(method=='modify'){
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
            var url='/api/modApplication/'
        }else {
            return false
        }

    }
    //删除应用
    else if(method=='del'){
            data['id']=parseInt($("#appId").html())
            data['method']=method
            var alertmsg="删除应用失败"
            var successTxt="删除应用成功"
            var url='/api/modApplication/'

    }
    //启动应用
    else if(method=='start'){
            data['id']=parseInt($("#appId").html())
            data['method']=method
            var alertmsg="应用启动失败"
            var successTxt="应用启动操作成功"
            var url='/api/startStopApp/'
    }
    //停止应用
    else if(method=='stop'){
            data['id']=parseInt($("#appId").html())
            data['method']=method
            var alertmsg="应用停止失败"
            var successTxt="应用停止操作成功"
            var url='/api/startStopApp/'
    }
    //重置应用
    else if(method=='reset'){
        data['id']=parseInt($("#appId").html())
        data['method']=method
        var alertmsg="应用重置失败"
        var successTxt="应用重置成功"
        var url='/api/startStopApp/'
    }
    //添加web应用)
    else if(method=='addWeb'){
            data['appId']=parseInt($("#appId").html())
            data['webAppName']=$.trim($("#webTempName").val())
            data['method']=method
            var alertmsg="添加WEB应用失败"
            var successTxt="添加WEB应用成功"
            var url='/api/modWebApplication/'

    }
    //删除web应用
    else if(method=='delWeb'){
            data['appId']=parseInt($("#appId").html())
            data['method']=method
            var alertmsg="删除WEB应用失败"
            var successTxt="删除WEB应用成功"
            var url='/api/modWebApplication/'
    }
    //备份应用
    else if(method=='backup'){
        data['appId']=parseInt($("#dappId").html())
        data['appType']=parseInt($("#dappType").html())
        if (data['appType']==1){
               data['webId']=parseInt($("#dwebId").html())
        }
        data['method']=method
        var successTxt="备份请求成功"
        var alertmsg="备份请求失败"
        var url='/api/deployBackUp/'
    }
    //部署应用
    else if(method=='deployApp'){
        data['appId']=parseInt($("#dappId").html())
        data['appType']=parseInt($("#dappType").html())
        data['fileId']=parseInt($("#fileId").html())
        if (data['appType']==1){
               data['webId']=parseInt($("#dwebId").html())
        }
        data['method']='deployApp'
        var successTxt="部署请求成功"
        var alertmsg="部署请求失败"
        var url='/api/deployBackUp/'
    }
    //回滚应用
    else if(method=='restoreApp'){
        data['appId']=parseInt($("#dappId").html())
        data['appType']=parseInt($("#dappType").html())
        data['fileId']=parseInt($("#fileId").html())
        if (data['appType']==1){
               data['webId']=parseInt($("#dwebId").html())
        }
        data['method']=method
        var successTxt="回滚请求成功"
        var alertmsg="回滚请求失败"
        var url='/api/deployBackUp/'
    }
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
// 创建应用
function createApp(data){
    var modApp=[]
    var body=[]
    var loader=[]
    if (data['status']==0){
        var appColor='stopColor'
        var button='<span class="appButton runColor">启动</span>'
        var modApp=[
            '<span class="glyphicon glyphicon-remove iconStyle" onclick="addModal(\'del\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-pencil iconStyle" onclick="addModal(\'modify\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-play iconStyle" onclick="addModal(\'start\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-tasks iconStyle" onclick="showDeplotModal(0,'+data['id']+',\'\')"></span>',
        ]
        var body=[
            '<span class="appInfo" id="appPort'+data['id']+'">端口: '+data['appPort']+'</span>',
            '<div class="appContainerHr"></div>',
            '<span class="appInfo" id="appPath'+data['id']+'">路径: '+data['appPath']+'</span>',
            '<div class="appContainerHr"></div>',
        ]
    }else if(data['status']==1){
        var appColor='runColor'
        var body=[
            '<span class="appInfo" id="appPort'+data['id']+'">端口: '+data['appPort']+'</span>',
            '<div class="appContainerHr"></div>',
            '<span class="appInfo" id="appPath'+data['id']+'">路径: '+data['appPath']+'</span>',
            '<div class="appContainerHr"></div>',
        ]
        var modApp=[
            '<span class="glyphicon glyphicon-stop iconStyle" onclick="addModal(\'stop\','+data['id']+')"></span>',
        ]
    }else if(data['status']==2){
        var appColor='startingColor'
        var loader=[
            '<div class="loader"></div>',
            '<div class="stateMesg">应用启动中</div>'
        ]
    }else if(data['status']==3){
        var appColor='stopingColor'
        var loader=[
            '<div class="loader"></div>',
            '<div class="stateMesg">应用停止中</div>'
        ]
    }else if(data['status']==4){
        var appColor='deployingColor'
        var loader=[
            '<div class="loader"></div>',
            '<div class="stateMesg">应用部署中</div>'
        ]
    }else if(data['status']==5){
        var appColor='startingColor'
        var modApp=[
            '<span class="glyphicon glyphicon-repeat iconStyle" onclick="addModal(\'reset\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-list-alt iconStyle" onclick="addModal(\'showCmdinfo\','+data['id']+')"></span>',
        ]
        var loader=[
            '<div class="stateMesg">启动失败</div>',
            '<div style="display: none;" id="cmdInfo'+data['id']+'">'+data['msg']+'</div>'
        ]
    }else if(data['status']==6){
        var appColor='stopingColor'
        var modApp=[
            '<span class="glyphicon glyphicon-repeat iconStyle" onclick="addModal(\'reset\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-list-alt iconStyle" onclick="addModal(\'showCmdinfo\','+data['id']+')"></span>',
        ]
        var loader=[
            '<div class="stateMesg">停止失败</div>',
            '<div style="display: none;" id="cmdInfo'+data['id']+'">'+data['msg']+'</div>'
        ]
    }else if(data['status']==7){
        var appColor='stopingColor'
        var modApp=[
            '<span class="glyphicon glyphicon-repeat iconStyle" onclick="addModal(\'reset\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-list-alt iconStyle" onclick="addModal(\'showCmdinfo\','+data['id']+')"></span>',
        ]
        var loader=[
            '<div class="stateMesg">命令执行成功,但程序没响应</div>',
            '<div style="display: none;" id="cmdInfo'+data['id']+'">'+data['msg']+'</div>'
        ]
    }else if(data['status']==8){
        var appColor='deployingColor'
        var loader=[
            '<div class="loader"></div>',
            '<div class="stateMesg">应用备份中</div>'
        ]
    }else if(data['status']==9){
        var appColor='stopingColor'
        var modApp=[
            '<span class="glyphicon glyphicon-repeat iconStyle" onclick="addModal(\'reset\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-list-alt iconStyle" onclick="addModal(\'showCmdinfo\','+data['id']+')"></span>',
        ]
        var loader=[
            '<div class="stateMesg">备份失败</div>',
            '<div style="display: none;" id="cmdInfo'+data['id']+'">'+data['msg']+'</div>'
        ]
    }else if(data['status']==10){
        var appColor='stopingColor'
        var modApp=[
            '<span class="glyphicon glyphicon-repeat iconStyle" onclick="addModal(\'reset\','+data['id']+')"></span>',
            '<span class="glyphicon glyphicon-list-alt iconStyle" onclick="addModal(\'showCmdinfo\','+data['id']+')"></span>',
        ]
        var loader=[
            '<div class="stateMesg">部署失败</div>',
            '<div style="display: none;" id="cmdInfo'+data['id']+'">'+data['msg']+'</div>'
        ]
    }
    var appOb=[
        '<span class="appContainer '+appColor+'" id="app'+data['id']+'">',
            '<div class="appTitleContainer">',
            '<span id="appName'+data['id']+'">'+data['hostAppName']+'</span>',
            '<span id="appTemplate'+data['id']+'" style="display: none;">'+data['appTemplateName']+'</span>'+modApp.join(''),
            '</div>',
            '<div class="appContainerHr"></div>',
            '<div class="appContainerBody">'+body.join('')+loader.join(''),
            '</div>',
        '</span>',
    ]
    $(".page_container").append(appOb.join(''))
    if (data['appTemplateName']=='tomcat' && data['status']==0){
        var webapp=''
        for(var i=0;i<data['webApp'].length;i++){
            webapp+='<span class="webAppName" onclick="showDeplotModal(1,'+data['id']+','+data['webApp'][i]['id']+')">'
            webapp+='<span id="webAppName'+data['webApp'][i]['id']+'">'+data['webApp'][i]['webTemplateName']+'</span>'
            webapp+='<span class="glyphicon glyphicon-remove-sign removeIcon" onclick="addModal(\'delWeb\','+data['webApp'][i]['id']+')"></span>'
            webapp+='</span>'
        }
        webapp+='<span class="glyphicon glyphicon-plus-sign addIcon" onclick="addModal(\'addWeb\','+data['id']+')"></span>'
        $("#app"+data['id']+' .appContainerBody').append(webapp)
    }else if(data['appTemplateName']=='tomcat' && data['status']==1){
        var webapp=''
        for(var i=0;i<data['webApp'].length;i++){
            webapp+='<span class="webAppName">'+data['webApp'][i]['webTemplateName']+'</span>'
        }
        $("#app"+data['id']+' .appContainerBody').append(webapp)
    }
}
function tabChange(id) {
    if(id=='appDeployButton'){
        $("#appDeployButton").addClass('active')
        $("#appReButton").removeClass('active')
    }else if(id=='appReButton'){
        $("#appDeployButton").removeClass('active')
        $("#appReButton").addClass('active')
    }
}
function  showTable(id,data,type) {
    var body=''
    if (type==1){
        body+='<tr><th>id</th><th>文件版本</th><th>所属应用</th><th>创建时间</th><th>操作</th></tr>'
        for (var i=0;i< data.length;i++){
            body+='<tr><td>'+data[i]['id']+'</td>'
            body+='<td>'+data[i]['version']+'</td>'
            body+='<td>'+data[i]['appName']+'</td>'
            body+='<td>'+data[i]['create_date']+'</td>'
            if (data[i]['type']==0) {
                body += '<td><div class="ButtonStyle deployButton SearchButton" onclick="addModal(\'restoreApp\',' + data[i]['id'] + ')">回滚</div></td></tr>'
            }else if(data[i]['type']==1){
                body += '<td><div class="ButtonStyle deployButton SearchButton" onclick="addModal(\'restoreApp\',' + data[i]['id'] + ')">回滚</div></td></tr>'
            }
        }
    }else if(type==0){
        body+='<tr><th>id</th><th>文件版本</th><th>文件包类型</th><th>创建时间</th><th>操作</th></tr>'
        for (var i=0;i< data.length;i++){
            body+='<tr><td>'+data[i]['id']+'</td>'
            body+='<td>'+data[i]['version']+'</td>'
            if (data[i]['filePackType']==0){
                body+='<td>完整包</td>'
            }else if(data[i]['filePackType']==1){
                body+='<td>补丁包</td>'
            }
            body+='<td>'+data[i]['create_date']+'</td>'
            if (data[i]['type']==0){
                body+='<td><div class="ButtonStyle deployButton SearchButton" onclick="addModal(\'deployApp\','+data[i]['id']+')">部署</div></td></tr>'
            }else if(data[i]['type']==1){
                body+='<td><div class="ButtonStyle deployButton SearchButton" onclick="addModal(\'deployApp\','+data[i]['id']+')">部署</div></td></tr>'
            }
        }
    }

    $(id).append(body)
}
//显示部署模态框
function showDeplotModal(type,id,webid) {
    $("#dappId").html(id)
    $("#dappType").html(type)
    $("#dwebId").html(webid)
    $('#deployTable tr').remove()
    $('#reTable tr').remove()
    var qid=id
    if (type==1){
        qid=webid
    }
    $.when(req_ajax('/api/getFile/',{id:qid,type:type,fileType:0},'deployFile'),req_ajax('/api/getFile/',{id:qid,type:type,fileType:1,hostId:sessionStorage.hostId},'backFile'))
        .done(function () {
            showTable('#deployTable',deployFile,0)
            showTable('#reTable',backFile,1)
        })
        .fail(function () {
            alert("获取数据失败")
        })
    $('#hostDeploy').modal('show')
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