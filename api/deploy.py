import json
from deploy.models import *
from django.db.models import Q
from utils.salt_Client import saltClient
from django.http import HttpResponse
from utils.raw_sql import *
from datetime import datetime
import os
import random
from django.conf import settings
import hashlib
from utils.config import app_config
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
        else:
            code = -1
            msg = '未知操作'

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
        postData=json.loads(request.body.decode())
        if postData['method']=='web':
            data=list(webTemplate.objects.all().values_list('webTemplateName'))
        elif postData['method']=='appGroup':
            data = list(app_group.objects.all().values_list('group_name'))
        elif postData['method']=='webApp':
            data = list(webTemplate.objects.all().values_list('webTemplateName'))
            data +=list(appTemplate.objects.all().values_list('appTemplateName'))
        return  HttpResponse(json.dumps(data),content_type='application/json')
    else:
        return HttpResponse(status=403)
def modWebTemplate(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        rep = {'code': 0, 'msg': '','result':[]}
        if postData['method']=='add':
            if webTemplate.objects.get_or_create(webTemplateName=postData['name'])[1]:
                webTemplateName=list(webTemplate.objects.all().values('webTemplateName'))
                for item in webTemplateName:
                    rep['result'].append(item['webTemplateName'])
            else:
                rep['code']=-1
                rep['msg']='模板名已存在'
        elif postData['method']=='del':
            try:
                webTemplate.objects.filter(webTemplateName=postData['name']).delete()
                webTemplateName = list(webTemplate.objects.all().values('webTemplateName'))
                for item in webTemplateName:
                    rep['result'].append(item['webTemplateName'])
            except:
                rep['code'] = -1
                rep['msg'] = '删除失败'
        elif postData['method']=='addGroup':
            if app_group.objects.get_or_create(group_name=postData['name'])[1]:
                webTemplateName=list(app_group.objects.all().values('group_name'))
                for item in webTemplateName:
                    rep['result'].append(item['group_name'])
            else:
                rep['code']=-1
                rep['msg']='模板名已存在'
        elif postData['method']=='delGroup':
            try:
                app_group.objects.filter(group_name=postData['name']).delete()
                webTemplateName = list(app_group.objects.all().values('group_name'))
                for item in webTemplateName:
                    rep['result'].append(item['group_name'])
            except Exception as e:
                print(e)
                rep['code'] = -1
                rep['msg'] = '删除失败'
        return HttpResponse(json.dumps(rep),content_type="application/json")
    else:
        return  HttpResponse(status=403)
def getAapplication(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        hostApp=rawQuerytoList(hostApplication.objects.raw(getsql('hostAppsql'),postData))
        for i in range(0,len(hostApp)):
            hostApp[i]['webApp']=rawQuerytoList(webApplication.objects.raw(getsql('webAppSql'),{'aId':hostApp[i]['id']}))
            if hostApp[i]['status']==5 or hostApp[i]['status']==6 or hostApp[i]['status']==7 or hostApp[i]['status']==9 or hostApp[i]['status']==10:
                hostApp[i]['msg']=saltReturns.objects.filter(jid=hostApp[i]['jid']).first().returns
            else:
                hostApp[i]['msg']=''
        return HttpResponse(json.dumps(hostApp),content_type='application/json')
    else:
        return HttpResponse(status=403)
#添加删除修改web应用
def modWebApplication(request):
    if request.method=='POST':
        postData = json.loads(request.body.decode())
        rep = {'code': 0, 'msg': ''}
        if postData['method']=='addWeb':
            try:
                hostApp=hostApplication.objects.get(id=postData['appId'])
            except:
                rep['code'] = -1
                rep['msg'] = "没有这个应用"
                return HttpResponse(json.dumps(rep), content_type='application/json')
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
        else:
            rep['code'] = -1
            rep['msg'] = '未知操作'
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
        else:
            rep['code'] = -1
            rep['msg'] = '未知操作'
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
                rep['code'] = -1
                rep['msg'] = '应用启动失败'
                return HttpResponse(json.dumps(rep), content_type='application/json')
            else:
                hostApplication.objects.filter(id=postData['id']).update(status=2,jid=result[0]['jid'],jidState=1)
        elif postData["method"]=='stop':
            if app.status!=1:
                rep['code'] = -1
                rep['msg'] = '应用不在启动状态'
                return HttpResponse(json.dumps(rep), content_type='application/json')
            cmd=appTemp.stopCmd.replace("{{path}}",app.appPath)
            result = salt.AsyncCmd(hostInfo.ip,cmd)
            if 'jid' not in result[0].keys():
                rep['code'] = -1
                rep['msg'] = '应用启动失败'
                return HttpResponse(json.dumps(rep), content_type='application/json')
            else:
                for item in result:
                    taskState.objects.create(jid=item['jid'],
                                             appId=app.id,
                                             cmd=cmd,
                                             status=0,
                                             cmd_type=1
                                             )
                hostApplication.objects.filter(id=postData['id']).update(status=3, jid=result[0]['jid'], jidState=1)
        elif postData['method']=='reset':
            proCheckCmd = "ps axu|grep "+app.appPath+"|grep -v 'grep'|wc -l"
            ip = host.objects.filter(id=app.hostId_id).first().ip
            num = int(salt.syncCmd(ip, proCheckCmd)[0][ip])
            print(num)
            if num >0:
                hostApplication.objects.filter(id=postData['id']).update(status=1)
            elif num==0:
                hostApplication.objects.filter(id=postData['id']).update(status=0)
        else:
            rep['code'] = -1
            rep['msg'] = '未知操作'
        return HttpResponse(json.dumps(rep),content_type='application/json')
    else:
        return  HttpResponse(status=403)



#文件上传完成后的处理接口
def fileManager(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        rep={'code':0,'msg':''}
        if postData['method']=='checkSum':
            file=settings.UPLOADFILEPATH+postData['upDate']+'/'+postData['fileName']+'.filetemp'
            if not os.path.exists(file):
                rep['code'] = -1
                rep['msg'] = '文件不存在'
                return  HttpResponse(json.dumps(rep),content_type='application/json')
            f=open(file,'rb')
            fdata=f.read()
            f.close()
            fmd5=hashlib.md5()
            fmd5.update(fdata)
            if postData['checkSum']==fmd5.hexdigest():
                if appVersionManage.objects.filter(id=postData['id']):
                    appVersionManage.objects.filter(id=postData['id']).update(fileName=postData['fileName'],filePath=settings.UPLOADFILEPATH+postData['upDate']+'/')
                    os.rename(file,settings.UPLOADFILEPATH+postData['upDate']+'/'+postData['fileName'])
                else:
                    rep['code'] = -1
                    rep['msg'] = '文件id不存在'
                    return HttpResponse(json.dumps(rep), content_type='application/json')
            else:
                rep['code']=-1
                rep['msg']='检验码不正确'
            return HttpResponse(json.dumps(rep),content_type='application/json')
    else:
        return HttpResponse(status=403)



#文件接收接口
def uploadFile(request):
    if  request.method=='POST':
        filename = request.POST.get('name', '')
        upDate=request.POST.get('upDate')
        filePath=settings.UPLOADFILEPATH+upDate
        if not os.path.exists(filePath):
            os.makedirs(filePath)
        blob=request.FILES['file'].read()
        file=open(filePath+'/'+filename+'.filetemp','ab+')
        file.write(blob)
        file.close()
        return HttpResponse('')
    else:
        return HttpResponse(status=403)



#文件信息增删改
def modAppFile(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        rep = {'code': 0, 'msg': ''}
        if postData['method']=='add' or postData['method']=='modify':
            # 判断是否有这个模板名
            if postData['type'] == 0:
                try:
                    appTemplate.objects.get(appTemplateName=postData['appTemplate'])
                except:
                    rep['code'] = -1
                    rep['msg'] = '没有这个应用模板'
                    return HttpResponse(json.dumps(rep), content_type="application/json")
            elif postData['type'] == 1:
                try:
                    webTemplate.objects.get(webTemplateName=postData['appTemplate'])
                except:
                    rep['code'] = -1
                    rep['msg'] = '没有这个web应用模板'
                    return HttpResponse(json.dumps(rep), content_type="application/json")
            try:
                app_group.objects.get(group_name=postData['appGroup'])
            except:
                rep['code'] = -1
                rep['msg'] = '没有这个应用组'
                return HttpResponse(json.dumps(rep), content_type="application/json")
        if postData['method']=='add':
            # 判断应用版本是否重复
            if appVersionManage.objects.filter(version=postData['version'],
                                               appTemplateName=postData['appTemplate']).count() != 0:
                rep['code'] = -1
                rep['msg'] = '同一应用版本不能重复'
                return HttpResponse(json.dumps(rep), content_type="application/json")
            appVersionManage.objects.create(version=postData['version'],
                                            type=postData['type'],
                                            appTemplateName=postData['appTemplate'],
                                            filePackType=postData['packType'],
                                            appGroupName=postData['appGroup'],
                                            name=postData['name'],
                                            remark=postData['remark'])
            return HttpResponse(json.dumps(rep), content_type="application/json")
        elif postData['method']=='modify':
            # 判断应用版本是否重复
            if appVersionManage.objects.filter(Q(version=postData['version']),
                                               Q(appTemplateName=postData['appTemplate']),~Q(id=postData['id'])).count() != 0:
                rep['code'] = -1
                rep['msg'] = '同一应用版本不能重复'
                return HttpResponse(json.dumps(rep), content_type="application/json")
            appVersionManage.objects.filter(id=postData['id']).update(
                version=postData['version'],
                type=postData['type'],
                appGroupName=postData['appGroup'],
                appTemplateName=postData['appTemplate'],
                filePackType=postData['packType'])
            return HttpResponse(json.dumps(rep), content_type="application/json")
        elif postData['method']=='del':
            try:

                file=appVersionManage.objects.get(id=postData['id'])
                if file.filePath and file.fileName:
                    filename = file.filePath +file.fileName
                else:
                    filename=''
            except Exception as e:
                rep['code'] = -1
                rep['msg'] = '文件不存在'
                return HttpResponse(json.dumps(rep), content_type="application/json")
            if os.path.exists(filename):
                os.remove(filename)
            appVersionManage.objects.filter(id=postData['id']).delete()
            return HttpResponse(json.dumps(rep), content_type="application/json")
        else:
            return HttpResponse(status=403)
    else:
        return  HttpResponse(status=403)
#获取相应的文件信息
def getFileInfo(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        if postData['type']==0:
            tempId=hostApplication.objects.get(id=postData['id']).appTempId_id
            tempName=appTemplate.objects.get(id=tempId).appTemplateName
        elif postData['type']==1:
            tempId = webApplication.objects.get(id=postData['id']).webTempId_id
            tempName=webTemplate.objects.get(id=tempId).webTemplateName
        if postData['fileType']==0:
            fileInfo=list(appVersionManage.objects.filter(appTemplateName=tempName,fileName__isnull=False).values('id','version','create_date','filePackType','type'))
        elif postData['fileType']==1:
            fileInfo=list(app_backup.objects.filter(appTemplate=tempName,hostId=postData['hostId'],backState=1).values('id','version','create_date','appName','type'))
        for i in range(len(fileInfo)):
            fileInfo[i]['create_date']=datetime.strftime(fileInfo[i]['create_date'],'%Y-%m-%d %H:%M:%S')
        return HttpResponse(json.dumps(fileInfo),content_type='application/json')
    else:
        return HttpResponse(status=403)
def deployOrBackUp(request):
    if request.method=='POST':
        conf = app_config()
        conf_dit=conf.get_config_value()
        postData=json.loads(request.body.decode())
        rep = {'code': 0, 'msg': ''}
        try:
            if postData['appType']==0:
                app=hostApplication.objects.get(id=postData['appId'])
            elif postData['appType']==1:
                app=hostApplication.objects.get(id=postData['appId'])
                webapp=webApplication.objects.get(id=postData['webId'])
        except Exception as e:
            print(e)
            rep['code']=-1
            rep['msg']='应用不存在'
            return  HttpResponse(json.dumps(rep),content_type='application/json')
        if app.status !=0:
            rep['code'] = -1
            rep['msg'] = '应用不在停止状态'
            return HttpResponse(json.dumps(rep), content_type='application/json')
        date=datetime.strftime(datetime.today(),'%Y%m%d%H%M%S')+str(random.randint(0,10000))
        hostInfo = host.objects.get(id=app.hostId_id)
        if postData['method']=='backup':
            if postData['appType']==0:
                templateName=appTemplate.objects.get(id=app.appTempId_id).appTemplateName
                fileName=templateName+'-'+date+'.zip'
                cmd="cd "+app.appPath+' && zip -r /server/backup/'+fileName+' ./*'
            elif postData['appType']==1:
                templateName=webTemplate.objects.get(id=webApplication.objects.get(hostAppId=postData['appId']).webTempId_id).webTemplateName
                fileName = templateName + '-' + date + '.zip'
                cmd = "cd " + app.appPath + '/webapps/'+templateName+' && zip -r /server/backup/' + fileName + ' ./*'
            salt = saltClient()
            result = salt.AsyncCmd(hostInfo.ip, cmd)[0]['jid']
            app_backup.objects.create(hostId=hostInfo,
                                      appTemplate=templateName,
                                      appName=app.hostAppName,
                                      fileName='/server/backup/' + fileName,
                                      version=datetime.strftime(datetime.today(), '%Y%m%d%H%M%S'),
                                      create_date=datetime.today(),
                                      type=postData['appType'],
                                      jid=result)
            hostApplication.objects.filter(id=postData['appId']).update(status=8, jid=result, jidState=1)
        elif postData['method']=='deployApp':
            cmd=''
            try:
                fileInfo=appVersionManage.objects.get(id=postData['fileId'])
            except:
                rep['code'] = -1
                rep['msg'] = '文件不存在'
                return HttpResponse(json.dumps(rep), content_type='application/json')
            if postData['appType'] == 0:
                cmd="""
                    cd /tmp && if [ ! -f %(fileName)s ]; then curl -O %(fileUrl)s%(fileDownLoadPath)s%(fileName)s; fi  && rm -rf %(filePath)s && mkdir -p %(filePath)s && unzip -o %(fileName)s -d %(filePath)s 
                """%{"fileName":fileInfo.fileName,
                     "filePath":app.appPath,
                     "fileUrl":conf_dit['file_download_url'][0],
                     "fileDownLoadPath":'/static/appFile'+fileInfo.filePath.split('static/appFile')[-1]}
                print(cmd)
            elif postData['appType'] == 1:
                pass
        return  HttpResponse(json.dumps(rep),content_type='application/json')
    else:
        return HttpResponse(status=403)