from celery import task
from utils.salt_Client import saltClient
from deploy.models import host,taskState,saltReturns,hostApplication,app_backup
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
#检查minion的状态
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
#任务检查
@task
def TaskCheck():
    taskList=list(hostApplication.objects.filter(jidState=1).values('id','hostId','appPath','status','jid'))
    salt = saltClient()
    for item in taskList:
        proCheckCmd = "ps axu|grep "+item['appPath']+"|grep -v 'grep'|wc -l"
        ip=host.objects.filter(id=item['hostId']).first().ip
        TaskInfo = saltReturns.objects.filter(jid=item['jid']).first()
        if not TaskInfo:
            continue
        #检查启动
        if item['status']==2:
            num = int(salt.syncCmd(ip, proCheckCmd)[0][ip])
            if TaskInfo.retcode==0 and num>0:
                hostApplication.objects.filter(id=item['id']).update(status=1,jidState=0)
            elif TaskInfo.retcode==0 and num==0:
                hostApplication.objects.filter(id=item['id']).update(status=7, jidState=0)
            else:
                hostApplication.objects.filter(id=item['id']).update(status=5,jidState=0)
        # 检查关闭
        elif item['status']==3:
            num = int(salt.syncCmd(ip, proCheckCmd)[0][ip])
            if TaskInfo.retcode==0 and num==0:
                hostApplication.objects.filter(id=item['id']).update(status=0,jidState=0)
            elif TaskInfo.retcode==0 and num>1:
                hostApplication.objects.filter(id=item['id']).update(status=7, jidState=0)
            else:
                hostApplication.objects.filter(id=item['id']).update(status=6,jidState=0)
        #检查备份
        elif item['status']==8:
            if TaskInfo.retcode==0:
                hostApplication.objects.filter(id=item['id']).update(status=0, jidState=0)
                app_backup.objects.filter(jid=item['jid']).update(backState=1)
            elif TaskInfo.retcode!=0:
                hostApplication.objects.filter(id=item['id']).update(status=9, jidState=0)
                app_backup.objects.filter(jid=item['jid'],backState=0).delete()
        # 检查部署
        elif item['status']==4:
            if TaskInfo.retcode==0:
                hostApplication.objects.filter(id=item['id']).update(status=0, jidState=0)
            elif TaskInfo.retcode!=0:
                hostApplication.objects.filter(id=item['id']).update(status=10, jidState=0)











