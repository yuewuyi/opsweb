var req_data=''
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
}
function cpu_graphar(id,data) {
    Highcharts.setOptions({
        timezoneOffset: -8
    });
    $(id).highcharts({
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
                max:100,
                min:0,
                visible:false,
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}{point.y:,.1f}%</span>',
                shared: true
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
                        ],
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                series:{
                    marker:{
                        enabled:false
                    }
                }
            },
            exporting:{
                enabled:false
            },
            series: [{
                type: 'area',
                data: data,
                name:"cpu使用率:"
            }],
            credits: {
                enabled: false
            },
        });
};
function memory_graphs(id,data) {
     Highcharts.setOptions({
        timezoneOffset: -8
    });
        $(id).highcharts({
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
                max:15.98,
                min:0,
                visible:false,
            },
            legend: {
                enabled: false
            },
              tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}{point.y:,.1f}GB 百分比:</span>',
                shared: true
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
                        ],
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                series:{
                    marker:{
                        enabled:false
                    }
                }
            },
            exporting:{
                enabled:false
            },
            series: [{
                type: 'area',
                data: data,
                name:"内存使用率:"
            }],
            credits: {
                enabled: false
            },
        });
}
function req_ajax(url,data) {
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
            req_data=data
            dtd.resolve()
        })
        .fail(function () {
            alert('数据获取失败')
        })
    return dtd.promise();
}
function cpu_data_req() {
    var itemids=[]
    var hostids=[]
    var host_item_ids={}
    host_data=eval($("#data_storage").data('host'))
    $.each(host_data,function (index,value,array) {
        itemid={}
       if (value['status']=='0'){
            $.each(value['items'],function (index2,value2,array2) {
                if (value2['key_']=='system.cpu.util[,,avg1]'){
                    itemid[value2['key_']]=value2['itemid']
                    itemids.push(value2['itemid'])
                    return false
                }
            })
            hostids.push(value['hostid'])
            host_item_ids[value['hostid']]=itemid
       }else {
           return false;
       }
    })
    $.when(req_ajax('/api/zabbix_cpu_get/',{"itemids":itemids,"hostids":hostids,"host_item_ids":host_item_ids}))
        .done(function () {
          for (var key in req_data){
              cpu_graphar("#hostid_"+key,req_data[key]['system.cpu.util[,,avg1]'])
          }
        })
}
function memory_data_req() {
    var itemids=[]
    var hostids=[]
    var host_item_ids={}
    host_data=eval($("#data_storage").data('host'))
    $.each(host_data,function (index,value,array) {
        itemid={}
       if (value['status']=='0'){
            $.each(value['items'],function (index2,value2,array2) {
                if (value2['key_']=='vm.memory.size[total]'|| value2['key_']=="vm.memory.size[available]"){
                    itemid[value2['key_']]=value2['itemid']
                    itemids.push(value2['itemid'])
                }
            })
            hostids.push(value['hostid'])
            host_item_ids[value['hostid']]=itemid
       }else {
           return false;
       }
    })
    $.when(req_ajax('/api/zabbix_memory_get/',{"itemids":itemids,"hostids":hostids,"host_item_ids":host_item_ids}))
        .done(function () {
          for (var key in req_data){
              memory_graphs("#hostid_"+key,req_data[key]['vm.memory.size[available]'])
          }
            alert("ok")
        })
}