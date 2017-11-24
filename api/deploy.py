import json
from deploy.models import *
from django.db.models import Q
from utils.salt_Client import saltClient
from django.http import HttpResponse
from utils.raw_sql import *
from datetime import datetime
def addHost(request):
    if request.method=='POST':
        postData = json.loads(request.body.decode())
        code = 0
        msg = ''
        if not host.objects.filter(Q(hostName=postData['hostName'])|Q(ip=postData['ip'])):
            host.objects.create(**postData)
        else:
            code=-1
            msg="主机名或IP已存在"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')
    else:
        return  HttpResponse(status=404)
def updateHost(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        code=0
        msg=''
        if not host.objects.filter(~Q(id=postData['id']),Q(hostName=postData['hostName'])|Q(ip=postData['ip'])):
            host.objects.filter(id=postData['id']).update(hostName=postData['hostName'],ip=postData['ip'])
        else:
            code=-1
            msg="主机名或IP已存在"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')
    else:
        return  HttpResponse(status=404)
def delHost(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        code = 0
        msg = ''
        if host.objects.filter(id=postData['id'],hostName=postData['hostName']):
            host.objects.filter(id=postData['id'], hostName=postData['hostName']).delete()
        else:
            code = -1
            msg = "主机不存在"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')
    else:
        return HttpResponse(status=403)
def bindHost(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        code=0
        msg=''
        salt=saltClient()
        if postData["operType"]=='accept':
            saltFun="key.accept"
        elif postData["operType"]=='delete':
            saltFun="key.delete"
        result=salt.OperKey(saltFun,postData['ip'])

        #接受key
        if result[0]["data"]["return"] and postData["operType"]=='accept':
            host.objects.filter(id=postData['id'],ip=postData['ip']).update(isSaltStack=1,status=1)
        elif not result[0]["data"]["return"] and postData["operType"]=='accept':
            code = -1
            msg = "绑定失败"


        #删除key
        if not result[0]["data"]["return"] and postData["operType"]=='delete':
            host.objects.filter(id=postData['id'],ip=postData['ip']).update(isSaltStack=0,status=0)
        elif result[0]["data"]["return"] and postData["operType"]=='delete':
            code = -1
            msg = "解绑失败"

        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')

    else:
        return HttpResponse(status=403)
def modTemplate(request):
    if request.method=='POST':
        code=0
        msg=''
        postData=json.loads(request.body.decode())
        if postData['method']=='add':
            if not appTemplate.objects.filter(appTemplateName=postData['templateName']):
                appTemplate.objects.create(appTemplateName=postData['templateName'],startCmd=postData['startCmd'],stopCmd=postData['stopCmd'])
            else:
                code=-1
                msg='模板名已存在'
        elif postData['method']=='update':
            if not appTemplate.objects.filter(~Q(id=postData['id']),appTemplateName=postData['templateName']):
                appTemplate.objects.filter(id=postData['id']).update(appTemplateName=postData['templateName'],startCmd=postData['startCmd'],stopCmd=postData['stopCmd'])
            else:
                code=-1
                msg='模板名已存在'
        elif postData['method']=='del':
            if appTemplate.objects.filter(id=postData['id'],appTemplateName=postData['templateName']):
                appTemplate.objects.filter(id=postData['id'],appTemplateName=postData['templateName']).delete()
            else:
                code=-1
                msg='删除失败'

        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')

    else:
        return  HttpResponse(status=403)
def getTemplate(request):
    if request.method=='POST':
        appTemp=list(appTemplate.objects.all().values_list('appTemplateName'))
        return HttpResponse(json.dumps(appTemp),content_type='application/json')
    else:
        return HttpResponse(status=403)
def getWebTemplate(request):
    if request.method=='POST':
        webTemp=list(webTemplate.objects.all().values_list('webTemplateName'))
        return  HttpResponse(json.dumps(webTemp),content_type='application/json')
    else:
        return HttpResponse(status=403)
def getAapplication(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        hostApp=rawQuerytoList(hostApplication.objects.raw(getsql('hostAppsql'),postData))
        for i in range(0,len(hostApp)):
            hostApp[i]['webApp']=rawQuerytoList(webApplication.objects.raw(getsql('webAppSql'),{'aId':hostApp[i]['id']}))
        return HttpResponse(json.dumps(hostApp),content_type='application/json')
    else:
        return HttpResponse(status=403)
#添加删除修改web应用
def modWebApplication(request):
    if request.method=='POST':
        postData = json.loads(request.body.decode())
        rep = {'code': 0, 'msg': ''}
        try:
            hostApp = hostApplication.objects.get(id=postData['appId'])
            if hostApp.status !=0:
                rep['code'] = -1
                rep['msg'] = "应用不是停止状态不能操作"
                return HttpResponse(json.dumps(rep), content_type='application/json')
        except:
            rep['code'] = -1
            rep['msg'] = "应用不存在"
            return HttpResponse(json.dumps(rep), content_type='application/json')
        if postData['method']=='addWeb':
            try:
                webTemp=webTemplate.objects.get(webTemplateName=postData['webAppName'])
            except:
                rep['code'] = -1
                rep['msg'] = "web模板不存在"
                return HttpResponse(json.dumps(rep), content_type='application/json')
            if webApplication.objects.filter(webTempId=webTemp.id,hostAppId=hostApp.id):
                rep['code'] = -1
                rep['msg'] = "web应用已存在"
                return HttpResponse(json.dumps(rep), content_type='application/json')
            webApplication.objects.create(webTempId=webTemp,hostAppId=hostApp)
        elif postData['method']=='delWeb':
            webApp=webApplication.objects.filter(id=postData['appId'])
            if webApp:
                webApplication.objects.filter(id=postData['appId']).delete()
            else:
                rep['code'] = -1
                rep['msg'] = "web应用不存在"
        return HttpResponse(json.dumps(rep), content_type='application/json')
    else:
        return HttpResponse(status=403)
#添加删除修改应用
def modApplication(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        rep={'code':0,'msg':''}
        if postData['method']!='add':
            try:
                hostApp = hostApplication.objects.get(id=postData['id'])
                if hostApp.status !=0:
                    rep['code'] = -1
                    rep['msg'] = "应用不是停止状态不能操作"
                    return HttpResponse(json.dumps(rep), content_type='application/json')
            except:
                rep['code'] = -1
                rep['msg'] = "应用不存在"
                return HttpResponse(json.dumps(rep), content_type='application/json')
        if postData['method']=='add':
            hostInfo = host.objects.get(id=postData['hostId'])
            try:
                template = appTemplate.objects.get(appTemplateName=postData['appTempName'])
            except:
                template = ''
            app=hostApplication.objects.filter(Q(hostId=postData['hostId']),
                                               Q(hostAppName=postData['appName'])
                                               |Q(appPath=postData['appPath'])
                                               |Q(appPort=postData['appPort']))
            if template:
                if not app:
                    hostApplication.objects.create(hostAppName=postData['appName'],
                                                   hostId=hostInfo,
                                                   appPath=postData['appPath'],
                                                   appPort=postData['appPort'],
                                                   appTempId=template)
                else:
                    rep['code']=-1
                    rep['msg']='应用名或应用端口、应用路径重复'

            else:
                rep['code']=-1
                rep['msg']='没有这个应用模板'
        elif postData['method']=='modify':
            try:
                template = appTemplate.objects.get(appTemplateName=postData['appTempName'])
            except:
                template = ''
            app = hostApplication.objects.filter(~Q(id=postData['id']),
                                                 Q(hostId=postData['hostId']),
                                                 Q(hostAppName=postData['appName'])
                                                 |Q(appPath=postData['appPath'])
                                                 |Q(appPort=postData['appPort']))
            if template:
                if not app:
                    hostApplication.objects.filter(id=postData['id']).update(
                                                    appTempId=template,
                                                    hostAppName=postData['appName'],
                                                    appPath=postData['appPath'],
                                                    appPort=postData['appPort'],
                                                    )
                else:
                    rep['code'] = -1
                    rep['msg'] = '应用名或应用端口、应用路径重复'
            else:
                rep['code'] = -1
                rep['msg'] = '没有这个应用模板'
        elif postData['method']=='del':
            app=hostApplication.objects.filter(id=postData['id'])
            if app:
                hostApplication.objects.filter(id=postData['id']).delete()
            else:
                rep['code'] = -1
                rep['msg'] = '没有这个应用'
        return HttpResponse(json.dumps(rep),content_type='application/json')
    else:
        return HttpResponse(status=403)
#启动停止应用
def startStopApp(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        rep = {'code':0,'msg':''}
        try:
            app=hostApplication.objects.get(id=postData['id'])
        except:
            rep['code'] = -1
            rep['msg'] = '没有这个应用'
            return HttpResponse(json.dumps(rep), content_type='application/json')
        try:
            hostInfo = host.objects.get(id=app.hostId.id)
            if hostInfo.status !=1:
                rep['code'] = -1
                rep['msg'] = '主机状态异常不能执行命令'
                return HttpResponse(json.dumps(rep), content_type='application/json')
        except:
            rep['code'] = -1
            rep['msg'] = '主机不存在'
            return HttpResponse(json.dumps(rep), content_type='application/json')
        try:
            appTemp = appTemplate.objects.get(id=app.appTempId.id)
        except:
            rep['code'] = -1
            rep['msg'] = '模板或不存在'
            return HttpResponse(json.dumps(rep), content_type='application/json')
        salt = saltClient()
        if postData["method"]=='start':
            if app.status!=0:
                rep['code'] = -1
                rep['msg'] = '应用不在停止状态'
                return HttpResponse(json.dumps(rep), content_type='application/json')
            cmd=appTemp.startCmd.replace("{{path}}",app.appPath)
            result=salt.AsyncCmd(hostInfo.ip,cmd)
            if 'jid' not in result[0].keys():
                print(result)
                rep['code'] = -1
                rep['msg'] = '应用启动失败'
                return HttpResponse(json.dumps(rep), content_type='application/json')
            else:
                for item in result:
                    taskState.objects.create(jid=item['jid'],
                                             appId=app.id,
                                             cmd=cmd,
                                             status=0,
                                             start_time=datetime.now(),
                                             cmd_type=0
                                             )
                hostApplication.objects.filter(id=postData['id']).update(status=2)
        return HttpResponse(json.dumps(rep),content_type='application/json')
    else:
        return  HttpResponse(status=403)