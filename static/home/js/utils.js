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
                                format : 'YYYY-MM-DD HH:mm:ss', //控件中from和to 显示的日期格式
                                separator : ' to ',
                                locale : {
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
            alert('数据获取失败')
        })
    return dtd.promise();
}