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
}
function nginxGraphs(parm) {
    $.when(req_ajax("/api/nginxLog/",parm,'graphLogData'))
        .done(function () {
                alert(JSON.stringify(graphLogData))
        })
}
function addPoint(map) {
    $.get('http://127.0.0.1:8000/api/nginxLog',function (data) {
        var location=[]
        var docCount=[]
        var point=''
        var infoWindow=''
        var markers = []
        for (var i=0;i<data.length;i++){
            location.push([decodeGeoHash(data[i]['key'])['longitude'][2],decodeGeoHash(data[i]['key'])['latitude'][2]])
            docCount.push(data[i]['doc_count'])
        }
        var maxNum=Math.max.apply(null,docCount)
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
    var map = new AMap.Map('map', {
        resizeEnable: true,
        zoom:11,
        mapStyle:"amap://styles/eb7e0c164f54d395c1a66b7db4041173"
    });
})