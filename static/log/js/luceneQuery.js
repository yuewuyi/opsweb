/**
 * Created by suyue on 2017/8/8.
 */
function strReplace(str) {
    var strList1=['*','.','-']
    var strList2=['\\*','\\.','\\-']
    for (var i=0;i<strList1.length;i++){
        str=str.replace(strList1[i],strList2[i])
    }
    return str
}
function listenText() {
    $('#indexName').keyup(function () {
        var indexList=$("#customQuery").data('index')
        indexList=indexList.sort()
        var indexName=$('#indexName').val()
        var regList=[]
        if (indexName==''){
            regList=indexList.slice(0,9)
        }else {
            indexName=strReplace(indexName)
            var reg=new RegExp("^"+indexName)
            for (i=0;i<indexList.length;i++){
                if (reg.test(indexList[i])){
                    regList.push(indexList[i])
                }
                if (regList.length>=10){
                    break
                }
            }
        }
        if ($("#indexSelect").length > 0){
            $('#indexSelect').remove()
        }
        if(regList.length>0){
            createDiv(regList)
        }
    })
    $('#indexName').blur(function () {
        if ($("#indexSelect").length > 0){
            setTimeout("$('#indexSelect').remove()",150)
        }
    })
}
function getVale(obj) {
    $('#indexName').val(obj.innerHTML)
}

function createDiv(regList) {
    var inner='<ul class="select_box">'
    for (i=0;i<regList.length;i++){
        inner+="<li onclick='getVale(this)'>"+regList[i]+"</li>"
    }
    inner+="</ul>"
    var offset=$('#indexName').offset()
    var width=$('#indexName').width()+2
    var Div = document.createElement('div')
    Div.style.left = offset['left'] + 'px'
    Div.style.top = offset['top']+20 + 'px'
    Div.style.border = '1px solid #e0e5e8'
    Div.style.background = '#ffffff'
    Div.style.width=width+'px'
    Div.style.position = 'absolute'
    Div.id = "indexSelect"
    Div.innerHTML=inner
    document.body.appendChild(Div)
}
function searchLog() {
    var date=($("#luceneDate").find('span').html()).split(" -- ")
    var queryStr=$.trim($('#queryStr').val())
    if (queryStr==''){
        queryStr='*'
    }
    date[0]=Date.parse(date[0])
    date[1]=Date.parse(date[1])
    var interval=parseInt((date[1]-date[0])/(60*1000))
    var parm={indexName:$.trim($('#indexName').val()),
            queryStr:queryStr,
            interVal:interval,
            startTime:date[0],
            endTime:date[1]}
    if(interval<1){
        alert('时间间隔太短')
    }else {
         sessionStorage.interval=interval
         loading('add')
         $.when(req_ajax('/api/customQuery/',parm,'customData'))
        .done(function () {
            if(customData['code']==-1){
                console.log(customData['message'])
                $('#customLogGraph').html(customData['message'])
                $('#CountNum').html('总共 0 条')
                loading('remove')
            }else {
                graphsCustom(customData)
                loading('remove')
            }

        })
             .fail(function () {
                 alert('日志数据获取失败')
                 loading('remove')
             })
    }

}

function graphsCustom(GraphData){
     $('#CountNum').html('总共 '+GraphData['TotalCount']+'条')
             sessionStorage.scrollId=GraphData['ScrollId']
             sessionStorage.scroll=1
             Highcharts.setOptions({ global: { useUTC: false } });
             $('#customLogGraph').highcharts({
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
                    this.series.name + ': ' + this.y + '<br/>'
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
                        $('#luceneDate span').html(start_time.format('Y-m-d H:i:s') + ' -- ' + end_time.format('Y-m-d H:i:s'));
                        searchLog()
                    }
                }
            }
        },
        series: [{
            name: '文档数',
            color:'#00AF7C',
            data: GraphData['docNum']
        }]
    });
            $("#LogTable tr:not(:nth-child(1))").remove()
            AddTable(GraphData['LogMessage'])
}
$(document).ready(function () {
    date_select('#luceneDate')
    listenText()
    $("#customQuery").scroll(function() {
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
function showMessage(message,parKey) {
    var   gettype=Object.prototype.toString
    var   messageStr=''
    for (key in message){
        if (gettype.call(message[key])=="[object Object]"){
            if(parKey==''){
                messageStr+=showMessage(message[key],key)
            }else {
                messageStr+=showMessage(message[key],parKey+'.'+key)
            }

        }
        else if(gettype.call(message[key])=="[object Array]"){
            if(parKey!=''){
                messageStr+='<b>'+parKey+'.'+key+':</b>'+(JSON.stringify(message[key])).replace(/[\[\]]/g,'')+'<BR/>'
            }else {
                messageStr+='<b>'+key+':</b>'+(JSON.stringify(message[key])).replace(/[\[\]]/g,'')+'<BR/>'
            }
        }else {
            if(parKey!=''){
                messageStr+='<b>'+parKey+'.'+key+':</b>'+JSON.stringify(message[key])+'<BR/>'
            }else {
                messageStr+='<b>'+key+':</b>'+JSON.stringify(message[key])+'<BR/>'
            }
        }
    }
    return messageStr
}
function AddTable(message) {
    for (i=0;i<message.length;i++){
        var BrifeMessage=''
        var DetailMessage=JSON.stringify(message[i]['_source'])
        if (DetailMessage.length>=350){
            BrifeMessage=DetailMessage.substring(0,350)
        }else {
            BrifeMessage=DetailMessage
        }
        DetailMessage=showMessage(message[i],'')
        var date=new Date(message[i]['_source']['@timestamp'])
        date=date.format("Y-m-d H:i:s")
        var tr1='<tr class="BriefMessage">'
        tr1=tr1+"<td>"+date+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['host']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['ip']+"</td>"
        tr1=tr1+"<td>"+message[i]['_source']['source']+"</td>"
        tr1=tr1+"<td>"+message[i]['_index']+"</td>"
        tr1=tr1+"<td><div class='MessageDiv'>"+BrifeMessage+"</div></td>"
        tr1=tr1+'<td><a onclick="ShowDetailed(this)">查看</a></td></tr>'
        var tr2='<tr class="DetailedMessageHide"><td colspan="7">'+DetailMessage+'</td></tr>'
        $("#LogTable").append(tr1)
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