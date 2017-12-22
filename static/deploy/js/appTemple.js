function addTemplate() {
    console.log(textAuth('TemplateName','#templateName','#addTepmlateSubmit','#addTemplateSeccussTxt'))
    if(textAuth('TemplateName','#templateName','#addTepmlateSubmit','#addTemplateSeccussTxt')){
        var templateName=$.trim($('#templateName').val())
        var startCmd=$.trim($('#startCmd').val())
        var stopCmd=$.trim($('#stopCmd').val())
        $("#addTepmlateSubmit").addClass('buttonClickDisable')
        $.when(req_ajax('/api/template/',{templateName:templateName,startCmd:startCmd,stopCmd:stopCmd,method:'add',},'result'))
            .done(function () {
                if (result['code']==-1){
                    showMesage('#addTemplateSeccussTxt','error',result['msg'])
                    $("#addTepmlateSubmit").removeClass('buttonClickDisable')
                }else{
                    showMesage('#addTemplateSeccussTxt','success','模板添加成功')
                    location.reload()
                }
            })
            .fail(function () {
                alert("添加失败")
                $("#addTepmlateSubmit").removeClass('buttonClickDisable')
            })
    }
}
function searchSubmit() {
    var appName=escape($.trim($('#appTemplate')))
    var startCmd=escape($.trim($('#startCmd')))
    var stopCmd=escape($.trim($('#stopCmd')))
    location.href=window.location.pathname+'?appName='+appName+'&startCmd'+startCmd+'&stopCmd'+stopCmd
}
function showValue(obj,operType){
    var th =$(obj).parent().parent()
    var id =th.children().eq(0).html()
    var appName=th.children().eq(1).html()
    var startCmd=th.children().eq(2).text()
    var stopCmd=th.children().eq(3).text()
    if(operType=='update'){
        $("#updateTemplateId").val(id)
        $("#updateTemplateName").val(appName)
        $("#updateStartCmd").val(startCmd)
        $("#updateStopCmd").val(stopCmd)
    }else if(operType=='del'){
        $("#delTemplateId").html(id)
        $("#delTemplateName").html(appName)
        $('#modal_title').html("删除模板")
        $('#delTemplateSubmit').attr("onclick","delTemplate()")
        $("#delShowInfo").html("是否要删除模板"+appName)
    }
}
function updateTemplate() {
    var id= $("#updateTemplateId").val()
    var appName=$("#updateTemplateName").val()
    var startCmd=$("#updateStartCmd").val()
    var stopCmd=$("#updateStopCmd").val()
    $("#delTemplateSubmit").addClass("buttonClickDisable")
    $.when(req_ajax('/api/template/',{id:id,templateName:appName,startCmd:startCmd,stopCmd:stopCmd,method:"update"},'result'))
        .done(function () {
            if(result['code']==-1){
                showMesage("#updateTemplateSuccessTxt","error",result["msg"])
                $("#delTemplateSubmit").removeClass("buttonClickDisable")
            }else{
                showMesage("#updateTemplateSuccessTxt","success","模板更新成功")
                location.reload()
            }
        })
        .fail(function () {
             $("#delTemplateSubmit").removeClass("buttonClickDisable")
             alert("模板更新失败")
        })

}
function delTemplate() {
    var id=$("#delTemplateId").html()
    var appName=$("#delTemplateName").html()
    $("#delTemplateSubmit").addClass("buttonClickDisable")
    $.when(req_ajax('/api/template/',{id:id,templateName:appName,method:'del'},'result'))
        .done(function () {
            if(result['code']==-1){
                showMesage("#delTemplateSuccessTxt","error",result['msg'])
                $("#delTemplateSubmit").removeClass("buttonClickDisable")
            }else {
                showMesage("#delTemplateSuccessTxt","success","删除成功")
                location.reload()
            }

        })
        .fail(function () {
            $("#delTemplateSubmit").removeClass("buttonClickDisable")
            alert("删除失败")
        })

}
function showWebTemp(type) {
    if (type=='web'){
        $.when(req_ajax('/api/getWebTemplate/',{'method':type},'appTemp'))
        .done(function () {
            sessionStorage.webTemplateName=appTemp
            flushWebTable(type,appTemp)
            listenNameInput(type)
            })
        .fail(function () {
            alert('web模板请求失败')
        })
    }else if(type=='appGroup'){
        $.when(req_ajax('/api/getWebTemplate/',{'method':type},'appGroup'))
        .done(function () {
            sessionStorage.appGroup=appGroup
            flushWebTable(type,appGroup)
            listenNameInput(type)
            })
        .fail(function () {
            alert('web模板请求失败')
        })
    }

}
function flushWebTable(type,webApp) {
    if (type=='web'){
        $("#webTable").html('')
        var tbody=''
        for (var i=0;i<webApp.length;i++){
            tbody+='<tr>'
            tbody+='<td>'+webApp[i]+'</td>'
            tbody+='<td><a onclick="addModal(\'del\',\''+webApp[i]+'\')">删除</a></td>'
            tbody+='</tr>'
        }
        $("#webTable").append(tbody)
    }else if(type=='appGroup'){
        $("#appGroupTable").html('')
        var tbody=''
        for (var i=0;i<webApp.length;i++){
            tbody+='<tr>'
            tbody+='<td>'+webApp[i]+'</td>'
            tbody+='<td><a onclick="addModal(\'delGroup\',\''+webApp[i]+'\')">删除</a></td>'
            tbody+='</tr>'
        }
        $("#appGroupTable").append(tbody)
    }

}
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
function addModal(method,tName){
    if (method=='add'){
        var tName=$.trim($("#webTempName").val())
        var titleName="添加web模板"
        var body=[
            '<span id="tName" style="display: none;">'+tName+'</span>',
            '是否要添加web模板:'+tName
        ]
    }else if(method=='del'){
        var titleName="删除web模板"
        var body=[
            '<span id="tName" style="display: none;">'+tName+'</span>',
            '是否要删除web模板:'+tName
        ]
    }else if(method=='addGroup'){
        var tName=$.trim($("#appGroupName").val())
        var titleName="添加应用组"
        var body=[
            '<span id="tName" style="display: none;">'+tName+'</span>',
            '是否要添加应用组:'+tName
        ]
    }else if(method=='delGroup'){
        var titleName="删除应用组"
        var body=[
            '<span id="tName" style="display: none;">'+tName+'</span>',
            '是否要删除应用组:'+tName
        ]
    }
    var onclick="modWebTemplate('"+method+"')"
    createModal(titleName,body)
    $('#submitButton').attr("onclick",onclick)
}
function modWebTemplate(method) {
    var data={}
    if (method=='add'){
        var url="/api/modWebTemplate/"
        data['method']=method
        data['name']=$("#tName").html()
        var successTxt="添加成功"
        var alertmsg="添加失败"
    }else if(method=='del'){
        var url="/api/modWebTemplate/"
        data['method']=method
        data['name']=$("#tName").html()
        var successTxt="删除成功"
        var alertmsg="删除失败"
    }else if(method=='addGroup'){
        var url="/api/modWebTemplate/"
        data['method']=method
        data['name']=$("#tName").html()
        var successTxt="添加成功"
        var alertmsg="添加失败"
    }else if(method=='delGroup'){
        var url="/api/modWebTemplate/"
        data['method']=method
        data['name']=$("#tName").html()
        var successTxt="删除成功"
        var alertmsg="删除失败"
    }
    $("#submitButton").addClass('buttonClickDisable')
    $.when(req_ajax(url,data,'result'))
        .done(function () {
            if (result['code']==-1){
                showMesage('#showMsg','error',result['msg'])
                $("#submitButton").removeClass('buttonClickDisable')
            }else {
                showMesage('#showMsg','success',successTxt)
                if(method=='add' || method=='del'){
                    sessionStorage.webTemplateName=result['result']
                    setTimeout(function(){
                    $("#customModal").modal("hide")
                    flushWebTable('web',result['result'])
                    },1000)
                }else if(method=='addGroup' || method=='delGroup'){
                    sessionStorage.appGroup=result['result']
                    setTimeout(function(){
                    $("#customModal").modal("hide")
                    flushWebTable('appGroup',result['result'])
                    },1000)
                }
                $("#submitButton").removeClass('buttonClickDisable')


            }
        })
        .fail(function () {
            alert(alertmsg)
            $("#submitButton").removeClass('buttonClickDisable')
        })
}
function  listenNameInput(type) {
    if(type=='web'){
       $("#webTempName").keyup(function () {
        var data=sessionStorage.webTemplateName.split(',')
        var textName=$("#webTempName").val()
        var inputList=[]
        for (var i=0;i<data.length;i++){
            var reg=new RegExp(textName)
            if(reg.test(data[i])){
                inputList.push(data[i])
            }
        }
        flushWebTable(type,inputList)
    })
    }else if(type=='appGroup'){
        $("#appGroupName").keyup(function () {
        var data=sessionStorage.appGroup.split(',')
        var textName=$("#appGroupName").val()
        var inputList=[]
        for (var i=0;i<data.length;i++){
            var reg=new RegExp(textName)
            if(reg.test(data[i])){
                inputList.push(data[i])
            }
        }
        flushWebTable(type,inputList)
    })
    }
}