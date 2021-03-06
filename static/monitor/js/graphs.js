//构建请求参数
function get_host_key(key_name) {
    var itemids=[]
    var host_item_ids={}
    var units=''
    var value_type=0
    var stop_time=Date.parse(new Date())/1000;
    var start_time=stop_time-7200
    var host_data=eval($("#data_storage").data('host'))
    var zabbix_conf=eval($("#data_storage").data('key'))[0]
    $.each(host_data,function (index,value,array) {
        var itemid={}
        //去除status为0的主机
       if (value['status']=='0'){
            $.each(value['items'],function (index2,value2,array2) {
                if (value2['name']==zabbix_conf[key_name]){
                    units=value2['units']
                    value_type=value2['value_type']
                    itemid['data']=value2['itemid']
                    itemids.push(value2['itemid'])
                    return false
                }
            })
            host_item_ids[value['hostid']]=itemid
       }else {
           return false;
       }
    })
    return {'units':units,"value_type":value_type,"itemids":itemids,"host_item_ids":host_item_ids,"start_time":start_time,"stop_time":stop_time}
}
function cpu_graphar(id,data,units) {
    Highcharts.setOptions({ global: { useUTC: false } });
    $(id).highcharts({
            chart: {
                margin:[0,0,0,0],
                spacing:[0,0,0,0],
            },
            title: {
                text: ''
            },
            xAxis: {
                type:"datetime",
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
                formatter:function () {
                    s= '<span style="color:#7cb5ec">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                    s+='<br\><span style="color:#7cb5ec">cpu使用率:'+this.y+units+'</span>'
                    return s
                },
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
function memory_graphs(id,alivable_data,total_data,units) {
    for(var item in alivable_data){
        alivable_data[item][1]=total_data-alivable_data[item][1]
    }
    Highcharts.setOptions({ global: { useUTC: false } });
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
                max:total_data,
                min:0,
                visible:false,
            },
            legend: {
                enabled: false
            },
            tooltip: {
                   formatter: function () {
                        var s = '<span style="color:#7cb5ec">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:#7cb5ec">已使用:'+unit_format(this.y,units,'float')+'</span>'
                        s+='<br\><span style="color:#7cb5ec">使用百分比:'+parseFloat(this.y*100/total_data).toFixed(2)+'%</span>'
                        s+='<br\><span style="color:#7cb5ec">总计:'+unit_format(total_data,units,'float')+'</span>'
                        return s;
                    },
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
                    },
                }
            },
            exporting:{
                enabled:false
            },
            series: [{
                type: 'area',
                data: alivable_data,
                name:"内存使用率:"
            }],
            credits: {
                enabled: false
            },
        });
}
//请求CPU数据并赋值给图形
function cpu_data_req() {
    //使用链式调用
    $("#graphs_select").attr("disabled","disabled");
    var parm=get_host_key('cpu_util')
    $.when(req_ajax('/api/zabbix_history_get/',parm,'req_data'))
        .done(function () {
             $("#graphs_select").removeAttr("disabled");
             for (var key in req_data){
                cpu_graphar("#hostid_"+key,req_data[key]['data'],parm['units'])
             }
        })
         .fail(function () {
                $("#graphs_select").removeAttr("disabled");
                alert('cpu数据获取失败')
        })
}
//请求内存数据
function memory_data_req() {
    var alivable_parm=get_host_key('alivable_mem')
    var total_parm=get_host_key('total_mem')
    $("#graphs_select").attr("disabled","disabled");
    $.when(req_ajax('/api/zabbix_history_get/',alivable_parm,'req_data1'),req_ajax('/api/zabbix_history_get/',total_parm,'req_data2'))
        .done(function () {
                $("#graphs_select").removeAttr("disabled");
                for (var key in req_data){
                    memory_graphs("#hostid_"+key,req_data1[key]['data'],req_data2[key]['data'][req_data2[key]['data'].length-1][1],alivable_parm['units'])
                }
        })
        .fail(function () {
                $("#graphs_select").removeAttr("disabled");
                alert('内存数据获取失败')
        })

}
function cpu_memory_change(value) {
    if(value=="cpu"){
        cpu_data_req()
    }else if(value=="memory"){
        memory_data_req()
    }
}