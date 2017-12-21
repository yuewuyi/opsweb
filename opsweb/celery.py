from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from datetime import timedelta
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'opsweb.settings')
app = Celery('opsweb')
#自动搜索所有已注册app内的tasks文件
app.autodiscover_tasks()
#namespace表示获取CELERY前缀的所有配置
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.beat_schedule = {
    'hostKeyFind-10-seconds': {
        'task': 'deploy.tasks.HostKeyFind',
        'schedule': timedelta(seconds=30),
        'args': ()
    },
    'HostStatusCheck-10-seconds': {
        'task': 'deploy.tasks.HostStatusCheck',
        'schedule': timedelta(seconds=30),
        'args': ()
    },
    'TaskCheck-2-seconds':{
        'task':'deploy.tasks.TaskCheck',
        'schedule':timedelta(seconds=2),
        'args':()
    }
}