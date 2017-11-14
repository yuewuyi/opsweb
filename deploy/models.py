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
    appPath=models.CharField(max_length=255,null=False)
    #应用端口
    appPort=models.IntegerField()
    #应用状态 0-异常 1-正常 3-启动中 4-停止中
    status=models.IntegerField(null=False,default=0)
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
class jids(models.Model):
    jid=models.CharField(unique=True,max_length=191,null=False)
    load=models.TextField(null=False)
    class Meta:
        db_table='jids'
class saltReturns(models.Model):
    fun=models.CharField(null=False,max_length=255)
    jid = models.CharField(max_length=191,null=False)
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
