from __future__ import absolute_import
from celery import task
from utils.salt_Client import saltClient
from deploy.models import host
from django.db.models import Q
@task
#发现salt key和修改salt绑定状态
def HostKeyFind():
    SC = saltClient()
    keyList=SC.OperKey("key.list","unaccepted")[0]["data"]["return"]["minions_pre"]
    if len(keyList) !=0:
        hostList=list(host.objects.filter(Q(isSaltStack=0)|Q(isSaltStack=2)).values('ip','isSaltStack'))
        for i in range(len(hostList)):
            ip=hostList[i]['ip']
            isSaltStack=hostList[i]['isSaltStack']
            if ip in keyList and isSaltStack==0:
                host.objects.filter(ip=ip).update(isSaltStack=2)
            elif ip not in keyList and isSaltStack==2:
                host.objects.filter(ip=ip).update(isSaltStack=0)
@task
def HostStatusCheck():
    salt=saltClient()
    MinionStatus=salt.MinionStatus()
    print(MinionStatus)






