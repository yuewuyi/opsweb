from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from utils.jurisdiction import UserAuth
from django.core.urlresolvers import reverse
class UserAuthMiddleware(MiddlewareMixin):
#url权限配置
    __auth_url_config={
        '/home/':'show',
        '/user/':'none',
        '/user/Login/':'none'
    }
    def __init__(self,get_response):
        self.get_response = get_response
    def __call__(self, request):
#判断是否存在
        if not request.path in self.__auth_url_config.keys():
            response = HttpResponse(status=404)
#判断是否为不需要验证的url
        elif not self.__auth_url_config[request.path] == 'none':
            try:
                user=request.session['user']
                if UserAuth(user,self.__auth_url_config[request.path]).GetValue():
                    response = self.get_response(request)
                else:
                    response = HttpResponse(status=403)
            except Exception as e:
                response = HttpResponseRedirect(reverse('login'))
        else:
            response = self.get_response(request)
        return response