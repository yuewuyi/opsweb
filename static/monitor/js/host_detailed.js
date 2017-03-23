/**
 * Created by suyue on 2017/3/21.
 */
function disk_graphs(id) {
    $(id).highcharts({
        chart: {
            margin:[20,0,,0],
            spacing:[0,0,0,0],
        },
        colors:[ '#FEA934','#B4FC7E'],
        title: {
            text: '<span style="line-height:30px;"><b>/server</b></span>',
            margin:[0,0,0,0],
            style:{
                fontSize:5,
            },
            useHTML:true,
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: {point.y}<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
            },
        },
        exporting:{
                enabled:false
        },
        series: [{
            type: 'pie',
            name: '磁盘使用情况',
            data: [
                ['已用',3000000],
                ['可用',5000000]
            ]
        }],
        credits: {
                enabled: false
            },
    });
}
function disk_io_speed() {

}
$(document).ready(function () {
    z=4
    if (z<4) {
        mgleft = ['32.5%', '25%', '11.5%']
        document.getElementById('disk_g1').style.marginLeft = mgleft[z - 1]
    }
    for (i=1;i<=z;i++){
        document.getElementById('disk_g'+i).style.display = "inline"
        disk_graphs('#disk_g' + i)
    }
    disk_io_speed()
})
