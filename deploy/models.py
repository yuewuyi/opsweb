from django.db import models
from utils.customField import UnixTimestampField
# Create your models here.
#host表
class host(models.Model):
    #主机ID
    id=models.AutoField(primary_key=True)
    #主机名
    hostName=models.CharField(null=False,max_length=50,unique=True)
    #ip
    ip=models.GenericIPAddressField(null=False,unique=True)
    #是否已经和salt绑定 0-未绑定 1-已绑定 2-待绑定
    isSaltStack=models.SmallIntegerField(null=False,default=0)
    #saltMinion状态 0-异常 1-正常
    status=models.SmallIntegerField(null=False,default=0)
    class Meta:
        db_table = 'host'
#应用模板表
class appTemplate(models.Model):
    # 应用模板ID
    id = models.AutoField(primary_key=True)
    #应用名
    appTemplateName=models.CharField(null=False,max_length=50,unique=True)
    #启动命令
    startCmd=models.CharField(max_length=255)
    #停止命令
    stopCmd=models.CharField(max_length=255)
    class Meta:
        db_table='appTemplate'

#web模板表
class webTemplate(models.Model):
    #web模板ID
    id = models.AutoField(primary_key=True)
    #应用名
    webTemplateName=models.CharField(null=False,max_length=50,unique=True)
    class Meta:
        db_table='webTemplate'

# web模板表
class app_group(models.Model):
    # web模板ID
    id = models.AutoField(primary_key=True)
    # 应用名
    group_name = models.CharField(null=False, max_length=50, unique=True)
    class Meta:
        db_table = 'app_group'
#应用备份表
class app_backup(models.Model):
    #web备份表id
    id=models.AutoField(primary_key=True)
    #应用名
    appName=models.CharField(null=False,max_length=255,default='')
    #文件名和路径
    fileName=models.TextField(null=False,default='')
    #文件版本
    version=models.CharField(null=False,max_length=255,default=255)
    #创建时间
    create_date=models.DateTimeField()
    class Meta:
        db_table='app_backup'

#host应用表
class hostApplication(models.Model):
    #主机应用ID
    id = models.AutoField(primary_key=True)
    #应用名
    hostAppName=models.CharField(null=False,max_length=50,default='')
    #关联host表ID
    hostId=models.ForeignKey(host,to_field='id',db_column="hostId")
    #关联appTemplate表ID
    appTempId=models.ForeignKey(appTemplate,to_field='id',db_column="appTempId")
    #应用路径
    appPath=models.CharField(max_length=255,null=False,default='')
    #应用端口
    appPort=models.IntegerField()
    #应用状态 0-停止 1-运行 2-启动中 3-停止中 4-部署中 5-启动失败 6-停止失败 7-命令执行成功,程序没反应
    status=models.IntegerField(null=False,default=0)
    #salt任务id
    jid=models.CharField(max_length=255,null=False,db_index=True,default='')
    #salt任务状态 0-已执行 1-执行中
    jidState=models.IntegerField(null=False,default=0)
    class Meta:
        db_table='hostApplication'
#web应用表
class webApplication(models.Model):
    # web应用ID
    id = models.AutoField(primary_key=True)
    # 关联webTemplate表ID
    webTempId=models.ForeignKey(webTemplate,to_field='id',db_column="webTempId")
    # 关联hostApplication表ID
    hostAppId=models.ForeignKey(hostApplication,to_field='id',db_column="hostAppId")
    class Meta:
        db_table='webApplication'
#任务执行表
class taskState(models.Model):
    #任务ID
    id = models.AutoField(primary_key=True)
    #salt任务ID
    jid=models.CharField(max_length=255,null=False,db_index=True)
    #应用ID 0-为自定义命令 0以上则为应用命令
    appId=models.IntegerField(null=False,db_index=True)
    #开始时间
    start_time=models.DateTimeField(auto_now=True)
    #结束时间
    end_time=models.DateTimeField(null=True)
    #命令
    cmd=models.CharField(max_length=255)
    #命令状态 0-执行中 1-执行成功 2-执行失败 3-执行异常
    status=models.IntegerField(default=None)
    #命令类型 0-应用启动命令 1-应用停止命令
    cmd_type=models.IntegerField(default=None)
    class Meta:
        db_table='taskState'
#应用管理表
class appVersionManage(models.Model):
    #ID
    id = models.AutoField(primary_key=True)
    #版本
    version=models.CharField(max_length=255,null=False,default='')
    #创建人
    name=models.CharField(max_length=255,null=False,default='')
    #备注
    remark=models.TextField(null=False,default='')
    #文件名
    fileName=models.CharField(max_length=255,null=True)
    #文件路径
    filePath=models.TextField(null=True)
    #应用类型 0-普通应用 1-web应用
    type=models.IntegerField(null=False)
    #应用模板名
    appTemplateName=models.CharField(max_length=255,null=False,default='')
    #文件包类型 0-完整包 1-补丁包
    filePackType=models.IntegerField()
    #应用组
    appGroupName=models.CharField(max_length=255,null=False,default='')
    #创建时间
    create_date=models.DateTimeField(auto_now=True)
    class Meta:
        db_table='appVersionManage'
class jids(models.Model):
    jid=models.CharField(unique=True,max_length=191,null=False)
    load=models.TextField(null=False)
    class Meta:
        db_table='jids'
class saltReturns(models.Model):
    fun=models.CharField(null=False,max_length=255)
    jid = models.CharField(max_length=255,null=False)
    minion_id = models.CharField(max_length=255,null=False)
    success=models.CharField(max_length=255)
    full_ret=models.TextField(null=False)
    alert_time=UnixTimestampField(auto_created=True,null=False)
    returns=models.TextField(null=False)
    retcode=models.IntegerField(null=False)
    class Meta:
        db_table='salt_returns'
# class saltEvents(models.Model):
#     id=models.BigIntegerField(null=False,primary_key=True)
#     tag=models.CharField(max_length=255,null=False)
#     data=models.TextField(null=False)
#     alert_time = UnixTimestampField(auto_created=True,null=False)
#     matser_id=models.CharField(max_length=255,null=False)
#     class Meta:
#         db_table='salt_events'
