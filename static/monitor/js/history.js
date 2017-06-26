/**
 * Created by suyue on 2017/6/1.
 */
function custom_graphs() {
    var hostitemids={}
    var hostid=getQueryString('hostid')
    var unit=getQueryString('unit')
    var value_type=getQueryString('ValueType')
    var itemid=getQueryString('itemid')
    var date=data_split_format('#graphs_date')
    hostitemids[hostid]={data:itemid}
    var parm={
        value_type:value_type,
        itemids:itemid,
        start_time:date['start_time'],
        stop_time:date['end_time'],
        host_item_ids:hostitemids
    }
    $.when(req_ajax('/api/zabbix_history_get/',parm,'history_data'))
        .done(function () {
            Highcharts.setOptions({ global: { useUTC: false } });
    $('#custom_graph').highcharts({
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
            tickInterval:1000*6*10,
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
                            return unit_format(this.value,unit,'float')
                        }
                     },
        },
        tooltip: {
            formatter: function () {
                        var s = '<span style="color:'+this.color+'">'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x)+'</span>'
                        s+='<br\><span style="color:'+this.color+'">字段值:'+unit_format(this.y,unit,'float')+'</span>'
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
            data: history_data[hostid]['data']
        }]
    });
        })

}
$(document).ready(function () {
    date_select('#graphs_date')
    custom_graphs()
})
function graphs_size() {
     $('#custom_graph').highcharts().reflow()
}
