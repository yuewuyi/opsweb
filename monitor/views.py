from django.shortcuts import render
from user.models import User
from django.http import HttpResponse
from utils.config import config
# Create your views here.
def index(request):
    return render(request,'monitor/index.html')
def config(request):
    config_class=config
    config_class.get_config_value('zabbix_api_addr')
    return render(request, 'monitor/config.html')