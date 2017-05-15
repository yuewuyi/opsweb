/**
 * Created by suyue on 2017/3/21.
 */
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
//创建请求参数
function  create_request_parm(id,key_name) {
    var itemid=[]
    var hostid=getQueryString('hostid')
    var host_item_ids={}
    var item_dit={}
    var units=''
    var value_type=0
    var date_arr=data_split_format(id)
    var tick_interval=parseInt((date_arr['end_time']-date_arr['start_time'])/70)
    var host_info=eval($("#data_storage").data('item'))
    var zabbix_conf=eval($("#data_storage").data('conf'))[0]
    for (var i=0;i<host_info.length;i++){
        item_dit[host_info[i]['name']]=host_info[i]
    }
    units= item_dit[zabbix_conf[key_name]]['units']
    value_type=item_dit[zabbix_conf[key_name]]['value_type']
    itemid.push(item_dit[zabbix_conf[key_name]]['itemid'])
    host_item_ids[hostid]={'data':item_dit[zabbix_conf[key_name]]['itemid']}
    return {start_time:date_arr['start_time'],
        hostid:hostid,
        stop_time:date_arr['end_time'],
        tick_interval:tick_interval,
        itemids:itemid,
        host_item_ids:host_item_ids,
        date:date_arr,
        units:units,
        value_type:value_type}
}
data1=[
      [
        1490678961000,
        30.57
      ],
      [
        1490679136000,
        30.31
      ],
      [
        1490679314000,
        31.68
      ],
      [
        1490679490000,
        33.39
      ],
      [
        1490679666000,
        28.72
      ],
      [
        1490679844000,
        80.34
      ],
      [
        1490680019000,
        30.3
      ],
      [
        1490680195000,
        29.98
      ],
      [
        1490680367000,
        29.84
      ],
      [
        1490680546000,
        31.11
      ],
      [
        1490680723000,
        28.66
      ],
      [
        1490680898000,
        31.67
      ],
      [
        1490681076000,
        46.51
      ],
      [
        1490681252000,
        60.71
      ],
      [
        1490681430000,
        39.82
      ],
      [
        1490681608000,
        42.03
      ],
      [
        1490681786000,
        33.39
      ],
      [
        1490681963000,
        38.66
      ],
      [
        1490682138000,
        34.55
      ],
      [
        1490682315000,
        39.89
      ],
      [
        1490682489000,
        32.51
      ],
      [
        1490682666000,
        31.1
      ],
      [
        1490682845000,
        32.75
      ],
      [
        1490683021000,
        34.7
      ],
      [
        1490683197000,
        31.5
      ],
      [
        1490683371000,
        32.33
      ],
      [
        1490683552000,
        30.65
      ],
      [
        1490683727000,
        30.88
      ],
      [
        1490683902000,
        31.62
      ],
      [
        1490684079000,
        31.29
      ],
      [
        1490684254000,
        30.87
      ],
      [
        1490684432000,
        32.21
      ],
      [
        1490684610000,
        28.39
      ],
      [
        1490684787000,
        29.25
      ],
      [
        1490684963000,
        31.89
      ],
      [
        1490685139000,
        29.89
      ],
      [
        1490685317000,
        30.77
      ],
      [
        1490685494000,
        32.54
      ],
      [
        1490685671000,
        31.11
      ],
      [
        1490685849000,
        30.88
      ]
    ]
