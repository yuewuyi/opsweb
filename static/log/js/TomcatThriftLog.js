/**
 * Created by suyue on 2017/6/19.
 */
function TomcatThriftLogGraph(parm){
    $.when(req_ajax('/api/TomcatThriftLog/',parm,'GraphData'))
        .done(function () {
             $('#CountNum').html('总共 '+GraphData['TotalCount']+'条')
             sessionStorage.scrollId=GraphData['ScrollId']
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
                },
                events:{
                    click:function (event){
                        var start_time=event.point.category
                        var end_time=start_time+(sessionStorage.interval*1000)
                        start_time=new Date(start_time)
                        end_time=new Date(end_time)
                        $('#TomcatThriftDate span').html(start_time.format('Y-m-d H:i:s') + ' -- ' + end_time.format('Y-m-d H:i:s'));
                        searchTomcatLog()
                    }
                }
            }
        },
        series: [{
            name: 'INFO',
            color:'#00AF7C',
            data: GraphData['INFO']
        }, {
            name: 'ERROR',
            color:'#D24A52',
            data: GraphData['ERROR']
        }, {
            name: 'WARN',
            color:'#FEA934',
            data: GraphData['WARN']
        }]
    });
            $("#LogTable tr:not(:nth-child(1))").remove()
            AddTable(GraphData['LogMessage'])
        })
}
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
        var BrifeMessage=''
        var DetailMessage=message[i]['_source']['message']
        if (DetailMessage.length>=260){
            BrifeMessage=DetailMessage.substring(0,260)
        }else {
            BrifeMessage=DetailMessage
        }
        var date=new Date(message[i]['_source']['@timestamp'])
        date=date.format("Y-m-d H:i:s")
        var tr1='<tr class="BriefMessage">'
        tr1=tr1+"<td>"+date+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['host']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['ip']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['AppName']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['LogType']+"</td>"
        tr1=tr1+"<td><div class='MessageDiv'>"+BrifeMessage+"</div></td>"
        tr1=tr1+'<td><a onclick="ShowDetailed(this)">查看</a></td></tr>'
        var tr2='<tr class="DetailedMessageHide"><td colspan="7">'+DetailMessage.replace(/\n/g,'<BR>')+'</td></tr>'
        $("#LogTable").append(tr1)
        $("#LogTable").append(tr2)
    }
}
function searchTomcatLog() {
    var hostName=$.trim($('#HostName').val())
    var ipAddr=$.trim($('#ip').val())
    var appName=$.trim($('#AppName').val())
    var appType=$('#AppType').select().val()
    var logType=$('#LogType').select().val()
    var date=($("#TomcatThriftDate").find('span').html()).split(" -- ")
    date[0]=Date.parse(date[0])
    date[1]=Date.parse(date[1])
    var interval=parseInt((date[1]-date[0])/(60*1000))
    var parm={
        "hostName":hostName.toLocaleLowerCase(),
        "ipAddr":ipAddr,
        "appName":appName.toLocaleLowerCase(),
        "appType":appType,
        "logType":logType.toLocaleLowerCase(),
        "startTime":date[0],
        "endTime":date[1],
        "interval":interval
    }
    if(interval<1){
        alert('时间间隔太短')
    }else {
        sessionStorage.interval=interval
        TomcatThriftLogGraph(parm)
    }

}
$(document).ready(function () {
    date_select('#TomcatThriftDate')
    sessionStorage.scroll=1
    searchTomcatLog('')
    $("#appLog").scroll(function() {
        var scrollTop = $(this).scrollTop()
　　    var documentHeight = $(this).height()
        var containerHeight =$(this).get(0).scrollHeight
        if((scrollTop+documentHeight)/containerHeight>=0.95 && sessionStorage.scroll !=0){
            sessionStorage.scroll=0
            $.when(req_ajax('/api/logScroll/',{"scrollId":sessionStorage.scrollId},'scrollData'))
                .done(function () {
                    if (scrollData['code']==0){
                        if(scrollData['message'].length !==0){
                            sessionStorage.scroll=1
                            AddTable(scrollData['message'])
                        }
                    }else {
                        alert('分页ID不存在或已过期')
                    }

                })

        }
    });
})