from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse,HttpResponseRedirect
from django.core.urlresolvers import reverse
from user.models import User
class UserAuthMiddleware(MiddlewareMixin):
#url权限配置
    __auth_url_config={
        '/':2,
        '/favicon.ico':0,
        '/home/':2,
        '/user/':0,
        '/user/Login/':0,
        '/user/signOut/':1,
        '/monitor/':3,
        '/monitor/host_detailed/':3,
        '/monitor/config/':3,
        '/api/zabbix_history_get/':3,
        '/monitor/Latest_Data/':3,
        '/monitor/history/':3,
        '/api/TomcatThriftLog/': 2,
        '/log/TomcatThrift/':2,
        '/api/logScroll/':2,
        '/log/nginx/':2,
        '/api/nginxLog/':2,
        '/log/luceneCustomQuery/':2,
        '/api/customQuery/':2,
        '/deploy/':4,
        '/api/addHost/':4,
        '/api/updateHost/':4,
        '/api/delHost/':4,
        '/api/bindHost/':4,
        '/deploy/appTemplate/':4,
        '/api/template/':4
    }
    def __init__(self,get_response):
        self.get_response = get_response
    def __call__(self, request):
#判断是否存在
        if not request.path in self.__auth_url_config.keys():
            response = HttpResponse(status=403)
#判断是否为不需要验证的url
        elif not self.__auth_url_config[request.path] == 0:
            #判断此用户是否登录
            try:
                user=request.session['user']
                level=User.objects.filter(user=user).values('level').first()['level']
                if level>=self.__auth_url_config[request.path]:
#附加用户权限到session
                    request.session['level'] = level
                    response = self.get_response(request)
                else:
                    response = HttpResponse(status=403)
            except Exception as e:
                response = HttpResponseRedirect(reverse('login'))
        else:
            response = self.get_response(request)
        return response