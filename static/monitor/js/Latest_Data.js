/**
 * Created by suyue on 2017/6/12.
 */
function LastestDataFromSubmit() {
    var HostName=$.trim($('#HostName').val())
    var ItemName=$.trim($('#ItemName').val())
    url='/monitor/Latest_Data/?HostName='+HostName+'&ItemName='+ItemName
    location.href=encodeURI(url)
}