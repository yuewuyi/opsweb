from django.shortcuts import render
from user.models import User
from django.http import HttpResponse
from utils.config import app_config
from utils.http_request import Http_request
# Create your views here.
def index(request):
    return render(request,'monitor/index.html')
def config(request):
    # app_config.get_config_value('zabbix_api_addr')
    # return HttpResponse(app_config.get_config_value('zabbix_api_addr')['config_item'])
    # return render(request, 'monitor/config.html')
    zz=Http_request()
    return HttpResponse(zz.zabbix_request_post('mdzz','user.login'))