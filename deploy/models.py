from django.db import models
from utils.customField import UnixTimestampField
# Create your models here.
#host表
class host(models.Model):
    hostName=models.CharField(null=False,max_length=50,unique=True)
    ip=models.GenericIPAddressField(null=False,unique=True)
    isSaltStack=models.SmallIntegerField(null=False,default=0)
    status=models.SmallIntegerField(null=False,default=0)
    class Meta:
        db_table = 'Host'
class jids(models.Model):
    jid=models.CharField(unique=True,max_length=191,null=False)
    load=models.TextField(null=False)
    class Meta:
        db_table='jids'
class saltReturns(models.Model):
    fun=models.CharField(null=False,max_length=255)
    jid = models.CharField(unique=True, max_length=191,null=False)
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