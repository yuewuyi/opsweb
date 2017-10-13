/**
 * Created by suyue on 2016/12/11.
 */
function enc_pwd() {
        user=document.getElementById('user').value
        pwd=document.getElementById('pwd').value
        if (user!="" && pwd!=""){
        var shaObj = new jsSHA("SHA-512", "TEXT")
        shaObj.update(pwd)
        var hash = shaObj.getHash("HEX")
        document.getElementById('pwd').value=hash
        document.getElementById('login_post').submit();

    }else {
        document.getElementById('log_error').innerHTML="用户名账号不能为空!"
    }

}
