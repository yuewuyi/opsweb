/**
 * Created by suyue on 2017/6/1.
 */
//日期插件
function date_select(id) {
        $(id+' span').html(moment().subtract(1,'hours').format('YYYY-MM-DD HH:mm:ss') + ' -- ' + moment().format('YYYY-MM-DD HH:mm:ss'));
                    $(id).daterangepicker(
                            {
                                maxDate : moment(), //最大时间
                                showDropdowns : true,
                                timePicker : true, //是否显示小时和分钟
                                timePickerIncrement : 1, //时间的增量，单位为分钟
                                timePicker24Hour : true, //使用24小时制来显示时间
                                dateLimit:{
                                  day:2048
                                },
                                ranges : {
                                    '最近1小时': [moment().subtract(1,'hours'), moment()],
                                    '最近2小时': [moment().subtract(2,'hours'), moment()],
                                    '最近3小时': [moment().subtract(3,'hours'), moment()],
                                    '今日': [moment().startOf('day'), moment()],
                                    '昨日': [moment().subtract(1,'days').startOf('day'), moment().subtract(1,'days').endOf('day')],
                                    '最近7日': [moment().subtract(7,'days'), moment()],
                                    '最近30日': [moment().subtract(30,'days'), moment()]
                                },
                                opens : 'left', //日期选择框的弹出位置
                                locale : {
                                    format: "YYYY-MM-DD HH:mm:ss",
                                    applyLabel : '确定',
                                    cancelLabel : '取消',
                                    fromLabel : '起始时间',
                                    toLabel : '结束时间',
                                    customRangeLabel : '自定义',
                                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                                    firstDay : 1
                                }
                            }, function(start, end) {//格式化日期显示框
                                $(id+' span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' -- ' + end.format('YYYY-MM-DD HH:mm:ss'));
                                if(id=="#host_cpu_date"){
                                    host_detailed_cpu()
                                }else if(id=="#disk_io_date"){
                                    disk_io_speed()
                                }else if(id=="#host_mem_date"){
                                    host_detailed_memory()
                                }else if(id=="#host_nic_out_date"){
                                     nic_out()
                                }else if(id=="#host_nic_in_date"){
                                     nic_in()
                                }else if(id=="#tomcat_date"){
                                     tomcat_graphs()
                                }else if(id=="#graphs_date"){
                                     custom_graphs()
                                }
                           });
}
function log_date_select(id) {
        $(id+' span').html(moment().subtract(1,'hours').format('YYYY-MM-DD HH:mm:ss') + ' -- ' + moment().format('YYYY-MM-DD HH:mm:ss'));
                    $(id).daterangepicker(
                            {
                                maxDate : moment(), //最大时间
                                showDropdowns : true,
                                timePicker : true, //是否显示小时和分钟
                                timePickerIncrement : 1, //时间的增量，单位为分钟
                                timePicker24Hour : true, //使用24小时制来显示时间
                                dateLimit:{
                                  day:7
                                },
                                ranges : {
                                    '最近1小时': [moment().subtract(1,'hours'), moment()],
                                    '最近2小时': [moment().subtract(2,'hours'), moment()],
                                    '最近3小时': [moment().subtract(3,'hours'), moment()],
                                    '今日': [moment().startOf('day'), moment()],
                                    '昨日': [moment().subtract(1,'days').startOf('day'), moment().subtract(1,'days').endOf('day')],
                                    '最近7日': [moment().subtract(7,'days'), moment()]
                                },
                                opens : 'left', //日期选择框的弹出位置
                                locale : {
                                    format: "YYYY-MM-DD HH:mm:ss",
                                    applyLabel : '确定',
                                    cancelLabel : '取消',
                                    fromLabel : '起始时间',
                                    toLabel : '结束时间',
                                    customRangeLabel : '自定义',
                                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                                    firstDay : 1
                                }
                            }, function(start, end) {//格式化日期显示框
                                $(id+' span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' -- ' + end.format('YYYY-MM-DD HH:mm:ss'));
                           });
}
//获取cookie
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
}
//单位转换
function unit_format(data,units,type) {
    var unit = units
    var divisor = 1
    if (units=='B'){
         if (data >= 1024 * 1024 * 1024 * 1024) {
            divisor = 1024 * 1024 * 1024 * 1024
            unit = 'TB'
         } else if (data >= 1024 * 1024 * 1024) {
            divisor = 1024 * 1024 * 1024
            unit = 'GB'
         } else if (data >= 1024 * 1024) {
            divisor = 1024 * 1024
            unit = 'MB'
         } else if(data >= 1024){
            divisor = 1024
            unit = 'KB'
         }

    }else {
        if (data >= 10000 * 10000) {
            divisor = 10000 * 10000
            unit = '亿'
        } else if (data >= 10000 * 1000) {
            divisor = 10000 * 1000
            unit = '千万'
        } else if (data >= 10000 * 100) {
            divisor = 10000 * 1000
            unit = '百万'
        } else if (data >= 10000) {
            divisor = 10000
            unit = '万'
        }
    }
    if (type=='float'){
        return parseFloat(data/divisor).toFixed(1)+unit
    }else if(type=='int'){
        return parseInt(data/divisor)+unit
    }

}
//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//时间截取转换
function data_split_format(id) {
    var date_arr={
        'start_time':0,
        'end_time':0
    }
    var date=$(id).find('span').html()
    date=date.split(" -- ")
    date_arr['start_time']=Date.parse(date[0])/1000
    date_arr['end_time']=Date.parse(date[1])/1000
    return date_arr
}
//自定义ajax请求
function req_ajax(url,data,var_name) {
    var dtd = $.Deferred()
    $.ajax({
        type:'POST',
        url:url,
        data:JSON.stringify(data),
        headers:{
            "Content-Type":"application/json",
            "X-CSRFToken":docCookies.getItem('csrftoken')
        },
    })
        .done(function (data) {
            window[var_name]=data
            dtd.resolve()
        })
        .fail(function () {
            dtd.reject()
        })
    return dtd.promise();
}
Date.prototype.format = function(format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};
Date.replaceChars = {
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
'0' : '')) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() {
        var DST = null;
            for (var i = 0; i < 12; ++i) {
                    var d = new Date(this.getFullYear(), i, 1);
                    var offset = d.getTimezoneOffset();

                    if (DST === null) DST = offset;
                    else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
            }
            return (this.getTimezoneOffset() == DST) | 0;
        },
    O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};
