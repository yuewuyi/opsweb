/**
 * Created by suyue on 2017/7/20.
 */
    //返回相匹配点的数量
function retDocument(loca,docCount,point) {
        for (var i =0;i<loca.length;i++){
            if(parseInt(loca[i][0])==parseInt(point[0]) && parseInt(loca[i][1])==parseInt(point[1])){
                break;
            }
        }
        return docCount[i]
    }
    //选择样式
function selectStyle(maxNum,curNum) {
        var styleName='makerL1'
       if(curNum/maxNum>=0.9){
           styleName='makerL5'
       }else if(curNum/maxNum>=0.7){
           styleName='makerL4'
       }
       else if(curNum/maxNum>=0.5){
           styleName='makerL3'
       }
       else if(curNum/maxNum>=0.3){
           styleName='makerL2'
       }
       return styleName
    }
function searchNginxLog() {
    var date=($("#nginxLogDate").find('span').html()).split(" -- ")
    date[0]=Date.parse(date[0])
    date[1]=Date.parse(date[1])
    var interval=parseInt((date[1]-date[0])/(60*1000))
    var parm={
        'hostName':($.trim($('#HostName').val())).toLocaleLowerCase(),
        'ipAddr':($.trim($('#ip').val())).toLocaleLowerCase(),
        'agentIp':$.trim($('#AgentIp').val()),
        'reqStatusSymbol':$('#reqStatusSelect').select().val(),
        'reqStatus':parseInt($.trim($('#reqStatus').val())),
        'reqTimeSymbol':$.trim($('#reqTimeSelect').val()),
        'reqTime':parseFloat($.trim($('#reqTime').val())),
        'uri':$.trim($('#uri').val()),
        'interval':interval,
        'startTime':date[0],
        'endTime':date[1]
    }
    if(interval<1){
        alert('时间间隔太短')
    }else {
        sessionStorage.interval=interval
        nginxGraphs(parm)
        addPoint(parm)
        cityIpCount(parm)
    }

}
function graphs_size() {
     $('#nginxLogGraph').highcharts().reflow()
}
function nginxGraphs(parm) {
    parm['action']='date'

    $.when(req_ajax("/api/nginxLog/",parm,'graphLogData'))
        .done(function () {
             $('#CountNum').html('总共 '+graphLogData['totalCount']+'条')
             sessionStorage.scroll=1
             sessionStorage.scrollId=graphLogData['ScrollId']
             $("#LogTable tr:not(:nth-child(1))").remove()
             addTable(graphLogData['message'])
             Highcharts.setOptions({ global: { useUTC: false } });
             $('#nginxLogGraph').highcharts({
        chart: {
            type: 'column',
            reflow:true
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: graphLogData['date'],
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
            max:graphLogData['maxCount'],
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
                        $('#nginxLogDate span').html(start_time.format('Y-m-d H:i:s') + ' -- ' + end_time.format('Y-m-d H:i:s'));
                        searchNginxLog()
                    }
                }
            }
        },
        series: [{
            name: '正常请求',
            color:'#00AF7C',
            data: graphLogData['norReq']
        }, {
            name: '错误请求',
            color:'#D24A52',
            data: graphLogData['ErrReq']
        }]
    });
        })
}
function addPoint(parm) {
    parm['action']='map'
    $.when(req_ajax("/api/nginxLog/",parm,'graphMapData'))
    .done(function () {
        var location=[]
        var docCount=[]
        var point=''
        var infoWindow=''
        var markers = []
        for (var i=0;i<graphMapData.length;i++){
            location.push([decodeGeoHash(graphMapData[i]['key'])['longitude'][2],decodeGeoHash(graphMapData[i]['key'])['latitude'][2]])
            docCount.push(graphMapData[i]['doc_count'])
        }
        var maxNum=Math.max.apply(null,docCount)
         map.clearMap()
        for(var i=0;i<location.length;i++){
            markers.push(new AMap.Marker({
                map:map,
                position:location[i],
                content: '<div class="'+selectStyle(maxNum,docCount[i])+'"></div>',
                offset: new AMap.Pixel(0,0)
        }))
            AMap.event.addListener(markers[i], 'mouseover', function(context) {
                point=[context.target.getPosition().lng,context.target.getPosition().lat]
                var docNum=retDocument(location,docCount,point)
                infoWindow = new AMap.InfoWindow({
                    isCustom: true,
                    content: '<div class="infoWindow">'+docNum+'</div>',
                    offset: new AMap.Pixel(0, 0)
                });
                infoWindow.open(map,point)
            });
            AMap.event.addListener(markers[i], 'mouseout', function() {
                infoWindow.close()
            });
        }
    })
}
// ip访问次数统计
function cityIpCount(parm) {
    parm['action']='CityIp'
    $.when(req_ajax("/api/nginxLog/",parm,'cityIpData'))
        .done(function () {
            $("#aggsTable tr").remove()
            for(i=0;i<cityIpData.length;i++) {
                var tr = '<tr class="aggsTr"><td>' + cityIpData[i][0] + '</td>'
                tr += '<td>' + cityIpData[i][1] + '</td>'
                tr += '<td>' + cityIpData[i][2] + '</td></tr>'
                $("#aggsTable").append(tr)
            }
        })
}
function addTable(message) {
    for (i=0;i<message.length;i++){
        var date=new Date(message[i]['_source']['@timestamp'])
        date=date.format("Y-m-d H:i:s")
        var tr='<tr>'
        tr=tr+"<td>"+date+"</td>"
        tr=tr+"<td>"+message[i]['_source']['host']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['status']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['request_time']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['remote_addr']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['geoip']['city_name']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['request_method']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['body_bytes_sent']+"</td>"
        tr=tr+"<td>"+message[i]['_source']['uri']+"</td>"
        tr=tr+'<td><a onclick="ShowDetailed(this)">查看</a></td></tr>'
        var tr2='<tr class="DetailedMessageHide"><td colspan="10">'+JSON.stringify(message[i])+'</td></tr>'
        $("#LogTable").append(tr)
        $("#LogTable").append(tr2)
    }
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
$(document).ready(function () {
    date_select('#nginxLogDate')
    map = new AMap.Map('map', {
        resizeEnable: true,
        zoom:11,
        mapStyle:"amap://styles/eb7e0c164f54d395c1a66b7db4041173"
    });
    searchNginxLog()
    $("#nginxLog").scroll(function() {
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
                            addTable(scrollData['message'])
                        }
                    }else {
                        alert('分页ID不存在或已过期')
                    }

                })

        }
    });
})