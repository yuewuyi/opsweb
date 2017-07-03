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
            AddTable(GraphData['LogMessage'])
        })
}


$(document).ready(function () {
    date_select('#TomcatThriftDate',3)
    TomcatThriftLogGraph()
})
function graphs_size() {
     $('#TomcatThriftLogGraph').highcharts().reflow()
}
function ShowDetailed(obj){
    var TdObject=$(obj).parent().parent().next()
    var ClassName=TdObject[0].className
    if(ClassName=="DetailedMessageHide"){
        TdObject.removeClass('DetailedMessageHide')
        TdObject.addClass('DetailedMessageShow')
    }else{
        TdObject.removeClass('DetailedMessageShow')
        TdObject.addClass('DetailedMessageHide')
    }
}
function AddTable(message) {
    for (i=0;i<message.length;i++){
        var BrifeMessage=message[i]['_source']['message']
        var tr1='<tr class="BriefMessage">'
        tr1=tr1+"<td>"+message[i]['_source']['@timestamp']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['host']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['ip']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['AppName']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['LogType']+"</td>"
        tr1=tr1+"<td><div class='MessageDiv'>"+BrifeMessage+"</div></td>"
        tr1=tr1+'<td><a onclick="ShowDetailed(this)">查看</a></td>'
        var tr2='<tr class="DetailedMessageHide"><td colspan="7">'+BrifeMessage.replace(/\n/g,'<BR>')+'</td></tr>'
        $("#LogTable").append(tr1)
        $("#LogTable").append(tr2)
    }
}