function strReplace(str) {
    var strList1=['*','.','-']
    var strList2=['\\*','\\.','\\-']
    for (var i=0;i<strList1.length;i++){
        str=str.replace(strList1[i],strList2[i])
    }
    return str
}
function listenText(textId,data) {
    $(textId).keyup(function () {
        var indexList=data.sort()
        var indexName=$(textId).val()
        var regList=[]
        if (indexName==''){
            regList=indexList.slice(0,9)
        }else {
            indexName=strReplace(indexName)
            var reg=new RegExp("^"+indexName)
            for (i=0;i<indexList.length;i++){
                if (reg.test(indexList[i])){
                    regList.push(indexList[i])
                }
                if (regList.length>=10){
                    break
                }
            }
        }
        if ($("#indexSelect").length > 0){
            $('#indexSelect').remove()
        }
        if(regList.length>0){
            createDiv(regList,textId)
        }
    })
    $(textId).blur(function () {
        if ($("#indexSelect").length > 0){
            setTimeout("$('#indexSelect').remove()",150)
        }
    })
}
function getVale(obj,textId) {
    $(textId).val(obj.innerHTML)
}

function createDiv(regList,textId) {
    var inner='<ul class="select_box">'
    for (i=0;i<regList.length;i++){
        inner+="<li onclick='getVale(this,\""+textId+"\")'>"+regList[i]+"</li>"
    }
    inner+="</ul>"
    var offset=$(textId).offset()
    var width=$(textId).width()+2
    var Div = document.createElement('div')
    Div.style.left = offset['left'] + 'px'
    Div.style.top = offset['top']+20 + 'px'
    Div.style.border = '1px solid #e0e5e8'
    Div.style.background = '#ffffff'
    Div.style.width=width+'px'
    Div.style.position = 'absolute'
    Div.style.zIndex=1000
    Div.id = "indexSelect"
    Div.innerHTML=inner
    document.body.appendChild(Div)
}