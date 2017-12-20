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
            '应用类型 <select id="type" class="modalSelectStyle"><option value="1">web应用</option><option value="0">普通应用</option></select><br/><br/>',
            '应用模板名 <input id="appTempName" type="text" class="modalTextStyle" autocomplete="off"><br/><br/>',
            '文件包类型 <select id="packtype" class="modalSelectStyle"><option value="1">补丁包</option><option value="0">完整包</option></select><br/><br/>',
            '备注 <textarea id="remark" rows="6" class="modalTextarea"></textarea><br/><br/><br/><br/><br/><br/>',
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
        var remark=th.children().eq(8).children().eq(1).text()
        var body=[
            'id <input id="fileId" class="modalTextStyle readOnlyStyle" value="'+id+'" type="text" readonly><br/><br/>',
            '版本 <input id="fileVersion" type="text" onblur="textAuth(\'version\',\'#fileVersion\',\'#submitButton\',\'#showMsg\')" value="'+fileVersion+'" class="modalTextStyle"><br/><br/>',
            '创建人 <input id="createName" type="text" value="'+name+'" onblur="textAuth(\'name\',\'#createName\',\'#submitButton\',\'#showMsg\')" class="modalTextStyle"><br/><br/>',
            '',
            '应用模板名 <input id="appTempName" type="text" value="'+templateName+'" class="modalTextStyle" autocomplete="off"><br/><br/>',
            '',
            '备注 <textarea id="remark" rows="6" class="modalTextarea">'+remark+'</textarea><br/><br/><br/><br/><br/><br/>',
        ]
        if (packType==='完整包'){
            body[3]='文件包类型 <select id="packType" class="modalSelectStyle"><option value="1">补丁包</option><option value="0" selected="selected">完整包</option></select><br/><br/>'
        }else if(packType=='补丁包'){
            body[3]='文件包类型 <select id="packType" class="modalSelectStyle"><option value="1"  selected="selected">补丁包</option><option value="0">完整包</option></select><br/><br/>'
        }
        if (type=='普通应用'){
            body[5]='应用类型 <select id="type" class="modalSelectStyle"><option value="1">web应用</option><option value="0" selected="selected">普通应用</option></select><br/><br/>'
        }else if(type=='web应用'){
            body[5]='应用类型 <select id="type" class="modalSelectStyle"><option value="1" selected="selected">web应用</option><option value="0">普通应用</option></select><br/><br/>'
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
//生成文件md5
function createFileMd5(file) {
    var dtd = $.Deferred()
    var chunkSize=2097152
    var chunks=Math.ceil(file.size / chunkSize)
    var currChunk=0
    var fileReader = new FileReader()
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    var spark = new SparkMD5()
    fileReader.onload=function () {
        spark.appendBinary(fileReader.result)
        if (currChunk<chunks){
            currChunk++
            readNext()
        }else {
            dtd.resolve(spark.end())
            return dtd.promise()
        }
    }
    function readNext() {
        fileReader.readAsBinaryString(blobSlice.call(file,chunkSize*currChunk,chunkSize*(currChunk+1)))
    }
    readNext()
    return dtd.promise()
}
//文件上传函数
function fileupload(id) {
    var fid=id.split('fileUploadButton')[1]
    var uploaderObject = new plupload.Uploader({
        chunk_size:'1MB',
        browse_button : id,
        url : '/api/uploadFile/',
        headers:{"X-CSRFToken":docCookies.getItem('csrftoken')},
        unique_names:true,
        multi_selection:false,
        multipart_params:{upDate:new Date().format("Y-m-d")}
    })
    uploaderObject.init()
    uploaderObject.bind('FilesAdded',function(uploader,files){
        var fname=files[0].name
        uploaderObject.disableBrowse(true)
        $("#"+id).addClass('buttonClickDisable')
        $("#"+id).html('上传中')
        addprogress(fname,fid)
        uploaderObject.start()
    });
    uploaderObject.bind('UploadProgress',function(uploader,file){
        var percent=file.percent+'%'
        var upSpeed=unit_format(uploader.total.bytesPerSec,'B','float')
        $("#fileprogress"+fid+" .progress .progress-bar").width(percent)
        $("#fileprogress"+fid+" .progress .progress-bar").html(percent+','+upSpeed+'/s')
    })
    uploaderObject.bind('FileUploaded',function (uploader,file) {
        var parm={}
        var th=$('#'+id).parent().parent()
        var fname=(file.name).split('.')
        var suffix=''
        if (fname.length>1){
            suffix=fname[fname.length-1]
        }
        $("#fileprogress"+fid+" .progress .progress-bar").html('文件校验中')
        parm['upDate']=uploader.getOption('multipart_params')['upDate']
        parm['fileName']=file.id+'.'+suffix
        parm['method']='checkSum'
        parm['id']=parseInt(fid)
        $.when(createFileMd5(file.getNative()))
            .done(function (fmd5) {
                parm['checkSum']=fmd5
                $.when(req_ajax('/api/fileManager/',parm,'result'))
                    .done(function () {
                        if(result['code']==-1){
                            $("#fileprogress"+fid+" .progress .progress-bar").html('文件校验失败,'+result['msg'])
                            uploaderObject.disableBrowse(false)
                            $("#"+id).removeClass('buttonClickDisable')
                            $("#"+id).html('上传文件')
                        }else{
                            $("#fileprogress"+fid+" .progress .progress-bar").html('上传成功')
                            th.children().eq(1).css('color','black')
                            th.children().eq(1).html(parm['fileName'])
                            $("#"+id).remove()
                        }
                    })
                    .fail(function () {
                        alert("请求失败")
                        $("#fileprogress"+fid+" .progress .progress-bar").html('文件校验失败,请重试')
                        uploaderObject.disableBrowse(false)
                        $("#"+id).removeClass('buttonClickDisable')
                        $("#"+id).html('上传文件')
                    })


            })

    })
}
function addprogress(fname,fid) {
    var pro='<div id="fileprogress'+fid+'">'
    pro+=fname
    pro+='<div class="progress progress-striped active">'
    pro+='<div class="progress-bar progress-bar-success" style="width:0%;color: #0f0f0f;">0%,0B/s</div>'
    pro+='</div></div>'
    $("#fileUpload").append(pro)
}
function showRemark(obj) {
    var txt=$(obj).next().text().replace(/\n/g,'<br/>')
    $('#remarkModal').remove()
    var modalOb=['<div class="modal" id="remarkModal">',
                        '<div class="modal_container">',
                            '<div class="modal-content radius">',
                                '<div class="modal_header">备注</div>',
                                '<div class="page_hr"></div>',
                                '<div class="modal_body modal_body_custom">'+txt,
                                '</div>',
                        '</div>',
                    '</div>'
                    ]
    $(".page_container").after(modalOb.join(''))
    $("#remarkModal").modal("show")
}
$(document).ready(function () {
    //绑定文件上传按钮
    $( ".fileUploadButton" ).each( function() {
        fileupload($(this).attr('id'))
    })
})