from django.db import models
class abnormal_value(models.Model):
    id=models.AutoField(primary_key=True)
    hostName=models.CharField(null=False,max_length=255,default='')
    itemid=models.IntegerField(null=False,default=0)
    timestampunix=models.IntegerField(null=False,default=0)
    unit=models.CharField(max_length=3)
    value=models.FloatField(default=0,null=False)
    valueType=models.IntegerField(null=False,default=0)
    itemName=models.CharField(null=False,max_length=255,default='')
    class Meta:
        db_table = 'abnormal_value'