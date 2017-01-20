from django.db import models

# Create your models here.
#User表
class User(models.Model):
    user=models.CharField(max_length=20,null=False)
    pwd=models.CharField(max_length=600, null=False)
    is_up=models.BooleanField(null=False,default=0)
    is_show=models.BooleanField(null=False,default=0)
    is_config=models.BooleanField(null=False,default=0)
    is_admin=models.BooleanField(null=False,default=0)
    create_time=models.DateTimeField(auto_now=True)
    update_time = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'User'