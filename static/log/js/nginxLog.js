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
    nginxGraphs(parm)
    addPoint(parm)
}
function nginxGraphs(parm) {
    parm['action']='date'
    $.when(req_ajax("/api/nginxLog/",parm,'graphLogData'))
        .done(function () {
             $('#CountNum').html('总共 '+graphLogData['totalCount']+'条')
             // sessionStorage.scrollId=GraphData['ScrollId']
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

$(document).ready(function () {
    date_select('#nginxLogDate')
    map = new AMap.Map('map', {
        resizeEnable: true,
        zoom:11,
        mapStyle:"amap://styles/eb7e0c164f54d395c1a66b7db4041173"
    });
})