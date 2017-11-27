from __future__ import absolute_import
from celery import task
from utils.salt_Client import saltClient
from deploy.models import host,taskState,saltReturns,hostApplication
from django.db.models import Q
import datetime
#发现salt key和修改salt绑定状态
@task
def HostKeyFind():
    SC = saltClient()
    keyList=SC.OperKey("key.list","unaccepted")[0]["data"]["return"]["minions_pre"]
    if len(keyList) !=0:
        hostList=list(host.objects.filter(Q(isSaltStack=0)|Q(isSaltStack=2)).values('ip','isSaltStack'))
        for item in hostList:
            ip=item['ip']
            isSaltStack=item['isSaltStack']
            if ip in keyList and isSaltStack==0:
                host.objects.filter(ip=ip).update(isSaltStack=2)
            elif ip not in keyList and isSaltStack==2:
                host.objects.filter(ip=ip).update(isSaltStack=0)
@task
def HostStatusCheck():
    salt=saltClient()
    MinionStatus=salt.MinionStatus()[0]
    hostList=list(host.objects.filter().values('ip','status'))
    for item in hostList:
        ip = item['ip']
        status = item['status']
        if ip in MinionStatus["up"] and status==0:
            host.objects.filter(ip=ip).update(status=1)
        elif ip in MinionStatus["down"] and status==1:
            host.objects.filter(ip=ip).update(status=0)
        elif ip not in MinionStatus["down"] and ip not in MinionStatus["up"] and status==1:
            host.objects.filter(ip=ip).update(isSaltStack=0,status=0)
@task
def TaskCheck():
    today=datetime.date.today()
    taskList=list(taskState.objects.filter(status=0,start_time__gte=today).values('id','jid','cmd_type','appId'))
    for item in taskList:
        TaskRetCode=list(saltReturns.objects.filter(jid=item['jid']).values('retcode'))
        if TaskRetCode:
            TaskRetCode=TaskRetCode[0]
            if TaskRetCode!=0:
                taskState.objects.filter(id=item['id']).update(status=1,end_time=datetime.datetime.now())
            else:
                taskState.objects.filter(id=item['id']).update(status=2,end_time=datetime.datetime.now())
            if item['cmd_type']==0:
                hostApplication.objects.filter(id=item['appId']).update(status=1)
            elif item['cmd_type']==1:
                hostApplication.objects.filter(id=item['appId']).update(status=0)











