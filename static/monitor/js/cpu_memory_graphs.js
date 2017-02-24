var req_data=''
var table_str=""
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
}
function graphar() {
    Highcharts.setOptions({
        timezoneOffset: -8
    });
        $('#grphas_tomcat_test').highcharts({
            chart: {
                margin:[0,0,0,0],
                spacing:[0,0,0,0],
            },
            title: {
                text: ''
            },
            xAxis: {
                visible:false,

            },
            yAxis: {
                max:1,
                min:0,
                visible:false,
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            exporting:{
                enabled:false
            },
            series: [{
                type: 'area',
                data: [
                    [Date.UTC(2015,10,1,10,01,00),0.11],
                    [Date.UTC(2015,10,1,10,02,00),0.12],
                    [Date.UTC(2015,10,1,10,03,00),0.24],
                    [Date.UTC(2015,10,1,10,04,00),0.09],
                    [Date.UTC(2015,10,1,10,05,00),0.31],
                    [Date.UTC(2015,10,1,10,06,00),0.22],
                    [Date.UTC(2015,10,1,10,07,00),0.34],
                    [Date.UTC(2015,10,1,10,08,00),0.01],
                    [Date.UTC(2015,10,1,10,09,00),0.03],
                    [Date.UTC(2015,10,1,10,10,00),0.04],
                    [Date.UTC(2015,10,1,10,11,00),0.05],
                    [Date.UTC(2015,10,1,10,12,00),0.07],
                    [Date.UTC(2015,10,1,10,13,00),0.05],
                    [Date.UTC(2015,10,1,10,14,00),0.09],
                    [Date.UTC(2015,10,1,10,15,00),0.20],
                    [Date.UTC(2015,10,1,10,16,00),0.01],
                    [Date.UTC(2015,10,1,10,17,00),0.02],
                    [Date.UTC(2015,10,1,10,18,00),0.03],
                    [Date.UTC(2015,10,1,10,19,00),0.04],
                    [Date.UTC(2015,10,1,10,20,00),0.12],
                    [Date.UTC(2015,10,1,10,21,00),0.9],
                    [Date.UTC(2015,10,1,10,22,00),0.45],
                    [Date.UTC(2015,10,1,10,23,00),0.21],
                    [Date.UTC(2015,10,1,10,24,00),0.32],
                    [Date.UTC(2015,10,1,10,25,00),0.35],

                ]
            }],
            credits: {
                enabled: false
            },
        });
};
function req_ajax(url,data) {
    var dtd = $.Deferred()
    $.ajax({
        type:'POST',
        url:url,
        data:data,
        headers:{
            "Content-Type":"application/json",
            "X-CSRFToken":docCookies.getItem('csrftoken')
        },
    })
        .done(function (data) {
            req_data=data
            dtd.resolve()
        })
        .fail(function () {
            alert('数据获取失败')
        })
    return dtd.promise();
}
function zabbix_host_get() {
    data = JSON.stringify({
        "output": ["host", "available","error","status"],
        "selectInterfaces": ["ip"],
        "with_triggers":'true'
        // "search": {}
        // "filter":{"host":["zabbix_server"]},
    })
    $.when(req_ajax('/api/zabbix_host_get/', data))
        .done(function () {
            req_data.forEach(function (item,index,array) {
                table_str+="<tr>"
                if(item['available']=='0'){
                    table_str+="<td><div class='host_status_disable'>"+item['host']+"</div></td>"
                }else {
                    table_str+="<td><div class='host_status_enable'>"+item['host']+"</div></td>"
                }

                table_str+= "<td><div class='host_graphs' id='grphas_"+item['host']+"'></div></td>"+
                    "<td>"+item['interfaces'][0]['ip']+"</td>"+
                    "<td><div class='circles'>23</div></td>"+
                    "<td><div class='circles'>24</td>"+
                    "<td>userdb-thrift,busidb-thrift,appm,</td>"+
                    "<td>"
                if(item['status']=='1'){
                   table_str+= "<div class='monitor_table_operate'>开启监控</div>"
                }
                else {
                    table_str+= "<div class='monitor_table_operate close_monitor'>关闭监控</div>"
                }
                table_str+="<div class='monitor_table_operate monitor_info'>监控详情</div>"+
                    "<div class='monitor_table_operate log_view'>日志查看</div>"+
                    "<div class='monitor_table_operate app_deploy'>应用部署</div>"+
                    "</td>"+
                "</tr>"
            })
            $("#host_table").append(table_str)
        })
}

