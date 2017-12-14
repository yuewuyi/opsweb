function tabChange(id) {
    if(id=='fileViewTab'){
        $("#fileViewTab").addClass('active')
        $("#fileUploadTab").removeClass('active')
    }else if(id=='fileUploadTab'){
        $("#fileViewTab").removeClass('active')
        $("#fileUploadTab").addClass('active')

    }

}
function searchSubmit(){
    var templateName=escape($.trim($("#appTemplate").val()))
    var version=escape($.trim($("#version").val()))
    var packType=$("#filePackType").select().val()
    location.href=window.location.pathname+'?templateName='+templateName+'&version='+version+'&packType='+packType
}
function  addModal(type,id) {
    var onclick="modFileInfo('"+type+"')"
    if (type=='add'){
        var titleName="添加文件"
        var body=[
            '版本 <input id="fileVersion" type="text" onblur="textAuth(\'version\',\'#fileVersion\',\'#submitButton\',\'#showMsg\')" class="modalTextStyle"><br/><br/>',
            '创建人 <input id="createName" type="text" onblur="textAuth(\'name\',\'#createName\',\'#submitButton\',\'#showMsg\')" class="modalTextStyle"><br/><br/>',
            '备注 <input id="remark" type="text" class="modalTextStyle"><br/><br/>',
            '应用类型 <select id="type" class="modalSelectStyle"><option value="1">web应用</option><option value="0">普通应用</option></select><br/><br/>',
            '应用模板名 <input id="appTempName" type="text" class="modalTextStyle" autocomplete="off"><br/><br/>',
            '文件包类型 <select id="packtype" class="modalSelectStyle"><option value="1">补丁包</option><option value="0">完整包</option></select><br/><br/>',
        ]
        $.when(req_ajax('/api/getWebTemplate/','','appTemp'))
            .done(function () {
                listenText('#appTempName',appTemp)
                appTypeChange()
            })
        .fail(function () {
            alert('模板请求失败')
        })
    }else if(type=='modify'){
        var titleName="修改信息"
        var th=$(id).parent().parent()
        var id=th.children().eq(0).html()
        var packType=th.children().eq(2).html()
        var type=th.children().eq(3).html()
        var templateName=th.children().eq(4).html()
        var fileVersion=th.children().eq(5).html()
        var name=th.children().eq(7).html()
        var remark=th.children().eq(8).html()
        var body=[
            'id <input id="fileId" class="modalTextStyle readOnlyStyle" value="'+id+'" type="text" readonly><br/><br/>',
            '版本 <input id="fileVersion" type="text" onblur="textAuth(\'version\',\'#fileVersion\',\'#submitButton\',\'#showMsg\')" value="'+fileVersion+'" class="modalTextStyle"><br/><br/>',
            '创建人 <input id="createName" type="text" value="'+name+'" onblur="textAuth(\'name\',\'#createName\',\'#submitButton\',\'#showMsg\')" class="modalTextStyle"><br/><br/>',
            '备注 <input id="remark" type="text" value="'+remark+'" class="modalTextStyle"><br/><br/>',
            '',
            '应用模板名 <input id="appTempName" type="text" value="'+templateName+'" class="modalTextStyle" autocomplete="off"><br/><br/>',
            '',
        ]
        if (packType==='完整包'){

            body[4]='文件包类型 <select id="packType" class="modalSelectStyle"><option value="1">补丁包</option><option value="0" selected="selected">完整包</option></select><br/><br/>'
        }else if(packType=='补丁包'){
            body[4]='文件包类型 <select id="packType" class="modalSelectStyle"><option value="1"  selected="selected">补丁包</option><option value="0">完整包</option></select><br/><br/>'
        }
        if (type=='普通应用'){
            body[6]='应用类型 <select id="type" class="modalSelectStyle"><option value="1">web应用</option><option value="0" selected="selected">普通应用</option></select><br/><br/>'
        }else if(type=='web应用'){
            body[6]='应用类型 <select id="type" class="modalSelectStyle"><option value="1" selected="selected">web应用</option><option value="0">普通应用</option></select><br/><br/>'
        }
        $.when(req_ajax('/api/getWebTemplate/','','appTemp'))
            .done(function () {
                listenText('#appTempName',appTemp)
                appTypeChange()
            })
        .fail(function () {
            alert('模板请求失败')
        })
    }else if(type=='del'){
        var titleName="删除文件"
        var th=$(id).parent().parent()
        var id=th.children().eq(0).html()
        var templateName=th.children().eq(4).html()
        var fileVersion=th.children().eq(5).html()
        var body=[
            '<span id="fileId" style="display: none;">'+id+'</span>',
            '<span class="showInfo">是否删除版本为'+fileVersion+'的'+templateName+'</span>'
        ]
    }
    createModal(titleName,body)
    $('#submitButton').attr("onclick",onclick)
}
function modFileInfo(type) {
    var parm={}
    var url='/api/modAppFile/'
    if(type=="add"){
         if (!textAuth('version','#fileVersion','#submitButton','#showMsg') || !textAuth('name','#createName','#submitButton','#showMsg')){
            return false
         }
         parm['version']=$.trim($("#fileVersion").val())
         parm['type']=parseInt($("#type").select().val())
         parm['packType']=parseInt($("#packtype").select().val())
         parm['appTemplate']=$.trim($("#appTempName").val())
         parm['name']=$.trim($("#createName").val())
         parm['remark']=$.trim($("#remark").val())
         parm['method']='add'
         var successTxt="添加成功"
         var alertmsg="添加失败"

    }else if(type=='modify'){
        if (!textAuth('version','#fileVersion','#submitButton','#showMsg') || !textAuth('name','#createName','#submitButton','#showMsg')){
            return false
        }
        var successTxt="修改成功"
        var alertmsg="修改失败"
        parm['method']=type
        parm['id']=parseInt($("#fileId").val())
        parm['version']=$.trim($("#fileVersion").val())
        parm['packType']=parseInt($("#packType").select().val())
        parm['type']=parseInt($("#type").select().val())
        parm['appTemplate']=$.trim($("#appTempName").val())
        parm['name']=$.trim($("#createName").val())
        parm['remark']=$.trim($("#remark").val())

    }else if(type=='del'){
        var successTxt="删除成功"
        var alertmsg="删除失败"
        parm['method']=type
        parm['id']=parseInt($("#fileId").html())
    }
    $("#submitButton").addClass('buttonClickDisable')
    $.when(req_ajax(url,parm,'result'))
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
function appTypeChange() {
    $("#type").change(function () {
        var selectVal=$(this).select().val()
        $("#appTempName").val('')
        if (selectVal==0){
            var url="/api/getTemplate/"
        }else if(selectVal==1){
            var url="/api/getWebTemplate/"
        }
        $.when(req_ajax(url,'','appTemp'))
        .done(function () {
                listenText('#appTempName',appTemp)
            })
        .fail(function () {
            alert('模板请求失败')
         })
    })
}
//文件上传函数
function fileupload(id) {
    var uploader = new plupload.Uploader({
        chunk_size:'1MB',
        browse_button : id,
        url : '/api/managerFileAppApi/',
        headers:{"X-CSRFToken":docCookies.getItem('csrftoken')},
        unique_names:true
    });

    //在实例对象上调用init()方法进行初始化
    uploader.init();

    //绑定各种事件，并在事件监听函数中做你想做的事
    uploader.bind('FilesAdded',function(uploader,files){
        uploader.start();
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    });
    uploader.bind('UploadProgress',function(uploader,file,total){
        $("#progress").html(file.name+file.percent)
        console.log(uploader.total.bytesPerSec)
    });
}
$(document).ready(function () {
    //绑定文件上传按钮
    $( ".fileUploadButton" ).each( function() {
        fileupload($(this).attr('id'))
    })
})