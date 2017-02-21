from django.db import models
class Config(models.Model):
    config_key=models.CharField(max_length=40,null=True)
    config_item1=models.CharField(max_length=100,null=True)
    config_item2 = models.CharField(max_length=100, null=True)
    create_time=models.DateField(auto_now_add=True)
    update_time=models.DateField(auto_now=True,blank=False)
    class Meta:
        db_table='Config'
# Create your models here.
