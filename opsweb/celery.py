from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'opsweb.settings')
app = Celery('opsweb')
#自动搜索所有已注册app内的tasks文件
app.autodiscover_tasks()
#namespace表示获取CELERY前缀的所有配置
app.config_from_object('django.conf:settings', namespace='CELERY')
@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
app.conf.beat_schedule = {
    'hostKeyFind-10-seconds': {
        'task': 'deploy.tasks.HostKeyFind',
        'schedule': 10.0,
        'args': ()
    },
    'HostStatusCheck-10-seconds': {
        'task': 'deploy.tasks.HostStatusCheck',
        'schedule': 10.0,
        'args': ()
    }
}