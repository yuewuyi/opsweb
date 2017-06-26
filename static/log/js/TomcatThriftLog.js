/**
 * Created by suyue on 2017/6/19.
 */
function TomcatThriftLogGraph(){
    $.when(req_ajax('/api/TomcatThriftLog/','cs','GraphData'))
        .done(function () {
             $('#CountNum').html('总共 '+GraphData['TotalCount']+'条')
             Highcharts.setOptions({ global: { useUTC: false } });
             $('#TomcatThriftLogGraph').highcharts({
        chart: {
            type: 'column',
            reflow:true
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: GraphData['date'],
            tickInterval:1,
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
                    }
                },
        },
        yAxis: {
            title: {
                text: ''
            },
            tickInterval:10,
            max:GraphData['MaxCount'],
            stackLabels: {
                enabled: false,
            }
        },
        legend: {
            enabled:false
        },
        exporting:{
                enabled:false
        },
        credits:{
                enabled:false
        },
        tooltip: {
            formatter: function () {
                return '' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x) + '<br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    '总数: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: 'INFO',
            color:'#00AF7C',
            data: GraphData['info']
        }, {
            name: 'ERROR',
            color:'#D24A52',
            data: GraphData['error']
        }, {
            name: 'WARN',
            color:'#FEA934',
            data: GraphData['warn']
        }]
    });
        })
}


$(document).ready(function () {
    date_select('#TomcatThriftDate',3)
    TomcatThriftLogGraph()
})
function graphs_size() {
     $('#TomcatThriftLogGraph').highcharts().reflow()
}