from django.db import models
class abnormal_value(models.Model):
    id=models.AutoField(primary_key=True)
    ip=models.GenericIPAddressField(null=False,unique=True)
    itemid=models.IntegerField(null=False,default=0)
    timestampunix=models.IntegerField(null=False,default=0)
    unit=models.CharField(max_length=3)
    value=models.BigIntegerField(null=False,default=0)
    class Meta:
        db_table = 'abnormal_value'