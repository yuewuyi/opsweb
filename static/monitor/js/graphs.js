var req_data=''
//获取cookie
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
}
function cpu_graphar(id,data) {
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
                    s+='<br\><span style="color:#7cb5ec">cpu使用率:'+this.y+'%</span>'
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
function memory_graphs(id,data) {
    var indexs=null
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
                max:data['total_mem'],
                min:0,
                visible:false,
            },
            legend: {
                enabled: false
            },
              tooltip: {
                   formatter: function () {
                        var s = '<span style="color:#7cb5ec">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',data['alivable_mem'][indexs][0])+'</span>'
                        s+='<br\><span style="color:#7cb5ec">已使用:'+data['alivable_mem'][indexs][1]+'GB</span>'
                        s+='<br\><span style="color:#7cb5ec">使用百分比:'+data['alivable_mem'][indexs][2]+'%</span>'
                        s+='<br\><span style="color:#7cb5ec">总计:'+data['total_mem']+'GB</span>'
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
                    point:{
                        events:{
                                mouseOver: function(event) {
                                indexs = event.target.index;
                                console.log(indexs);
                             }
                        }
                    }
                }
            },
            exporting:{
                enabled:false
            },
            series: [{
                type: 'area',
                data: data['alivable_mem'],
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
//请求CPU数据并赋值给图形
function cpu_data_req(start_time,stop_time) {
    var itemids=[]
    var host_item_ids={}
    if(stop_time==''){
        stop_time=Date.parse(new Date())/1000;
    }
    if(start_time==''){
        start_time=stop_time-7200
    }
    host_data=eval($("#data_storage").data('host'))
    zabbix_conf=eval($("#data_storage").data('key'))[0]
    $.each(host_data,function (index,value,array) {
        itemid={}
        //去除status为0的主机
       if (value['status']=='0'){
            $.each(value['items'],function (index2,value2,array2) {
                if (value2['name']==zabbix_conf['cpu_util']){
                    itemid['cpu_util']=value2['itemid']
                    itemids.push(value2['itemid'])
                    return false
                }
            })
            host_item_ids[value['hostid']]=itemid
       }else {
           return false;
       }
    })
    //使用链式调用
    $.when(req_ajax('/api/zabbix_cpu_get/',{"itemids":itemids,"host_item_ids":host_item_ids,"start_time":start_time,"stop_time":stop_time}))
        .done(function () {
          for (var key in req_data){
              cpu_graphar("#hostid_"+key,req_data[key]['cpu_util'])
          }
        })
}
//请求内存数据
function memory_data_req(start_time,stop_time) {
    var itemids=[]
    var host_item_ids={}
    if(stop_time==''){
        stop_time=Date.parse(new Date())/1000;
    }
    if(start_time==''){
        start_time=stop_time-7200
    }
    host_data=eval($("#data_storage").data('host'))
    zabbix_conf=eval($("#data_storage").data('key'))[0]
    $.each(host_data,function (index,value,array) {
        itemid={}
       if (value['status']=='0'){
            $.each(value['items'],function (index2,value2,array2) {
                if (value2['name']==zabbix_conf['total_mem']){
                    itemid['total_mem']=value2['itemid']
                    itemids.push(value2['itemid'])
                }else if (value2['name']==zabbix_conf['alivable_mem']){
                    itemid['alivable_mem']=value2['itemid']
                    itemids.push(value2['itemid'])
                }
            })
            host_item_ids[value['hostid']]=itemid
       }else {
           return false;
       }
    })
    $.when(req_ajax('/api/zabbix_memory_get/',{"itemids":itemids,"host_item_ids":host_item_ids,"start_time":start_time,"stop_time":stop_time}))
        .done(function () {
          for (var key in req_data){
              memory_graphs("#hostid_"+key,req_data[key])
          }
        })
}
function cpu_memory_change(value) {
    if(value=="cpu"){
        cpu_data_req('','')
    }else if(value=="memory"){
        memory_data_req('','')
    }
}