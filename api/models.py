from django.db import models
class Config(models.Model):
    config_key=models.CharField(max_length=40,null=True)
    config_item=models.CharField(max_length=100,null=True)
    create_time=models.DateField(auto_now=True)
    update_time=models.DateField(auto_now=True)
    class Meta:
        db_table='Config'

# Create your models here.
