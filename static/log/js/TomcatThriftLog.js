/**
 * Created by suyue on 2017/6/19.
 */
function TomcatThriftLogGraph(){
    $.when(req_ajax('/api/TomcatThriftLog/','cs','GraphData'))
        .done(function () {
             $('#TomcatThriftLogGraph').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: GraphData['date']
        },
        yAxis: {
            softMax: 0,
            title: {
                text: ''
            },
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
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    '总量: ' + this.point.stackTotal;
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
    date_select('#TomcatThriftDate')
    TomcatThriftLogGraph()
})
