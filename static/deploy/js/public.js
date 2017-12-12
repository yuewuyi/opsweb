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
    var nameReg=/^[a-zA-Z0-9_\-]{1,20}$/
    var ipReg=/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
    var numReg=/^[0-9]{1,30}$/
    var auText=$.trim($(textId).val())
    if (type=='hostname'){
        var errorMesg="主机名格式错误，主机名由数字、字母、-、_、组成，长度为1-20"
        var reg=nameReg
    }else if(type=='TemplateName'){
        var errorMesg="模板名格式错误，模板名由数字、字母、-、_、组成，长度为1-20"
        var reg=nameReg
    }else if(type=='ip'){
        var errorMesg="ip格式错误"
        var reg=ipReg
    }else if(type=='appName'){
        var errorMesg="应用名格式错误，模板名由数字、字母、-、_、组成，长度为1-20"
        var reg=nameReg
    }else if(type=='port'){
        var errorMesg="端口格式错误"
        var reg=numReg
    }
    if (reg.test(auText)){
        $(buttonId).removeClass('buttonClickDisable')
        showMesage(errorTxtID,'error','')
    }else{
        $(buttonId).addClass('buttonClickDisable')
        showMesage(errorTxtID,'error',errorMesg)
    }
    return reg.test(auText)
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