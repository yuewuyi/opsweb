from django.shortcuts import render
# Create your views here.
def index(request):
    return render(request,'monitor/index.html')
def config(request):
    # conf=app_config()
    # return HttpResponse(conf.get_config_value('zabbix_auth_str')['config_item1'])
    return render(request, 'monitor/config.html')