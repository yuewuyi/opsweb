/**
 * Created by suyue on 2017/3/21.
 */
//多个tomcat，thrift切换
function change_app(obj,type) {
    var app_name=$(obj).html()
    if(type=='tomcat'){
        $("#tomcat_select_button").html(app_name)
        $("#tomcat_date").data('app_name',app_name)
        tomcat_graphs()
    }
    if(type=='thrift'){
        $("#thrift_select_button").html(app_name)
        $("#thrift_date").data('app_name',app_name)
    }
}

//创建请求参数
function  create_request_parm(id,key_name,app_name) {
    var itemid=[]
    var hostid=getQueryString('hostid')
    var host_item_ids={}
    var item_dit={}
    var units=''
    var value_type=0
    var date_arr=data_split_format(id)
    var tick_interval=parseInt((date_arr['end_time']-date_arr['start_time'])/20)
    var host_info=eval($("#data_storage").data('item'))
    for (var i=0;i<host_info.length;i++){
        item_dit[host_info[i]['name']]=host_info[i]
    }
    units= item_dit[key_name]['units']
    value_type=item_dit[key_name]['value_type']
    itemid.push(item_dit[key_name]['itemid'])
    host_item_ids[hostid]={'data':item_dit[key_name]['itemid']}
    return {start_time:date_arr['start_time'],
        hostid:hostid,
        stop_time:date_arr['end_time'],
        tick_interval:tick_interval,
        itemids:itemid,
        host_item_ids:host_item_ids,
        units:units,
        value_type:value_type}
}
//磁盘使用图
function disk_usage(id,name,total,used,free) {
    $(id).highcharts({
        chart: {
            margin:[20,0,,0],
            spacing:[0,0,0,0],
        },
        colors:[ '#FEA934','#B4FC7E'],
        title: {
            text: '<span style="line-height:30px;"><b>'+name+'</b></span>',
            margin:[0,0,0,0],
            style:{
                fontSize:5,
            },
            useHTML:true,
        },
        tooltip: {
            headerFormat: '',
            pointFormatter:function () {
                var s = '<span>'+this.name+':'+unit_format(this.y,'B','float')+'</span>'
                s+='<br><span>百分比:'+parseFloat(this.percentage).toFixed(2)+'%'
                s+='<br\><span">总计:'+unit_format(this.y,'B','float')+'</span>'
                return s;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
            },
        },
        exporting:{
                enabled:false
        },
        series: [{
            type: 'pie',
            name: '磁盘使用情况',
            data: [
                ['已用',used],
                ['可用',free]
            ]
        }],
        credits: {
                enabled: false
            },
    });
}
//磁盘读写速率图
function disk_io_speed() {
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var write_parm=create_request_parm('#disk_io_date',zabbix_conf['disk_io_write'])
    var read_parm=create_request_parm('#disk_io_date',zabbix_conf['disk_io_read'])
    $.when(req_ajax('/api/zabbix_history_get/',write_parm,'disk_write_data'),req_ajax('/api/zabbix_history_get/',read_parm,'disk_read_data'))
        .done(function () {
            Highcharts.setOptions({ global: { useUTC: false } });
            $('#disk_io_speed_graphs').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x',
                resetZoomButton: {
                        theme: {
                            display: 'none'
                            }
                     }
            },
            colors:[ '#FEA934','#48a301'],
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: ''
                },
                tickInterval:1000*read_parm['tick_interval'],
                gridLineWidth :1,
                labels:{
                    formatter:function(){
                        if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }
                    },
                    rotation:270,
                    style:{
                        fontSize:'12px',
                        color:'green'
                    }
                },
            },
            yAxis: {
                title: {
                    text: ''
                },
                tickAmount:7,
                labels:{
                    formatter:function(){
                        return unit_format(this.value,write_parm['units'],'int')
                    }
                }
            },
            tooltip: {
                formatter:function(){
                    var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">'+this.series.name+':'+unit_format(this.y,write_parm['units'],'float')+'</span>'
                        return s;
                }
            },
            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: false
                    },
                },
                series: {
                    lineWidth:1,
                    marker: {
                        enabled: false
                    },
                }
            },
            exporting:{
                    enabled:false
            },
            credits: {
                    enabled: false
                },
            series: [ {
                name: '磁盘写入速度',
                data: disk_write_data[read_parm['hostid']]['data']
            },{
                name:'磁盘读取速率',
                data:disk_read_data[read_parm['hostid']]['data']
            }]
            });
        })
}
//主机详情CPU图
function host_detailed_cpu() {
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var hostid=getQueryString('hostid')
    var parm=create_request_parm('#host_cpu_date',zabbix_conf['cpu_util'])
    $.when(req_ajax('/api/zabbix_history_get/',parm,'req_cup_data'))
        .done(function () {
             Highcharts.setOptions({global: { useUTC: false }});
            $('#host_detailed_cpu').highcharts({
                chart: {
                    zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            display: 'none'
                            }
                    }
                },
                title: {
                    text: '',
                },
                xAxis: {
                    type: 'datetime',
                    gridLineWidth :1,
                    tickInterval:1000*parm['tick_interval'],
                    labels:{
                        formatter:function(){
                            if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }
                        },
                        rotation:270,
                        style:{
                            fontSize:'12px',
                            color:'green'
                        }
                    },
                },
                yAxis: {
                    max:100,
                    min:0,
                    title: {
                        text: ''
                    },
                    tickAmount:7,
                },
                tooltip: {
                    headerFormat: '<span style="color:{series.color}">{point.x:%Y-%m-%d %H:%M:%S}</span><br>',
                    pointFormat: '<span style="color:{series.color}">{series.name}:{point.y:.2f}'+parm['units']+'</span>'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        color:'#48a301',
                        fillColor: {
                            linearGradient: {
                                x1: 1,
                                y1: 0,
                                x2: 1,
                                y2: 1
                            },
                            stops: [
                                [0,'#48a301'],
                                [1, Highcharts.Color('#48a301').setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            enabled:false
                        },
                        lineWidth: 1,
                        threshold: null
                    }
                },
                exporting:{
                    enabled:false
                    },
                series: [{
                    type: 'area',
                    name: 'cpu使用率',
                    data: req_cup_data[parm['hostid']]['data']
                }],
                credits:{
                    enabled:false
                }
            });
        })
}
function host_detailed_memory() {
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var alivable_parm=create_request_parm('#host_mem_date',zabbix_conf['alivable_mem'])
    var total_parm=create_request_parm('#host_mem_date',zabbix_conf['total_mem'])
    $.when(req_ajax('/api/zabbix_history_get/',alivable_parm,'alivable_mem_data'),req_ajax('/api/zabbix_history_get/',total_parm,'total_mem_data'))
        .done(function () {
            var total_data=total_mem_data[alivable_parm['hostid']]['data'][total_mem_data[alivable_parm['hostid']]['data'].length-1][1]
            var alivable_data=alivable_mem_data[alivable_parm['hostid']]['data']
            for(var item in alivable_data){
                alivable_data[item][1]=total_data-alivable_data[item][1]
            }
            Highcharts.setOptions({ global: { useUTC: false } });
            $('#host_detailed_memory').highcharts({
                chart: {
                    zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            display: 'none'
                            }
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval:1000*alivable_parm['tick_interval'],
                    gridLineWidth :1,
                    labels:{
                         formatter:function(){
                            if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }

                        },
                        rotation:270,
                        style:{
                            fontSize:'12px',
                            color:'green'
                        }
                    },
                },
                yAxis: {
                    max:total_data,
                    min:0,
                    title: {
                        text: ''
                    },
                    labels:{
                        formatter:function(){
                            return unit_format(this.value,alivable_parm['units'],'int')
                        }
                     },
                    tickAmount:7,
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                   formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">已使用:'+unit_format(this.y,alivable_parm['units'],'float')+'</span>'
                        s+='<br\><span style="color:'+this.color+'">使用百分比:'+parseFloat(this.y*100/total_data).toFixed(2)+'%</span>'
                        s+='<br\><span style="color:'+this.color+'">总计:'+unit_format(total_data,alivable_parm['units'],'float')+'</span>'
                        return s;
                   },
                },
                plotOptions: {
                    area: {
                        color:'#FEA934',
                        fillColor: {
                            linearGradient: {
                                x1: 1,
                                y1: 0,
                                x2: 1,
                                y2: 1
                            },
                            stops: [
                                [0,'#FEA934'],
                                [1, Highcharts.Color('#FEA934').setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            enabled:false
                        },
                        lineWidth: 1,
                        threshold: null
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
                credits:{
                    enabled:false
                }
                });
            })
}
function nic_out() {
    var nic_arr=eval($("#data_storage").data('app'))[0]['nic']
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var id='#host_nic_out_date'
    if(nic_arr.length==1){
        var eth0_parm=create_request_parm(id,zabbix_conf['nic_out']+nic_arr[0])
        $.when(req_ajax('/api/zabbix_history_get/',eth0_parm,'eth0_data'))
            .done(function () {
                nic_out_graph(eth0_data[eth0_parm['hostid']]['data'],'',eth0_parm)
            })
    }else if (nic_arr.length==2){
        var eth0_parm=create_request_parm(id,zabbix_conf['nic_out']+nic_arr[0])
        var eth1_parm=create_request_parm(id,zabbix_conf['nic_out']+nic_arr[1])
        $.when(req_ajax('/api/zabbix_history_get/',eth0_parm,'eth0_data'),req_ajax('/api/zabbix_history_get/',eth1_parm,'eth1_data'))
         .done(function () {
                nic_out_graph(eth0_data[eth0_parm['hostid']]['data'],eth1_data[eth0_parm['hostid']]['data'],eth0_parm)
            })
    }
}
function nic_out_graph(eth0_data,eth1_data,parm) {
     Highcharts.setOptions({ global: { useUTC: false } });
    $('#nic_out').highcharts({
        chart: {
            type: 'spline',
            zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            display: 'none'
                        }
            }
        },
        colors:[ '#FEA934','#48a301'],
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: ''
            },
            tickInterval:1000*parm['tick_interval'],
            gridLineWidth :1,
            labels:{
                formatter:function(){
                            if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }
                },
                rotation:270,
                style:{
                    fontSize:'12px',
                    color:'green'
                }
            },
        },
        yAxis: {
            title: {
                text: ''
            },
            tickAmount:7,
            labels:{
                        formatter:function(){
                            return unit_format(this.value,parm['units'],'float')
                        }
                     },
        },
        tooltip: {
            formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">'+this.series.name+'出口流量:'+unit_format(this.y,parm['units'],'float')+'</span>'
                        return s;
                   },
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: false
                },
            },
            series: {
                  lineWidth:1,
                  marker: {
                      enabled: false
                  },
            }
        },
        exporting:{
                enabled:false
        },
        credits: {
                enabled: false
            },
        series: [ {
            name: '内网',
            data: eth0_data
        },{
            name:'外网',
            data:eth1_data
        }]
    });
}
function nic_in() {
    var nic_arr=eval($("#data_storage").data('app'))[0]['nic']
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var id='#host_nic_in_date'
    if(nic_arr.length==1){
        var eth0_parm=create_request_parm(id,zabbix_conf['nic_in']+nic_arr[0])
        $.when(req_ajax('/api/zabbix_history_get/',eth0_parm,'eth0_data'))
            .done(function () {
                nic_in_graph(eth0_data[eth0_parm['hostid']]['data'],'',eth0_parm)
            })
    }else if (nic_arr.length==2){
        var eth0_parm=create_request_parm(id,zabbix_conf['nic_in']+nic_arr[0])
        var eth1_parm=create_request_parm(id,zabbix_conf['nic_in']+nic_arr[1])
        $.when(req_ajax('/api/zabbix_history_get/',eth0_parm,'eth0_data'),req_ajax('/api/zabbix_history_get/',eth1_parm,'eth1_data'))
         .done(function () {
                nic_in_graph(eth0_data[eth0_parm['hostid']]['data'],eth1_data[eth0_parm['hostid']]['data'],eth0_parm)
            })
    }
}
function nic_in_graph(eth0_data,eth1_data,parm) {
     Highcharts.setOptions({ global: { useUTC: false } });
    $('#nic_in').highcharts({
        chart: {
            type: 'spline',
            zoomType: 'x',
            resetZoomButton: {
                        theme: {
                            display: 'none'
                        }
            }
        },
        colors:[ '#FEA934','#48a301'],
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: ''
            },
            tickInterval:1000*parm['tick_interval'],
            gridLineWidth :1,
            labels:{
                 formatter:function(){
                            if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }
                },
                rotation:270,
                style:{
                    fontSize:'12px',
                    color:'green'
                }
            },
        },
        yAxis: {
            title: {
                text: ''
            },
            tickAmount:7,
            labels:{
                        formatter:function(){
                            return unit_format(this.value,parm['units'],'float')
                        }
                     },
        },
        tooltip: {
            formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">'+this.series.name+'入口流量:'+unit_format(this.y,parm['units'],'float')+'</span>'
                        return s;
                   },
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: false
                },
            },
            series: {
                  lineWidth:1,
                  marker: {
                      enabled: false
                  },
            }
        },
        exporting:{
                enabled:false
        },
        credits: {
                enabled: false
            },
        series: [ {
            name: '内网',
            data: eth0_data
        },{
            name:'外网',
            data:eth1_data
        }]
    });
}
function tomcat_heap_memory(used_data,max_data,parm) {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#tomcat_heap_mem').highcharts({
            chart: {
                borderColor:'#222d32',
                zoomType: 'x',
                resetZoomButton: {
                        theme: {
                            display: 'none'
                        }
                },
            },
            title: {
                text: '<p style="font-size: 12px;">tomcat堆内存</p>'
            },
            xAxis: {
                type: 'datetime',
                tickInterval:1000*parm['tick_interval'],
                gridLineWidth :1,
                labels:{
                         formatter:function(){
                             if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }

                         },
                    rotation:270,
                    style:{
                        fontSize:'12px',
                        color:'green'
                    }
                },
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels:{
                    formatter:function(){
                        return unit_format(this.value,parm['units'],'int')
                    }
                },
                tickAmount:7,
            },
            legend: {
                enabled: false
            },
            tooltip: {
                   formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">已使用:'+unit_format(this.y,parm['units'],'float')+'</span>'
                        s+='<br\><span style="color:'+this.color+'">使用百分比:'+parseFloat(this.y*100/max_data).toFixed(2)+'%</span>'
                        s+='<br\><span style="color:'+this.color+'">总计:'+unit_format(max_data,parm['units'],'float')+'</span>'
                        return s;
                   },
            },
            plotOptions: {
                area: {
                    color:'#FEA934',
                    fillColor: {
                        linearGradient: {
                            x1: 1,
                            y1: 0,
                            x2: 1,
                            y2: 1
                        },
                        stops: [
                            [0,'#FEA934'],
                            [1, Highcharts.Color('#FEA934').setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        enabled:false
                    },
                    lineWidth: 1,
                    threshold: null
                }
            },
            exporting:{
                enabled:false
                },
            series: [{
                type: 'area',
                name: '堆内存已使用:',
                data: used_data
            }],
            credits:{
                enabled:false
            }
        });
}
function tomcat_request(request,err_request,parm) {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#tomcat_request').highcharts({
        chart: {
            type: 'spline',
            borderColor:'#222d32',
            zoomType: 'x',
            resetZoomButton: {
                theme: {
                    display: 'none'
                }
            },
        },
        colors:[ '#FEA934','#48a301'],
        title: {
            text: '<p style="font-size: 12px;">tomcat请求数</p>'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickInterval:1000*parm['tick_interval'],
            gridLineWidth :1,
            labels:{
                formatter:function(){
                             if (Highcharts.dateFormat('%H:%M', this.value)=='00:00'){
                                return Highcharts.dateFormat('%m/%d', this.value)
                            }else {
                                return Highcharts.dateFormat('%H:%M', this.value)
                            }

                         },
                rotation:270,
                style:{
                    fontSize:'12px',
                    color:'green'
                }
            },
        },
        yAxis: {
            title: {
                text: ''
            },
            labels:{
                formatter:function(){
                    return unit_format(this.value,parm['units'],'int')
                }
            },
            tickAmount:7,
        },
        tooltip: {
            formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">'+this.series.name+':'+unit_format(this.y,parm['units'],'int')+'</span>'
                        return s;
                   },
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: false
                },
            },
            series: {
                  lineWidth:1,
                  marker: {
                      enabled: false
                  },
            }
        },
        exporting:{
                enabled:false
        },
        credits: {
                enabled: false
            },
        series: [ {
            name: 'tomcat请求数',
            data: request
        },{
            name:'tomcat错误请求数',
            data:err_request
        }]
    });
}
function tomcat_connect(est_data,wait_data,parm) {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#tomcat_connect').highcharts({
        chart: {
            type: 'spline',
            borderColor:'#222d32',
            zoomType: 'x',
            resetZoomButton: {
                theme: {
                    display: 'none'
                }
            },
        },
        colors:[ '#FEA934','#48a301'],
        title: {
            text: '<p style="font-size: 12px;">tomcat连接数</p>'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickInterval:1000*parm['tick_interval'],
            gridLineWidth :1,
            labels:{
                formatter:function(){
                    return Highcharts.dateFormat('%H:%M', this.value)
                },
                rotation:270,
                style:{
                    fontSize:'12px',
                    color:'green'
                }
            },
        },
        yAxis: {
            title: {
                text: ''
            },
            labels:{
                formatter:function(){
                    return unit_format(this.value,parm['units'],'int')
                }
            },
            tickAmount:7,
        },
        tooltip: {
            formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">'+this.series.name+':'+unit_format(this.y,parm['units'],'int')+'</span>'
                        return s;
                   },
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: false
                },
            },
            series: {
                  lineWidth:1,
                  marker: {
                      enabled: false
                  },
            }
        },
        exporting:{
                enabled:false
        },
        credits: {
                enabled: false
            },
        series: [ {
            name: 'WAIT状态的连接数',
            data: wait_data
        },{
            name:'EST状态的连接数',
            data:est_data
        }]
    });
}
//获取数据加载tomcat图表
function tomcat_graphs() {
    var id='#tomcat_date'
    var app_name=$(id).data('app_name')
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var heap_mem_max_parm=create_request_parm(id,app_name+zabbix_conf['tomcat_heap_mem_max'])
    var heap_mem_used_parm=create_request_parm(id,app_name+zabbix_conf['tomcat_heap_mem_used'])
    var con_est_parm=create_request_parm(id,app_name+zabbix_conf['tomcat_con_est'])
    var con_wait_parm=create_request_parm(id,app_name+zabbix_conf['tomcat_con_wait'])
    var request_count=create_request_parm(id,app_name+zabbix_conf['tomcat_request'])
    var err_request_count=create_request_parm(id,app_name+zabbix_conf['tomcat_err_request'])
    $.when(req_ajax('/api/zabbix_history_get/',heap_mem_max_parm,'heap_mem_max_data'),req_ajax('/api/zabbix_history_get/',heap_mem_used_parm,'heap_mem_used_data'))
         .done(function () {
                tomcat_heap_memory(heap_mem_used_data[heap_mem_used_parm['hostid']]['data'],heap_mem_max_data[heap_mem_used_parm['hostid']]['data'][heap_mem_max_data[heap_mem_used_parm['hostid']]['data'].length-1][1],heap_mem_used_parm)
            })
    $.when(req_ajax('/api/zabbix_history_get/',con_est_parm,'con_est_data'),req_ajax('/api/zabbix_history_get/',con_wait_parm,'con_wait_data'))
         .done(function () {
                tomcat_connect(con_est_data[heap_mem_used_parm['hostid']]['data'],con_wait_data[heap_mem_used_parm['hostid']]['data'],con_est_parm)
            })
    $.when(req_ajax('/api/zabbix_history_get/',request_count,'request_data'),req_ajax('/api/zabbix_history_get/',err_request_count,'err_request_data'))
         .done(function () {
                tomcat_request(request_data[heap_mem_used_parm['hostid']]['data'],err_request_data[heap_mem_used_parm['hostid']]['data'],con_est_parm)
            })
}
function thrift_connect() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#thrift_connect').highcharts({
        chart: {
            type: 'spline',
            borderColor:'#222d32',
        },
        colors:[ '#FEA934','#48a301'],
        title: {
            text: '<p style="font-size: 12px;">thrift当前连接数</p>'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: ''
            },
            tickInterval:1000*60*5,
            gridLineWidth :1,
            labels:{
                formatter:function(){
                    return Highcharts.dateFormat('%H:%M', this.value)
                },
                rotation:270,
                style:{
                    fontSize:'12px',
                    color:'green'
                }
            },
        },
        yAxis: {
            title: {
                text: ''
            },
            tickAmount:5,
        },
        tooltip: {
            headerFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br>',
            pointFormat: '{series.name}:{point.y}'
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: false
                },
            },
            series: {
                  lineWidth:1,
                  marker: {
                      enabled: false
                  },
            }
        },
        exporting:{
                enabled:false
        },
        credits: {
                enabled: false
            },
        series: [ {
            name: '内网',
            data: ''
        },{
            name:'外网',
            data:''
        }]
    });
}
// function thrift_memory() {
//     Highcharts.setOptions({ global: { useUTC: false } });
//     $('#thrift_mem').highcharts({
//             chart: {
//                 zoomType: 'x',
//                 borderColor:'#222d32',
//             },
//             title: {
//                 text: '<p style="font-size: 12px;">thrift占用内存</p>'
//             },
//             xAxis: {
//                 type: 'datetime',
//                 tickInterval:1000*60*5,
//                 gridLineWidth :1,
//                 labels:{
//                     formatter:function(){
//                         return Highcharts.dateFormat('%H:%M', this.value)
//                     },
//                     rotation:270,
//                     style:{
//                         fontSize:'12px',
//                         color:'green'
//                     }
//                 },
//             },
//             yAxis: {
//                 title: {
//                     text: ''
//                 },
//                 tickAmount:5,
//             },
//             legend: {
//                 enabled: false
//             },
//             plotOptions: {
//                 area: {
//                     color:'#FEA934',
//                     fillColor: {
//                         linearGradient: {
//                             x1: 1,
//                             y1: 0,
//                             x2: 1,
//                             y2: 1
//                         },
//                         stops: [
//                             [0,'#FEA934'],
//                             [1, Highcharts.Color('#FEA934').setOpacity(0).get('rgba')]
//                         ]
//                     },
//                     marker: {
//                         enabled:false
//                     },
//                     lineWidth: 1,
//                     threshold: null
//                 }
//             },
//             exporting:{
//                 enabled:false
//                 },
//             series: [{
//                 type: 'area',
//                 name: 'cpu使用率',
//                 data: ''
//             }],
//             credits:{
//                 enabled:false
//             }
//         });
// }
// function thrift_cpu() {
//     Highcharts.setOptions({ global: { useUTC: false } });
//     $('#thrift_cpu').highcharts({
//             chart: {
//                 zoomType: 'x',
//                 borderColor:'#222d32',
//             },
//             title: {
//                 text: '<p style="font-size: 12px;">thrift cpu</p>'
//             },
//             xAxis: {
//                 type: 'datetime',
//                 tickInterval:1000*60*5,
//                 gridLineWidth :1,
//                 labels:{
//                     formatter:function(){
//                         return Highcharts.dateFormat('%H:%M', this.value)
//                     },
//                     rotation:270,
//                     style:{
//                         fontSize:'12px',
//                         color:'green'
//                     }
//                 },
//             },
//             yAxis: {
//                 title: {
//                     text: ''
//                 },
//                 tickAmount:5,
//             },
//             legend: {
//                 enabled: false
//             },
//             plotOptions: {
//                 area: {
//                     color:'#FEA934',
//                     fillColor: {
//                         linearGradient: {
//                             x1: 1,
//                             y1: 0,
//                             x2: 1,
//                             y2: 1
//                         },
//                         stops: [
//                             [0,'#FEA934'],
//                             [1, Highcharts.Color('#FEA934').setOpacity(0).get('rgba')]
//                         ]
//                     },
//                     marker: {
//                         enabled:false
//                     },
//                     lineWidth: 1,
//                     threshold: null
//                 }
//             },
//             exporting:{
//                 enabled:false
//                 },
//             series: [{
//                 type: 'area',
//                 name: 'cpu使用率',
//                 data: ''
//             }],
//             credits:{
//                 enabled:false
//             }
//         });
// }
$(document).ready(function () {
    var app=eval($("#data_storage").data('app'))
    var item=eval($("#data_storage").data('item'))
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    var disk_num=app[0]['disk'].length
    var disk_name=''
    var disk_used=''
    var disk_total=''
    if (disk_num<4) {
        var mgleft = ['32.5%', '25%', '11.5%']
        document.getElementById('disk_g1').style.marginLeft = mgleft[disk_num - 1]
    }
    for (i=1;i<=disk_num;i++){
        for (j=0;j<item.length;j++){
            disk_name=app[0]['disk'][i-1]
            if(item[j]['name']==zabbix_conf['disk_total_space']+disk_name){
                disk_total=parseInt(item[j]['lastvalue'])
            }
            else if(item[j]['name']==zabbix_conf['disk_used_space']+disk_name){
                disk_used=parseInt(item[j]['lastvalue'])
            }
        }
        document.getElementById('disk_g'+i).style.display = "inline"
        disk_usage('#disk_g'+i,disk_name,disk_total,disk_used,disk_total-disk_used)
    }
    if (app[0]['tomcat'].length!=0){
            date_select('#tomcat_date')
            tomcat_graphs()
    }
    //  if (app[0]['thrift'].length!=0){
    //         date_select('#thrift_date')
    //         thrift_connect()
    //         thrift_memory()
    //         thrift_cpu()
    // }
    date_select('#disk_io_date')
    date_select('#host_cpu_date')
    date_select('#host_mem_date')
    date_select('#host_nic_in_date')
    date_select('#host_nic_out_date')
    disk_io_speed()
    host_detailed_cpu()
    host_detailed_memory()
    nic_in()
    nic_out()
})
