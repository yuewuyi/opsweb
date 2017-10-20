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
    var startCmd=th.children().eq(2).html()
    var stopCmd=th.children().eq(3).html()
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