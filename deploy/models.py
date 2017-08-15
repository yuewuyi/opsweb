from django.db import models

# Create your models here.
#host表
class host(models.Model):
    hostName=models.CharField(null=False,max_length=50)
    ip=models.GenericIPAddressField(null=False)
    isSaltStack=models.BooleanField(null=False,default=0,max_length=1)
    status=models.BooleanField(null=False,default=0,max_length=1)
    class Meta:
        db_table = 'Host'