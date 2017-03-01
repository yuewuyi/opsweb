/**
 * Created by suyue on 2017/2/28.
 */
function monitor_search_form_submit() {
    $("#monitor_search_form").submit()
}
function warning_info_div() {
    var oEvent=event;
    var oDiv=document.createElement('div');
    oDiv.style.left=oEvent.clientX+'px';  // 指定创建的DIV在文档中距离左侧的位置
    oDiv.style.top=oEvent.clientY+'px';  // 指定创建的DIV在文档中距离顶部的位置
    oDiv.style.border='1px solid #e0e5e8'; // 设置边框
    oDiv.style.background='#ffffff'
    oDiv.innerHTML=""
    oDiv.id="warn_info"
    oDiv.style.boxShadow="0 0 5px #000000"
    oDiv.style.borderRadius="1px"
    oDiv.style.position='absolute'; // 为新创建的DIV指定绝对定位
    oDiv.style.width='200px'; // 指定宽度
    oDiv.style.height='auto'; // 指定高度
    document.body.appendChild(oDiv);
}