data2=[
      [
        1490678978000,
        4.07
      ],
      [
        1490679152000,
        3.68
      ],
      [
        1490679330000,
        4.01
      ],
      [
        1490679508000,
        3.85
      ],
      [
        1490679682000,
        3.94
      ],
      [
        1490679860000,
        3.95
      ],
      [
        1490680035000,
        3.85
      ],
      [
        1490680211000,
        4.09
      ],
      [
        1490680389000,
        3.75
      ],
      [
        1490680564000,
        4.09
      ],
      [
        1490680741000,
        3.68
      ],
      [
        1490680916000,
        3.81
      ],
      [
        1490681095000,
        3.83
      ],
      [
        1490681270000,
        4.12
      ],
      [
        1490681448000,
        3.69
      ],
      [
        1490681626000,
        3.69
      ],
      [
        1490681801000,
        3.75
      ],
      [
        1490681979000,
        3.69
      ],
      [
        1490682153000,
        3.91
      ],
      [
        1490682333000,
        3.9
      ],
      [
        1490682509000,
        12.86
      ],
      [
        1490682684000,
        4.05
      ],
      [
        1490682862000,
        3.97
      ],
      [
        1490683038000,
        4.02
      ],
      [
        1490683215000,
        3.88
      ],
      [
        1490683391000,
        3.65
      ],
      [
        1490683570000,
        90.88
      ],
      [
        1490683746000,
        3.94
      ],
      [
        1490683921000,
        3.71
      ],
      [
        1490684096000,
        50.9
      ],
      [
        1490684271000,
        4.0
      ],
      [
        1490684449000,
        3.97
      ],
      [
        1490684628000,
        3.92
      ],
      [
        1490684805000,
        3.91
      ],
      [
        1490684981000,
        3.7
      ],
      [
        1490685158000,
        3.95
      ],
      [
        1490685336000,
        3.61
      ],
      [
        1490685514000,
        4.21
      ],
      [
        1490685687000,
        3.97
      ],
      [
        1490685864000,
        3.64
      ]
    ]
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
                str=this.name+':'+unit_format(this.y,'B')
                str+='<br>百分比:'+parseFloat(this.percentage).toFixed(2)+'%'
                str+='<br>总计:'+unit_format(this.y,'B')
                return str
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
    var write_parm=create_request_parm('#disk_io_date','disk_io_write')
    var read_parm=create_request_parm('#disk_io_date','disk_io_read')
     $.when(req_ajax('/api/zabbix_history_get/',write_parm,'req_data1'),req_ajax('/api/zabbix_history_get/',read_parm,'req_data2'))
        .done(function () {
            alert(JSON.stringify(req_data1))
            alert(JSON.stringify(req_data2))
            Highcharts.setOptions({ global: { useUTC: false } });
            $('#disk_io_speed_graphs').highcharts({
            chart: {
                type: 'spline'
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
                tickInterval:1000*60*5,
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
                tickAmount:5,
            },
            tooltip: {
                headerFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br>',
                pointFormat: '{series.name}:{point.y:.2f}%'
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
                data: req_data1[read_parm['hostid']]['data']
            },{
                name:'磁盘读取速率',
                data:req_data2[read_parm['hostid']]['data']
            }]
            });
        })
}
//主机详情CPU图
function host_detailed_cpu() {
    var hostid=getQueryString('hostid')
    var parm=create_request_parm('#host_cpu_date','cpu_util')
    $.when(req_ajax('/api/zabbix_history_get/',parm,'req_data'))
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
                    headerFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br>',
                    pointFormat: '{series.name}:{point.y:.2f}'+parm['units']
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
                    data: req_data[parm['hostid']]['data']
                }],
                credits:{
                    enabled:false
                }
            });
        })
}
function host_detailed_memory() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#host_detailed_memory').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
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
            legend: {
                enabled: false
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
                name: 'cpu使用率',
                data: data1
            }],
            credits:{
                enabled:false
            }
        });
}
function nic_in() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#nic_in').highcharts({
        chart: {
            type: 'spline'
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
            pointFormat: '{series.name}:{point.y:.2f}%'
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
            data: data1
        },{
            name:'外网',
            data:data2
        }]
    });
}
function nic_out() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#nic_out').highcharts({
        chart: {
            type: 'spline'
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
            pointFormat: '{series.name}:{point.y:.2f}%'
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
            data: data1
        },{
            name:'外网',
            data:data2
        }]
    });
}
function tomcat_heap_memory() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#tomcat_heap_mem').highcharts({
            chart: {
                zoomType: 'x',
                borderColor:'#222d32',
            },
            title: {
                text: '<p style="font-size: 12px;">tomcat堆内存</p>'
            },
            xAxis: {
                type: 'datetime',
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
            legend: {
                enabled: false
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
                name: 'cpu使用率',
                data: data1
            }],
            credits:{
                enabled:false
            }
        });
}
function tomcat_non_heap_memory() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#tomcat_non_heap_mem').highcharts({
            chart: {
                zoomType: 'x',
                borderColor:'#222d32',
            },
            title: {
                text: '<p style="font-size: 12px;">tomcat非堆内存</p>'
            },
            xAxis: {
                type: 'datetime',
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
            legend: {
                enabled: false
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
                name: 'cpu使用率',
                data: data1
            }],
            credits:{
                enabled:false
            }
        });
}
function tomcat_connect() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#tomcat_connect').highcharts({
        chart: {
            type: 'spline',
            borderColor:'#222d32',
        },
        colors:[ '#FEA934','#48a301'],
        title: {
            text: '<p style="font-size: 12px;">tomcat当前连接数</p>'
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
            pointFormat: '{series.name}:{point.y:.2f}%'
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
            data: data1
        },{
            name:'外网',
            data:data2
        }]
    });
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
            pointFormat: '{series.name}:{point.y:.2f}%'
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
            data: data1
        },{
            name:'外网',
            data:data2
        }]
    });
}
function thrift_memory() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#thrift_mem').highcharts({
            chart: {
                zoomType: 'x',
                borderColor:'#222d32',
            },
            title: {
                text: '<p style="font-size: 12px;">thrift堆内存</p>'
            },
            xAxis: {
                type: 'datetime',
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
            legend: {
                enabled: false
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
                name: 'cpu使用率',
                data: data1
            }],
            credits:{
                enabled:false
            }
        });
}
function thrift_cpu() {
    Highcharts.setOptions({ global: { useUTC: false } });
    $('#thrift_cpu').highcharts({
            chart: {
                zoomType: 'x',
                borderColor:'#222d32',
            },
            title: {
                text: '<p style="font-size: 12px;">thrift cpu</p>'
            },
            xAxis: {
                type: 'datetime',
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
            legend: {
                enabled: false
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
                name: 'cpu使用率',
                data: data1
            }],
            credits:{
                enabled:false
            }
        });
}
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
                                  months:1024
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
                                }
                           });
}
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
            tomcat_heap_memory()
            tomcat_non_heap_memory()
            tomcat_connect()
    }
     if (app[0]['thrift'].length!=0){
            date_select('#thrift_date')
            thrift_connect()
            thrift_memory()
            thrift_cpu()
    }
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
